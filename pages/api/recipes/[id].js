// pages/api/recipes/[id].js

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // TODO: replace this with your real data source
      const recipe = {
        id,
        name: 'Sample Recipe',
        description: 'Placeholder recipe from the /api/recipes/[id] route.',
        servings: 4,
        ingredients: ['1 cup flour', '2 eggs', '1 tsp salt'],
        instructions: ['Mix ingredients', 'Bake for 20 minutes at 350°F'],
      };

      res.status(200).json({ recipe });
    } catch (err) {
      res.status(500).json({ error: 'Failed to load recipe' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

