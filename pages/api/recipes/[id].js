// pages/api/recipes/[id].js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  try {
    if (method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ error: 'Missing id' });
      }

      const stmt = db.prepare('DELETE FROM recipes WHERE id = ?');
      const result = stmt.run(id);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Failed in /api/recipes/[id]:', err);
    return res.status(500).json({
      error: 'Failed to process request',
      detail: err.message,
    });
  }
}
