import { db } from '../../../../lib/db';
import { recipeIngredients } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const recipeId = parseInt(id);

  const ingredients = await db
    .select()
    .from(recipeIngredients)
    .where(eq(recipeIngredients.recipeId, recipeId));

  return Response.json(ingredients);
}
