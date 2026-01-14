import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/schema.js',
  out: './drizzle',
  dialect: 'sqlite', // High priority: check this line
  dbCredentials: {
    url: 'sqlite.db', // Path to your local sqlite.db file
  },
});
