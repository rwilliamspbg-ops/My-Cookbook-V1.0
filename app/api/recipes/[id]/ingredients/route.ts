import { db } from '@/lib/db';
import { recipeIngredients, recipes } from '@/lib/db/schema';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ingredients = await db
      .select()
      .from(recipeIngredients)
      .where(eq(recipeIngredients.recipeId, recipeId));

    return Response.json(ingredients);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch ingredients' }, { status: 500 });
  }
}
