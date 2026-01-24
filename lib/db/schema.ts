import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  ingredients: text('ingredients').notNull(),
  instructions: text('instructions').notNull(),
  prepTime: text('prep_time'),
  cookTime: text('cook_time'),
  servings: text('servings'),
  category: text('category'),
  notes: text('notes'),
  imageUrl: text('image_url'),
  
});

export const collections = sqliteTable('collections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id').references(() => recipes.id),
  ingredient: text('ingredient').notNull(),
  quantity: integer('quantity'),
  unit: text('unit'),
  imageUrl: text('image_url'),
});



export const shoppingLists = sqliteTable('shopping_lists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  collection_id: integer('collection_id'),
});

export const shoppingListItems = sqliteTable('shopping_list_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  list_id: integer('list_id').notNull(),
  recipe_id: integer('recipe_id'),
  ingredient: text('ingredient').notNull(),
  checked: integer('checked', { mode: 'boolean' }).default(false),
});


export type Recipe = typeof recipes.$inferSelect;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type ShoppingList = typeof shoppingLists.$inferSelect;
export type ShoppingListItem = typeof shoppingListItems.$inferSelect;

