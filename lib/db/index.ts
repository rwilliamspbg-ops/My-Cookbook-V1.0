import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);
export async function fetchRecipe(_id) {  // your existing DB call, e.g. drizzle or sqlite
}
