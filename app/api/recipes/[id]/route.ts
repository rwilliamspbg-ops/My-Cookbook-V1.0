import { NextResponse } from 'next/server';
import { fetchRecipe } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const recipe = await fetchRecipe(params.id);

  if (!recipe) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(recipe, { status: 200 });
}
export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  ...
}


