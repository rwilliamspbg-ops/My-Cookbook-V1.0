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

    // 1. Scrape recipe
    const parsed = await scrapeRecipe(url);

    // 2. Insert recipe
    const [recipe] = await db
      .insert(recipes)
      .values({
        title: parsed.title,
        description: parsed.description || '',
        ingredients: parsed.ingredients.join('\n'),
        instructions: parsed.
