// pages/api/recipes.js
import { db } from '@/lib/db';
import { recipes } from '@/lib/db/schema';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;        // or from query: req.query.id
    if (!id) return res.status(400).json({ error: 'Missing id' });

    try {
      await db.delete(recipes).where(eq(recipes.id, id));
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete recipe' });
    }
  }

  // handle GET/POST/PUT...
}
