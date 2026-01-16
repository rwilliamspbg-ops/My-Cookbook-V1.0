// pages/api/recipes/[id].js
import db from '../../../lib/db';
export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const recipe = db.fetchRecipe(id);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  return res.status(200).json({ recipe });
}
