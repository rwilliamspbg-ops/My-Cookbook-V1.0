// lib/db.js
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sqlite.db');
const sqlite = new Database(dbPath);

// Export Drizzle ORM instance for use with schema
export const db = drizzle(sqlite);

// Adjust these names to match .schema recipes
function mapRowToRecipe(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ingredients: row.ingredients
      ? JSON.parse(row.ingredients)
      : [],
    instructions: row.instructions
      ? JSON.parse(row.instructions)
      : [],
    prepTime: row.prep_time,
    cookTime: row.cook_time,
    servings: row.servings,
    
  };
}

function fetchRecipe(id) {
  const stmt = sqlite.prepare(
    'SELECT id, title, description, ingredients, instructions, prep_time, cook_time, servings, category FROM recipes WHERE id = ?'
  );
  const row = stmt.get(id);
  return mapRowToRecipe(row);
}

function fetchAllRecipes() {
  const stmt = sqlite.prepare(
    'SELECT id, title, description, ingredients, instructions, prep_time, cook_time, servings, category FROM recipes ORDER BY id DESC'
  );
  const rows = stmt.all();
  return rows.map(mapRowToRecipe);
}

export default sqlite;
export { fetchRecipe, fetchAllRecipes };
