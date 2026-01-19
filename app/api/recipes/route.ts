<<<<<<< HEAD
=======
// app/api/recipes/route.ts
import { NextResponse } from 'next/server';
>>>>>>> refs/remotes/origin/main
import { db } from '../../../lib/db/index';
import { recipes, recipeIngredients } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allRecipes = await db.select().from(recipes).limit(100);
    return Response.json(allRecipes);
  } catch (error) {
    console.error('GET /api/recipes error:', error);
    return Response.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Adjust field names to match your schema
    const [inserted] = await db
      .insert(recipes)
      .values({
        title: body.title,
        source: body.source || null,
        instructions: body.instructions,
        total_time: body.total_time || null,
        servings: body.servings || null,
      })
      .returning();

    if (body.ingredients?.length) {
      await db.insert(recipeIngredients).values(
        body.ingredients.map((ing: any) => ({
          recipe_id: inserted.id,
          name: ing.name,
          quantity: ing.quantity || null,
          unit: ing.unit || null,
        })),
      );
    }

    return NextResponse.json({ success: true, recipe: inserted }, { status: 201 });
  } catch (err) {
    console.error('POST /api/recipes error', err);
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 });
  }
}



