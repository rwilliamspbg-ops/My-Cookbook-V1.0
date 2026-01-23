import { NextResponse, type NextRequest } from 'next/server';
import { db } from '../../../lib/db';
import { recipes } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  ingredients: z.string().optional().default(''),
  instructions: z.string().optional().default(''),
  slug: z.string().optional(),
  prep_time: z.number().int().nonnegative().optional(),
  cook_time: z.number().int().nonnegative().optional(),
  servings: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
});

type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

export async function GET() {
  try {
    const allRecipes = await db.select().from(recipes).limit(100);
    return NextResponse.json(allRecipes, { status: 200 });
  } catch (error) {
    console.error('GET /api/recipes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const json: unknown = await req.json();
    const body: CreateRecipeInput = createRecipeSchema.parse(json);

    const slug =
      body.slug ??
      body.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    const [inserted] = await db
      .insert(recipes)
      .values({
        title: body.title,
        description: body.description,
        ingredients: body.ingredients,
        instructions: body.instructions,
        slug,
        prepTimeMinutes: body.prep_time ?? null,
        cookTimeMinutes: body.cook_time ?? null,
        servings: body.servings ?? null,
        imageUrl: body.imageUrl ?? null,
      })
      .returning();

    return NextResponse.json(
      { success: true, recipe: inserted },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: err.issues },
        { status: 400 }
      );
    }

    console.error('POST /api/recipes error', err);
    return NextResponse.json(
      { error: 'Failed to save recipe' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const json: unknown = await req.json();
    const body = z.object({ id: z.number().int().positive() }).parse(json);

    await db.delete(recipes).where(eq(recipes.id, body.id));

    return NextResponse.json(
      { success: true, message: 'Recipe deleted' },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: err.issues },
        { status: 400 }
      );
    }

    console.error('DELETE /api/recipes error', err);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
