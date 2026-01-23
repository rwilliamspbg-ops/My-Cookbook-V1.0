import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');

// This initializes drizzle with your schema so db.query works
export const db = drizzle(sqlite, { schema });

/**
 * Helper to fetch a single recipe by ID
 * Usage: const recipe = await fetchRecipe(5);
 */
export async function fetchRecipe(id) {
  try {
    const recipeId = parseInt(id);
    if (isNaN(recipeId)) return null;

    const result = await db.query.recipes.findFirst({
      where: eq(schema.recipes.id, recipeId),
    });

    return result || null;
  } catch (error) {
    console.error('Database fetch error:', error);
    throw error;
  }
}
