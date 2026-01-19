import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);
export async function fetchRecipe(_id) {  // your existing DB call, e.g. drizzle or sqlite
}
