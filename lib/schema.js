import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  ingredients: text('ingredients').notNull(),
  instructions: text('instructions').notNull(),
  prepTimeMinutes: text('prep_time'),   // maps to DB column prep_time
  cookTimeMinutes: text('cook_time'),   // maps to DB column cook_time
  servings: text('servings'),
  category: text('category'),
  notes: text('notes'),
  imageUrl: text('imageUrl'),           // maps to DB column imageUrl
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdateFn(() => new Date()),
});
