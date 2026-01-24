import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes } from '@/lib/schema';

interface ParsedRecipe {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  servings?: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  imageUrl?: string | null;
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

    const recipeValues = {
      userId: 1, // TODO: replace with real user id from auth/session
      title: parsed.title,
      description: parsed.description || '',
      ingredients: parsed.ingredients.join('\n'),
      instructions: parsed.instructions.join('\n'),
      imageUrl: parsed.imageUrl ?? null,
      prepTimeMinutes:
        parsed.prepTimeMinutes != null ? String(parsed.prepTimeMinutes) : null,
      cookTimeMinutes:
        parsed.cookTimeMinutes != null ? String(parsed.cookTimeMinutes) : null,
      servings:
        parsed.servings != null ? String(parsed.servings) : null,
      // category and notes are optional and can be added later
    } satisfies typeof recipes.$inferInsert;

    const [recipe] = await db
      .insert(recipes)
      .values(recipeValues)
      .returning();

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


