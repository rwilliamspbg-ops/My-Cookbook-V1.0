// pages/api/recipes.js

// Server-only SQLite helper (better-sqlite3)
const db = require('../../lib/db');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const all = db.fetchAllRecipes(); // sync better-sqlite3
      return res.status(200).json(all);
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



