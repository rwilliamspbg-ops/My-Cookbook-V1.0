import OpenAI from 'openai';
import formidable from 'formidable';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
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
  const timeoutId = setTimeout(() => controller.abort(), URL_FETCH_TIMEOUT_MS);

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

function basicRecipeShapeValid(recipe) {
  if (!recipe || typeof recipe !== 'object') return false;
  const { title, ingredients, instructions } = recipe;
  if (!title || typeof title !== 'string') return false;
  if (!Array.isArray(ingredients) || ingredients.length === 0) return false;
  if (!Array.isArray(instructions) || instructions.length === 0) return false;
  return true;
}

function coerceNumberOrNull(value) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = createFormidable();

  try {
    const [fields, files] = await form.parse(req);

    const inputTypeRaw = fields.inputType?.[0] || 'text';
    const inputType = ['pdf', 'url', 'text'].includes(inputTypeRaw)
      ? inputTypeRaw
      : 'text';

    let extractedText = '';

    // 1. Extract text
    if (inputType === 'pdf') {
      const file = files.file?.[0];
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return res
          .status(413)
          .json({ error: 'PDF file too large (max 10MB)' });
      }

      const dataBuffer = await fs.readFile(file.filepath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = (pdfData.text || '').trim();
    } else if (inputType === 'url') {
      const url = fields.url?.[0];
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      try {
        const html = await fetchWithTimeout(url);
        const stripped = html.replace(/<[^>]*>/g, ' ');
        extractedText = normalizeWhitespace(stripped);
      } catch (err) {
        extractedText = `Please extract the recipe from this URL: ${url}`;
      }
    } else {
      extractedText = fields.text?.[0] || '';
      extractedText = normalizeWhitespace(extractedText);
    }

    if (!extractedText) {
      return res.status(400).json({ error: 'No text to parse' });
    }

    if (extractedText.length > MAX_CHARS) {
      extractedText = extractedText.slice(0, MAX_CHARS);
    }

    // 2. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a recipe parser.
Extract a recipe from the text, even if formatting is messy.

Return ONLY a JSON object with this exact shape:
{
  "title": string,
  "description": string,
  "ingredients": string[],
  "instructions": string[],
  "prepTime": number | null,
  "cookTime": number | null,
  "servings": number | null,
  "category": string | null
}

- "ingredients" must be a non-empty array of strings when a recipe is present.
- "instructions" must be a non-empty array of strings when a recipe is present.
- If a field is truly missing, use null (for numbers/strings) or [] (for arrays).
- Never invent an entirely new recipe; always base fields on the provided text.`,
        },
        { role: 'user', content: extractedText },
      ],
      response_format: { type: 'json_object' },
    });

    const message = completion.choices[0]?.message;
    if (!message) {
      return res.status(502).json({ error: 'No completion from OpenAI' });
    }

    let parsedRecipe = message.parsed;
    if (!parsedRecipe) {
      if (!message.content) {
        return res.status(502).json({ error: 'No content from OpenAI' });
      }
      try {
        parsedRecipe = JSON.parse(message.content);
      } catch (_err) {
        return res.status(502).json({
          error: 'Failed to parse AI response as JSON',
        });
      }
    }

    // Coerce numeric fields
    parsedRecipe.prepTime = coerceNumberOrNull(parsedRecipe.prepTime);
    parsedRecipe.cookTime = coerceNumberOrNull(parsedRecipe.cookTime);
    parsedRecipe.servings = coerceNumberOrNull(parsedRecipe.servings);

    if (!basicRecipeShapeValid(parsedRecipe)) {
      return res.status(422).json({
        error: 'Invalid recipe format',
        recipe: parsedRecipe,
      });
    }

    return res.status(200).json({ success: true, recipe: parsedRecipe });
  } catch (error) {
    console.error('Parsing Error:', error);
    const status =
      error?.message && error.message.includes('maxFileSize')
        ? 413
        : 500;

    return res.status(status).json({
      error:
        status === 413
          ? 'Uploaded file too large'
          : 'Failed to parse recipe',
      detail: error.message,
    });
  }
}

