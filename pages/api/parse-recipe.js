import OpenAI from 'openai';
import formidable from 'formidable';
import pdf from 'pdf-parse';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CHARS = 8000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  try {
    const [fields, files] = await form.parse(req);
    let extractedText = '';
    const inputType = fields.inputType?.[0] || 'text';

    // 1. Extract text
    if (inputType === 'pdf' && files.file) {
      const file = files.file[0];
      const dataBuffer = await fs.readFile(file.filepath);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    } else if (inputType === 'url') {
      const url = fields.url?.[0];
      try {
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const html = response.ok ? await response.text() : `Extract from: ${url}`;
        // strip basic HTML tags
        extractedText = html.replace(/<[^>]*>/g, ' ');
      } catch (_err) {
        extractedText = `Please extract the recipe from this URL: ${url}`;
      }
    } else {
      extractedText = fields.text?.[0] || '';
    }

    if (!extractedText) {
      return res.status(400).json({ error: 'No text to parse' });
    }

    // Limit size
    if (extractedText.length > MAX_CHARS) {
      extractedText = extractedText.slice(0, MAX_CHARS);
    }

    // 2. Call OpenAI
    const response = await openai.chat.completions.create({
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
  "prepTime": number,
  "cookTime": number,
  "servings": number,
  "category": string
}

- "ingredients" must be a non-empty array of strings when a recipe is present.
- "instructions" must be a non-empty array of strings when a recipe is present.
- If a field is truly missing, use null (for numbers/strings) or [] (for arrays).
- Never invent an entirely new recipe; always base fields on the provided text.`

        },
        { role: 'user', content: extractedText },
      ],
      response_format: { type: 'json_object' },
    });

    const message = response.choices[0]?.message;

    console.log('OpenAI message:', message); // dev debugging

    // Use parsed if available, otherwise parse string
    let parsedRecipe = message?.parsed;
    if (!parsedRecipe) {
      if (!message?.content) {
        return res.status(500).json({ error: 'No content from OpenAI' });
      }
      parsedRecipe = JSON.parse(message.content);
    }

    // 3. Basic shape validation
    const {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      category,
    } = parsedRecipe;

    if (
      !title ||
      !Array.isArray(ingredients) ||
      !Array.isArray(instructions)
    ) {
      return res.status(422).json({
        error: 'Invalid recipe format',
        recipe: parsedRecipe,
      });
    }

    return res.status(200).json({ success: true, recipe: parsedRecipe });
  } catch (error) {
    console.error('Parsing Error:', error);
    return res.status(500).json({ error: 'Failed to parse recipe', detail: error.message });
  }
}

