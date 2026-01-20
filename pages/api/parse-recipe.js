import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  max_retries: 1,
});

const MAX_CHARS = 8000;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const URL_FETCH_TIMEOUT_MS = 8000; // 8s

function createFormidable() {
  return formidable({
    multiples: false,
    maxFileSize: MAX_FILE_SIZE_BYTES,
    maxFieldsSize: 1 * 1024 * 1024,
  });
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    URL_FETCH_TIMEOUT_MS
  );

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Non-200 response: ${res.status}`);
    }

    return await res.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

// More permissive: accept any recipe where either
// title or some ingredients or some instructions exist.
function basicRecipeShapeValid(recipe) {
  if (!recipe || typeof recipe !== 'object') return false;

  const { title, ingredients, instructions } = recipe;

  const hasTitle =
    typeof title === 'string' && title.trim().length > 0;
  const hasIngredients =
    Array.isArray(ingredients) &&
    ingredients.some(
      (s) => typeof s === 'string' && s.trim().length > 0
    );
  const hasInstructions =
    Array.isArray(instructions) &&
    instructions.some(
      (s) => typeof s === 'string' && s.trim().length > 0
    );

  if (!hasTitle && !hasIngredients && !hasInstructions) {
    return false;
  }
  return true;
}

function coerceNumberOrNull(value) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed' });
  }

  const form = createFormidable();

  try {
    const [fields, files] = await form.parse(req);

    const inputTypeRaw = fields.inputType?.[0] || 'text';
    const inputType = ['pdf', 'url', 'text'].includes(inputTypeRaw)
      ? inputTypeRaw
      : 'text';

    let extractedText = '';

    if (inputType === 'pdf') {
      const file = files.file?.[0];
      if (!file) {
        return res
          .status(422)
          .json({ error: 'File is required' });
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return res.status(413).json({
          error: 'PDF file too large (max 10MB)',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParseModule = require('pdf-parse');
      // PDFParse is a class, instantiate it
      const parser = new pdfParseModule.PDFParse();
      
      const dataBuffer = await fs.readFile(file.filepath);
      const data = await parser.parse(dataBuffer);
      extractedText = data.text;
    } else if (inputType === 'url') {
      const url = fields.url?.[0];
      if (!url) {
        return res
          .status(400)
          .json({ error: 'URL is required' });
      }

      try {
        const html = await fetchWithTimeout(url);
        const stripped = html.replace(/<[^>]*>/g, ' ');
        extractedText = normalizeWhitespace(stripped);
      } catch {
        extractedText = '';
      }

      // Fallback so we never send an empty string for URL input
      if (!extractedText) {
        extractedText = `Please extract the recipe from this URL: ${url}`;
      }
    } else {
      // inputType === 'text'
      extractedText = fields.text?.[0] || '';
      extractedText = normalizeWhitespace(extractedText);
    }

    // Only block truly empty text input
    if (!extractedText && inputType === 'text') {
      return res
        .status(400)
        .json({ error: 'No text to parse' });
    }

    if (extractedText.length > MAX_CHARS) {
      extractedText = extractedText.slice(0, MAX_CHARS);
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a highly reliable recipe parser.

Your goals:
- If there is any recipe-like content, infer a clear title, ingredients list, and instructions as aggressively as possible.
- If multiple recipes exist, pick the most prominent one.
- If the text truly does not contain a recipe at all, return a JSON object with all fields null/empty.

Return ONLY a JSON object with this exact shape:
{
  "title": string | null,
  "description": string | null,
  "ingredients": string[],
  "instructions": string[],
  "prepTime": number | null,
  "cookTime": number | null,
  "servings": number | null,
  "category": string | null
}

Important:
- When any recipe-like content exists, do your best to infer a short title.
- "ingredients" should list one ingredient per string where possible.
- "instructions" should list one step per string where possible.
- Use null for truly missing scalar fields and [] for truly missing lists.
- Never invent a recipe from thin air; always base everything on the given text.`,
        },
        { role: 'user', content: extractedText },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const message = completion.choices[0]?.message;
    if (!message) {
      return res
        .status(502)
        .json({ error: 'No completion from OpenAI' });
    }

    let parsedRecipe = message.parsed;
    if (!parsedRecipe) {
      if (!message.content) {
        return res
          .status(502)
          .json({ error: 'No content from OpenAI' });
      }
      try {
        parsedRecipe = JSON.parse(message.content);
      } catch {
        return res.status(502).json({
          error:
            'Failed to parse AI response as JSON',
        });
      }
    }

    parsedRecipe.prepTime = coerceNumberOrNull(
      parsedRecipe.prepTime
    );
    parsedRecipe.cookTime = coerceNumberOrNull(
      parsedRecipe.cookTime
    );
    parsedRecipe.servings = coerceNumberOrNull(
      parsedRecipe.servings
    );

    if (!basicRecipeShapeValid(parsedRecipe)) {
      return res.status(422).json({
        error:
          'Invalid or very weak recipe format; please edit manually.',
        recipe: parsedRecipe,
      });
    }

    return res
      .status(200)
      .json({ success: true, recipe: parsedRecipe });
  } catch (error) {
    console.error('Parsing Error (parse-recipe):', error);

    const status =
      error?.message &&
      error.message.includes('maxFileSize')
        ? 413
        : 500;

    return res.status(status).json({
      error:
        status === 413
          ? 'Uploaded file too large'
          : 'Failed to parse recipe',
      detail: error?.message || 'Unknown error',
      stack:
        process.env.NODE_ENV === 'development'
          ? error.stack
          : undefined,
    });
  }
}
