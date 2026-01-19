import { db } from '@/lib/db';
import { recipeIngredients, recipes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = parseInt(params.id);
    const ingredients = await db
      .select()
      .from(recipeIngredients)
      .where(eq(recipeIngredients.recipeId, recipeId));

    return Response.json(ingredients);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch ingredients' }, { status: 500 });
  }
}
