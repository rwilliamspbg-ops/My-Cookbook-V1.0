import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);

  if (!recipe) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(recipe, { status: 200 });
}

