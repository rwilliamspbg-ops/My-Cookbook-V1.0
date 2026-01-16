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

function fetchRecipe(id) {
  const stmt = db.prepare(
    'SELECT id, title, description, ingredientsJson, instructionsJson, prepTime, cookTime, servings, category FROM recipes WHERE id = ?'
  );
  const row = stmt.get(id);
  return mapRowToRecipe(row);
}

function fetchAllRecipes() {
  const stmt = db.prepare(
    'SELECT id, title, description, ingredientsJson, instructionsJson, prepTime, cookTime, servings, category FROM recipes ORDER BY id DESC'
  );
  const rows = stmt.all();
  return rows.map(mapRowToRecipe);
}

module.exports = {
  fetchRecipe,
  fetchAllRecipes,
};

