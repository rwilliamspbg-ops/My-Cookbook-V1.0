// pages/api/recipes.js

import db, { fetchAllRecipes } from '../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const all = fetchAllRecipes();
      return res.status(200).json({ recipes: all });
    }

    if (req.method === 'POST') {
      const recipe = req.body;

      const stmt = db.prepare(`
        INSERT INTO recipes (
          title,
          description,
          ingredients,
          instructions,
          prep_time,
          cook_time,
          servings,
          category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        recipe.title,
        recipe.description,
        JSON.stringify(recipe.ingredients || []),
        JSON.stringify(recipe.instructions || []),
        recipe.prepTime,
        recipe.cookTime,
        recipe.servings,
        recipe.category
      );

      return res.status(201).json({ success: true, id: result.lastInsertRowid });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};

      if (!id) {
        return res.status(400).json({ error: 'Missing id' });
      }

      // better-sqlite3 delete by id
      const stmt = db.prepare('DELETE FROM recipes WHERE id = ?');
      const result = stmt.run(id);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Failed in /api/recipes:', err);
    return res.status(500).json({
      error: 'Failed to process request',
      detail: err.message,
    });
  }
}
