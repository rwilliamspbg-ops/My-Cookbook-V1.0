import { db } from '../../../lib/db';
import { recipes } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  const { id } = req.query;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (req.method === 'GET') {
    try {
      const rows = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, numericId));
      const recipe = rows[0];

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      return res.status(200).json({ recipe });
    } catch (err) {
      console.error('Error loading recipe', err);
      return res.status(500).json({ error: 'Failed to load recipe' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const {
        title,
        description,
        ingredients,
        instructions,
        prepTimeMinutes,
        cookTimeMinutes,
        servings,
        category,
      } = req.body;

      // Adjust field names/types to match your schema
      const updated = await db
        .update(recipes)
        .set({
          title,
          description,
          ingredients,
          instructions,
          prepTimeMinutes,
          cookTimeMinutes,
          servings,
          category,
        })
        .where(eq(recipes.id, numericId))
        .returning();

      const recipe = updated[0];

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      return res.status(200).json({ recipe });
    } catch (err) {
      console.error('Error updating recipe', err);
      return res.status(500).json({ error: 'Failed to update recipe' });
    }
  }

  // Any other method
  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
