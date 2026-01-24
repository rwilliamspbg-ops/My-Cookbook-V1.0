import { NextRequest, NextResponse } from 'next/server';
import { fetchRecipe } from '@/lib/db';
import { db } from '@/lib/db';
import { recipes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const recipe = await fetchRecipe(id);

  if (!recipe) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(recipe, { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  await db.delete(recipes).where(eq(recipes.id, numericId));
  return NextResponse.json({ success: true }, { status: 200 });
}
