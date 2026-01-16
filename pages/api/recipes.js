// pages/api/recipes.js

// Server-only SQLite helper (better-sqlite3)
import db from '../../lib/db';
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const all = db.fetchAllRecipes(); // sync better-sqlite3
      return res.status(200).json(all);
    }

        if (req.method === 'POST') {
                const recipe = req.body;
                const stmt = db.prepare(`INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
                const result = stmt.run(recipe.title, recipe.description, JSON.stringify(recipe.ingredients || []), JSON.stringify(recipe.instructions || []), recipe.prepTime, recipe.cookTime, recipe.servings, recipe.category);
                return res.status(201).json({ success: true, id: result.lastInsertRowid });
              }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API /api/recipes error:', err);
    return res.status(500).json({
      error: 'Failed to load recipes',
      detail: err.message,
    });
  }
}



