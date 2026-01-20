import { db } from '../../../../lib/db.js';
import { recipeIngredients } from '../../../../lib/schema.js';
import { eq } from 'drizzle-orm';

export async function GET(request, context) {
  const { id } = await context.params;
  const recipeId = parseInt(id);

  const ingredients = await db
    .select()
    .from(recipeIngredients)
    .where(eq(recipeIngredients.recipeId, recipeId));

  return Response.json(ingredients);
}
