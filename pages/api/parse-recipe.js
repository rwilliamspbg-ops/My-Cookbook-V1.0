// pages/api/parse-recipe.js
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

// More permissive: accept any recipe where either
// title or some ingredients or some instructions exist.
function basicRecipeShapeValid(recipe) {
  if (!recipe || typeof recipe !== 'object') return false;

  const { title, ingredients, instructions } = recipe;

  const hasTitle = typeof title === 'string' && title.trim().length > 0;
  const hasIngredients =
    Array.isArray(ingredients) &&
    ingredients.some((s) => typeof s === 'string' && s.trim().length > 0);
  const hasInstructions =
    Array.isArray(instructions) &&
    instructions.some((s) => typeof s === 'string' && s.trim().length > 0);

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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = createFormidable();

  try {
    const [fields, files] = await form.parse(req);

const [fields, files] = await form.parse(req);

const inputTypeRaw = fields.inputType?.[0] || 'text';
const inputType = ['pdf', 'url', 'text'].includes(inputTypeRaw)
  ? inputTypeRaw
  : 'text';

let extractedText = '';

if (inputType === 'pdf') {
  const file = files.file?.[0]; // must be "file"
  if (!file) {
    return res.status(422).json({ error: 'File is required' });
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return res
      .status(413)
      .json({ error: 'PDF file too large (max 10MB)' });
  }

  const dataBuffer = await fs.readFile(file.filepath);
  extractedText = dataBuffer.toString('utf-8').trim();
} else if (inputType === 'url') {
  const url = fields.url?.[0];
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
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
  return res.status(400).json({ error: 'No text to parse' });
}

if (extractedText.length > MAX_CHARS) {
  extractedText = extractedText.slice(0, MAX_CHARS);
}
}
