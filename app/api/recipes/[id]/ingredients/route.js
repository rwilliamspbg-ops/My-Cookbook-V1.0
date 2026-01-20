import { db } from '../../../../../lib/db/index.ts';
import { recipeIngredients } from '../../../../../lib/db/schema.ts';
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
