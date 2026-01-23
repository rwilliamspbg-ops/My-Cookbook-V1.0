import { NextResponse } from 'next/server';
import { fetchRecipe } from '@/lib/db';
import { db } from '@/lib/db';
import { recipes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

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

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  await db.delete(recipes).where(eq(recipes.id, id));
  return NextResponse.json({ success: true }, { status: 200 });
}
