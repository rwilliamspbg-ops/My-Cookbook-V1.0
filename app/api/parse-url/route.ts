import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes, recipeIngredients } from '@/lib/schema';

interface ParsedRecipe {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  servings?: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  imageUrl?: string | null; // ✅ include this
}

async function scrapeRecipe(url: string): Promise<ParsedRecipe> {
  const scraperUrl = process.env.RECIPE_SCRAPER_URL || 'http://localhost:5001';

  const response = await fetch(`${scraperUrl}/parse-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Scraper failed: ${response.status}`);
  }

  // If your scraper sometimes returns `image_url`, normalize it here:
  const data = await response.json();
  const imageUrl = data.imageUrl ?? data.image_url ?? null;

  return {
    ...data,
    imageUrl,
  };
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL required' },
        { status: 400 },
      );
    }

    const parsed = await scrapeRecipe(url);

    const slug = parsed.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const [recipe] = await db
      .insert(recipes)
      .values({
        title: parsed.title,
        slug,
        description: parsed.description || '',
        ingredients: parsed.ingredients.join('\n'),
        instructions: parsed.instructions.join('\n'),
        imageUrl: parsed.imageUrl ?? null,         // ✅ matches DB column imageUrl
        prepTimeMinutes: parsed.prepTimeMinutes ?? null,
        cookTimeMinutes: parsed.cookTimeMinutes ?? null,
        servings: parsed.servings ?? null,
      })
      .returning();

    if (parsed.ingredients && parsed.ingredients.length > 0) {
      const ingredientRows = parsed.ingredients.map((line) => ({
        recipeId: recipe.id,
        ingredient: line,
      }));

      await db.insert(recipeIngredients).values(ingredientRows);
    }

    return NextResponse.json(
      { recipe },
      { status: 201 },
    );
  } catch (err) {
    console.error('parse-url error', err);
    return NextResponse.json(
      { error: 'Failed to parse recipe URL' },
      { status: 500 },
    );
  }
}


