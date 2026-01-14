import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  ingredients: text('ingredients'),
  instructions: text('instructions'),
  prepTime: text('prep_time'),
});
