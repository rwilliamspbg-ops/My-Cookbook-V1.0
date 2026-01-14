import { db } from '../../lib/db';
import { recipes } from '../../lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    switch (method) {
      case 'GET':
        if (id) {
          // Get single recipe by ID
          const recipe = await db.select().from(recipes).where(eq(recipes.id, parseInt(id)));
          if (!recipe || recipe.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
          }
          return res.status(200).json(recipe[0]);
        } else {
          // Get all recipes
          const allRecipes = await db.select().from(recipes);
          return res.status(200).json(allRecipes);
        }

      case 'POST':
        // Create new recipe
        const newRecipe = req.body;
        const [created] = await db.insert(recipes).values({
          title: newRecipe.title,
          description: newRecipe.description,
          ingredients: newRecipe.ingredients,
          instructions: newRecipe.instructions,
          prepTime: newRecipe.prepTime,
          cookTime: newRecipe.cookTime,
          servings: newRecipe.servings,
          category: newRecipe.category,
        }).returning();
        return res.status(201).json(created);

      case 'PUT':
        // Update existing recipe
        if (!id) {
          return res.status(400).json({ error: 'Recipe ID is required' });
        }
        const updateData = req.body;
        const [updated] = await db.update(recipes)
          .set({
            title: updateData.title,
            description: updateData.description,
            ingredients: updateData.ingredients,
            instructions: updateData.instructions,
            prepTime: updateData.prepTime,
            cookTime: updateData.cookTime,
            servings: updateData.servings,
            category: updateData.category,
            updatedAt: new Date(),
          })
          .where(eq(recipes.id, parseInt(id)))
          .returning();
        
        if (!updated) {
          return res.status(404).json({ error: 'Recipe not found' });
        }
        return res.status(200).json(updated);

      case 'DELETE':
        // Delete recipe
        if (!id) {
          return res.status(400).json({ error: 'Recipe ID is required' });
        }
        await db.delete(recipes).where(eq(recipes.id, parseInt(id)));
        return res.status(200).json({ message: 'Recipe deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
