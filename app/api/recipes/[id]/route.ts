import { NextResponse } from 'next/server';
import { fetchRecipe } from '@/lib/db';

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const recipe = await fetchRecipe(id);

  if (!recipe) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(recipe, { status: 200 });
}


