// app/api/recipes/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db/index';
import { recipes, recipeIngredients } from '@/lib/db/schema';
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

    const [inserted] = await db
      .insert(recipes)
      .values({
  title: body.title,
  description: body.description || '',
  ingredients: body.ingredients || '',
  slug: body.slug || body.title.toLowerCase().replace(/ /g, '-'), 
  prepTimeMinutes: body.prep_time, 
  cookTimeMinutes: body.cook_time, 
  imageUrl: body.imageUrl,         
})
      .returning();

    return NextResponse.json({ success: true, recipe: inserted }, { status: 201 });
  } catch (err) {
    console.error('POST /api/recipes error', err);
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 });
  }
}




