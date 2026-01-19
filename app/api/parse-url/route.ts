import { db } from '@/lib/db';
import { recipes, recipeIngredients } from '@/lib/db/schema';
import { parseIngredientsWithZestful } from '@/lib/utils/zestful';

interface ParsedRecipe {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  servings?: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  imageUrl?: string;
}

async function scrapeRecipe(url: string): Promise<ParsedRecipe> {
  // Call Python microservice that uses recipe-scrapers
  const scraperUrl = process.env.RECIPE_SCRAPER_URL || 'http://localhost:5001';

  const response = await fetch(`${scraperUrl}/parse-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Scraper failed: ${response.status}`);
  }

  return response.json();
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return Response.json({ error: 'URL required' }, { status: 400 });
    }

    const parsed = await scrapeRecipe(url);

    const [recipe] = await db
      .insert(recipes)
      .values({
        title: parsed.title,
        description: parsed.description || '',
        ingredients: parsed.ingredients.join('\n'),
        instructions: parsed.instructions.join('\n'),
        servings: parsed.servings ?? null,
        prep_time: parsed.prepTimeMinutes ?? null,
        cook_time: parsed.cookTimeMinutes ?? null,
        image_url: parsed.imageUrl ?? null,
      })
      .returning();

    if (parsed.ingredients?.length) {
      const ingredientRows = parsed.ingredients.map((line: string) => ({
        recipe_id: recipe.id,
        ingredient: line,
      }));
      await db.insert(recipeIngredients).values(ingredientRows);
    }

    return Response.json({ recipe }, { status: 201 });
  } catch (err) {
    console.error('parse-url error', err);
    return Response.json({ error: 'Failed to parse recipe URL' }, { status: 500 });
  }
}
