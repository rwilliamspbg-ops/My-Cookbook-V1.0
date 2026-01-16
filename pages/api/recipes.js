// pages/api/recipes.js

// Server-only SQLite helper (better-sqlite3)
const db = require('../../lib/db');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Synchronous better-sqlite3 call; no await needed
      const all = db.fetchAllRecipes();
      return res.status(200).json(all);
    }

    // Extend here with POST/PUT/DELETE if needed, still via db.*
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API /api/recipes error:', err);
    return res.status(500).json({
      error: 'Failed to load recipes',
      detail: err.message,
    });
  }
}

// Export as CommonJS for this file
module.exports = handler;

