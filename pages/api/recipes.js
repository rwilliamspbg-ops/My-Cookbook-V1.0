import { db } from '../../lib/db';
import { recipes } from '../../lib/db/schema';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const all = await db.select().from(recipes);
      return res.status(200).json(all);
    }

    if (req.method === 'POST') {
      const {
        title,
        description,
        ingredients,
        instructions,
        prepTime,
        cookTime,
        servings,
        category,
      } = req.body; // JSON from client

      if (!title || !Array.isArray(ingredients) || !Array.isArray(instructions)) {
        return res.status(422).json({ error: 'Invalid recipe payload' });
      }

      const result = await db
        .insert(recipes)
        .values({
          title,
          description,
          ingredients: JSON.stringify(ingredients),
          instructions: JSON.stringify(instructions),
          prep_time: prepTime,
          cook_time: cookTime,
          servings,
          category,
        })
        .returning();

      return res.status(201).json(result[0]);
    }
// pages/api/recipes.js

// Use the server-only better-sqlite3 helper
// eslint-disable-next-line global-require
const db = require('../../lib/db');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const all = db.fetchAllRecipes();
      return res.status(200).json(all);
    }

    // Add other methods (POST, PUT, DELETE) here if needed, all via lib/db.js
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API /api/recipes error:', err);
    return res.status(500).json({
      error: 'Failed to load recipes',
      detail: err.message,
    });
  }
}

