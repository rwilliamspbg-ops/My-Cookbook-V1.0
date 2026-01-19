import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';

// Existing table
export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  ingredients: text('ingredients').notNull(),
  instructions: text('instructions').notNull(),
  prepTime: text('prep_time'),
  cookTime: text('cook_time'),
  servings: integer('servings').default(4),
  category: text('category'),
  imageUrl: text('image_url'),
  source: text('source'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdateFn(() => new Date()),
  baseServings: integer('base_servings').default(4), // NEW: for scaling
});

// NEW: Collections table
export const collections = sqliteTable('collections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

// NEW: Recipe-Collections junction table (many-to-many)
export const recipeCollections = sqliteTable(
  'recipe_collections',
  {
    recipeId: integer('recipe_id')
      .references(() => recipes.id, { onDelete: 'cascade' })
      .notNull(),
    collectionId: integer('collection_id')
      .references(() => collections.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.recipeId, table.collectionId] }),
  })
);

// NEW: Normalized ingredients table
export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id')
    .references(() => recipes.id, { onDelete: 'cascade' })
    .notNull(),
  rawText: text('raw_text').notNull(), // original string from recipe
  quantity: real('quantity'), // nullable for "to taste"
  unit: text('unit'), // "g", "ml", "cup", "tbsp", etc.
  ingredientName: text('ingredient_name').notNull(), // normalized name
  preparation: text('preparation'), // "chopped", "minced", etc.
});

// NEW: Shopping lists table
export const shoppingLists = sqliteTable('shopping_lists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

// NEW: Shopping list items (aggregated ingredients)
export const shoppingListItems = sqliteTable('shopping_list_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shoppingListId: integer('shopping_list_id')
    .references(() => shoppingLists.id, { onDelete: 'cascade' })
    .notNull(),
  ingredientName: text('ingredient_name').notNull(),
  unit: text('unit'),
  quantity: real('quantity'),
  sourceRecipeIds: text('source_recipe_ids'), // JSON stringified array
  checked: integer('checked', { mode: 'boolean' }).default(false),
});

export type Recipe = typeof recipes.$inferSelect;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type ShoppingList = typeof shoppingLists.$inferSelect;
export type ShoppingListItem = typeof shoppingListItems.$inferSelect;

