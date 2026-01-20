// pages/api/recipes/[id].js

import { db } from '../../../lib/db';
import { recipes } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // id likely comes in as string; cast as needed for your schema
    const numericId = Number(id);
    const rows = await db.select().from(recipes).where(eq(recipes.id, numericId));
    const recipe = rows[0];

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Normalize ingredients/instructions for the page:
    // if stored as text, keep as-is; the page will split string/array.
    res.status(200).json({ recipe });
  } catch (err) {
    console.error('Error loading recipe', err);
    res.status(500).json({ error: 'Failed to load recipe' });
  }
}
