import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  ingredients: text('ingredients'),
  instructions: text('instructions'), 
  servings: integer('servings'),         
  prep_time: text('prep_time'), 
  cook_time: text('cook_time'),
  
});

export const collections = sqliteTable('collections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id').references(() => recipes.id),
  ingredient: text('ingredient').notNull(),
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

