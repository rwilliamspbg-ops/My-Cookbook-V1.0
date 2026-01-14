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

export default async function handler(req, res) {
  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);
    let extractedText = '';
    const inputType = fields.inputType?.[0] || 'text';

    if (inputType === 'pdf' && files.file) {
      const file = files.file[0];
      const dataBuffer = await fs.readFile(file.filepath);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    } else if (inputType === 'url') {
  const url = fields.url?.[0];
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) throw new Error('Site blocked request');
    extractedText = await response.text();
  } catch (e) {
    // Fallback: If we can't scrape the site, just send the URL to OpenAI 
    // and let its browsing capabilities/knowledge try to handle it.
    extractedText = `Please extract the recipe from this URL: ${url}`;
  }

    if (!extractedText) return res.status(400).json({ error: 'No text to parse' });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Return ONLY JSON with: title, description, ingredients (array), instructions (array), prepTime, cookTime, servings, category.' },
        { role: 'user', content: `Extract recipe from:\n${extractedText}` }
      ],
      response_format: { type: 'json_object' },
    });

    const parsedRecipe = JSON.parse(response.choices[0].message.content);
    return res.status(200).json({ success: true, recipe: parsedRecipe });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to parse recipe' });
  } // Closes the catch block
} // Closes the export default async function handler
