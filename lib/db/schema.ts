export const collections = sqliteTable('collections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  userId: integer('user_id'), // add auth later
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const recipeCollections = sqliteTable('recipe_collections', {
  recipeId: integer('recipe_id').references(() => recipes.id).notNull(),
  collectionId: integer('collection_id').references(() => collections.id).notNull(),
});

