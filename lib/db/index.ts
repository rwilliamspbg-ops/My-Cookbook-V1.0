import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

// Helper function for server components
export async function getRecipeById(id) {
  try {
    return await db.query.recipes.findFirst({
      where: eq(schema.recipes.id, parseInt(id)),
    });
  } catch (error) {
    console.error("DB Fetch Error:", error);
    return null;
  }
}
