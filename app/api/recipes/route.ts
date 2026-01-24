import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes } from '@/lib/schema';
import { z } from 'zod';

const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  ingredients: z.string().optional().default(''),
  instructions: z.string().optional().default(''),
  prepTimeMinutes: z.number().int().nonnegative().optional(),
  cookTimeMinutes: z.number().int().nonnegative().optional(),
  servings: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const allRecipes = await db.select().from(recipes).limit(200);
    return NextResponse.json(allRecipes, { status: 200 });
  } catch (error) {
    console.error('GET /api/recipes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = createRecipeSchema.parse(json);

    const recipeValues = {
      userId: 1, // TODO: replace with real user id from auth/session
      title: body.title,
      description: body.description ?? '',
      ingredients: body.ingredients ?? '',
      instructions: body.instructions ?? '',
      imageUrl: body.imageUrl ?? null,
      prepTimeMinutes:
        body.prepTimeMinutes != null ? String(body.prepTimeMinutes) : null,
      cookTimeMinutes:
        body.cookTimeMinutes != null ? String(body.cookTimeMinutes) : null,
      servings:
        body.servings != null ? String(body.servings) : null,
      category: body.category ?? null,
      notes: body.notes ?? null,
    } satisfies typeof recipes.$inferInsert;

    const [inserted] = await db
      .insert(recipes)
      .values(recipeValues)
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (err) {
    console.error('POST /api/recipes error', err);
    return NextResponse.json(
      { error: 'Failed to save recipe' },
      { status: 500 },
    );
  }
}

