// app/api/recipes/route.ts
import { NextResponse } from 'next/server';
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


    // Insert recipe
    const [recipe] = await db
      .insert(recipes)
      .values({
        title,
        ingredients: Array.isArray(ingredients) ? ingredients.join('\n') : ingredients,
        instructions: Array.isArray(instructions) ? instructions.join('\n') : instructions,
        prepTime: prepTime?.toString() || null,
        cookTime: cookTime?.toString() || null,
        servings: servings || 4,
        category: category || null,
        imageUrl: imageUrl || null,
        source: source || null,
        baseServings: servings || 4,
      })
      .returning();

    return Response.json(
      { id: recipe.id, message: 'Recipe saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/recipes error:', error);
    return Response.json(
      { error: 'Failed to save recipe', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Recipe ID required' }, { status: 400 });
    }

    const recipeId = parseInt(id);
    await db.delete(recipes).where(eq(recipes.id, recipeId));

    return Response.json({ message: 'Recipe deleted' });
  } catch (error) {
    console.error('DELETE /api/recipes error:', error);
    return Response.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
