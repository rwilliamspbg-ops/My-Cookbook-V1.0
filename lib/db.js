// lib/db.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'sqlite.db');
const db = new Database(dbPath);

// Adjust to your real columns
function mapRowToRecipe(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ingredients: row.ingredientsJson ? JSON.parse(row.ingredientsJson) : [],
    instructions: row.instructionsJson ? JSON.parse(row.instructionsJson) : [],
    prepTime: row.prepTime,
    cookTime: row.cookTime,
    servings: row.servings,
    category: row.category,
  };
}
// lib/db.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'sqlite.db');
const db = new Database(dbPath);

function mapRowToRecipe(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    // if stored as JSON string, parse; if plain text, wrap in array
    ingredients: row.ingredients
      ? JSON.parse(row.ingredients)
      : [],
    instructions: row.instructions
      ? JSON.parse(row.instructions)
      : [],
    prepTime: row.prep_time,
    cookTime: row.cook_time,
    servings: row.servings,
    category: row.category,
  };
}

function fetchRecipe(id) {
  const stmt = db.prepare(
    'SELECT id, title, description, ingredients, instructions, prep_time, cook_time, servings, category FROM recipes WHERE id = ?'
  );
  const row = stmt.get(id);
  return mapRowToRecipe(row);
}

function fetchAllRecipes() {
  const stmt = db.prepare(
    'SELECT id, title, description, ingredients, instructions, prep_time, cook_time, servings, category FROM recipes ORDER BY id DESC'
  );
  const rows = stmt.all();
  return rows.map(mapRowToRecipe);
}

module.exports = {
  fetchRecipe,
  fetchAllRecipes,
};

