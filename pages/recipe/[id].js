// pages/api/recipes/[id].js
import { NextApiRequest, NextApiResponse } from 'next';

// require is fine here, runs only on server
// eslint-disable-next-line global-require
const db = require('../../../lib/db');

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const recipe = db.fetchRecipe(id);

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  return res.status(200).json({ recipe });
}

