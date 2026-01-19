# SaaS Cookbook App - Complete Upgrade Guide

> **Status**: ✅ Bug Fix Complete + Comprehensive SaaS Upgrade Plan

## Current Status

**Bug Fixed**: The 500 error on `/api/recipes` POST has been resolved by creating the missing route handler.

## What Was Wrong

The `pages/upload.js` was trying to POST parsed recipes to `/api/recipes`, but that route didn't exist. The new `app/api/recipes/route.ts` now handles:
- GET: Fetch all recipes
- POST: Save new recipes to database
- DELETE: Remove recipes by ID

---

## 🚀 SaaS Upgrade Implementation Plan

This guide walks you through scaling the cookbook app to a production-ready SaaS platform.

### Tech Stack
- **Frontend**: Next.js 15.5.9 + React 19
- **Database**: SQLite (local) → Postgres (production)
- **ORM**: Drizzle ORM
- **External APIs**: Zestful API, recipe-scrapers (Python)

---

## Phase 1: Schema Upgrades

Add these new tables to support SaaS features:

### Collections (Categories)
```typescript
// lib/db/schema.ts - ADD THESE TABLES

export const collections = sqliteTable('collections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const recipeCollections = sqliteTable(
  'recipe_collections',
  {
    recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
    collectionId: integer('collection_id').references(() => collections.id, { onDelete: 'cascade' }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.recipeId, table.collectionId] }),
  })
);
```

### Normalized Ingredients (for Scaling & Aggregation)
```typescript
export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  rawText: text('raw_text').notNull(),
  quantity: real('quantity'),
  unit: text('unit'),
  ingredientName: text('ingredient_name').notNull(),
  preparation: text('preparation'),
});
```

### Shopping Lists
```typescript
export const shoppingLists = sqliteTable('shopping_lists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const shoppingListItems = sqliteTable('shopping_list_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shoppingListId: integer('shopping_list_id').references(() => shoppingLists.id, { onDelete: 'cascade' }).notNull(),
  ingredientName: text('ingredient_name').notNull(),
  unit: text('unit'),
  quantity: real('quantity'),
  sourceRecipeIds: text('source_recipe_ids'), // JSON array
  checked: integer('checked', { mode: 'boolean' }).default(false),
});
```

### Migration Steps
```bash
# 1. Update lib/db/schema.ts with new tables above
# 2. Generate migration
npx drizzle-kit generate:sqlite

# 3. Remove old DB and restart (schema will auto-create)
rm sqlite.db
npm run dev
```

---

## Phase 2: Feature Implementation

### Feature 1: Collections (Recipe Categories)

**API Route** (`app/api/collections/route.ts`):
```typescript
import { db } from '@/lib/db';
import { collections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const allCollections = await db.select().from(collections);
  return Response.json(allCollections);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const [collection] = await db.insert(collections).values({ name, slug }).returning();
  return Response.json(collection, { status: 201 });
}
```

**Usage**: Allow users to organize recipes into "Breakfast", "Dinner", "Desserts", etc.

---

### Feature 2: Ingredient Scaling

**Utility** (`lib/utils/scaling.ts`):
```typescript
export function scaleIngredients(
  ingredients,
  baseServings: number,
  targetServings: number
) {
  const factor = targetServings / baseServings;
  return ingredients.map((ing) => ({
    ...ing,
    quantity: Math.round(ing.quantity * factor * 4) / 4,
  }));
}
```

**UI**: Add a dropdown on recipe page: "Serves [4 ↓]" → Updates ingredient quantities.

---

### Feature 3: Smart Shopping Lists

**API Route** (`app/api/shopping-lists/route.ts`):
```typescript
export async function POST(req: Request) {
  const { name, recipeIds } = await req.json();
  
  // Fetch ingredients from all recipes
  const ingredients = await db
    .select()
    .from(recipeIngredients)
    .where(inArray(recipeIngredients.recipeId, recipeIds));
  
  // Aggregate by ingredient name
  const aggregated = new Map();
  ingredients.forEach((ing) => {
    const key = ing.ingredientName.toLowerCase();
    aggregated.set(key, {
      name: ing.ingredientName,
      qty: (aggregated.get(key)?.qty || 0) + ing.quantity,
      sources: [...(aggregated.get(key)?.sources || []), ing.recipeId],
    });
  });
  
  // Save to DB
  const [list] = await db.insert(shoppingLists).values({ name }).returning();
  const items = Array.from(aggregated.values()).map((v) => ({
    shoppingListId: list.id,
    ingredientName: v.name,
    quantity: v.qty,
    sourceRecipeIds: JSON.stringify(v.sources),
  }));
  await db.insert(shoppingListItems).values(items);
  
  return Response.json({ listId: list.id });
}
```

**UX**: "Select recipes → Create shopping list → Shows aggregated ingredients."

---

### Feature 4: One-Click URL Parsing

**Python Microservice** (`backend/scraper.py`):
```python
from flask import Flask, request
from recipe_scrapers import scrape_me

app = Flask(__name__)

@app.route('/parse-url', methods=['POST'])
def parse_url():
    data = request.json
    url = data.get('url')
    
    try:
        scraper = scrape_me(url)
        recipe = {
            'title': scraper.title(),
            'ingredients': scraper.ingredients(),
            'instructions': scraper.instructions_list(),
            'servings': scraper.yields(),
            'prepTime': scraper.prep_time(),
            'cookTime': scraper.cook_time(),
        }
        return {'success': True, 'recipe': recipe}
    except Exception as e:
        return {'success': False, 'error': str(e)}, 500

if __name__ == '__main__':
    app.run(port=5001)
```

**Setup**:
```bash
pip install recipe-scrapers flask
python backend/scraper.py
```

**Environment** (`.env.local`):
```
RECIPE_SCRAPER_URL=http://localhost:5001
ZESTFUL_API_KEY=your_api_key_here
```

---

## Phase 3: Testing

### Manual Tests

1. **Collections**:
   - POST `/api/collections` with `{"name": "Breakfast"}`
   - GET `/api/collections` and verify response

2. **Shopping Lists**:
   - Create 2-3 recipes with ingredients
   - POST `/api/shopping-lists` with `{"name": "Dinner prep", "recipeIds": [1, 2]}`
   - GET `/api/shopping-lists?listId=1` and verify aggregation

3. **Scaling**:
   - Load a recipe
   - Change servings from 4 to 8
   - Verify quantities double

### Automated Tests
```bash
# Create tests/api.test.ts
npm install --save-dev jest @testing-library/react
npm test
```

---

## Next Steps

1. **Update schema** with new tables
2. **Create utility functions** for scaling and aggregation
3. **Implement API routes** one by one
4. **Build UI components** for each feature
5. **Deploy to production** (migrate to Postgres on Vercel/Railway)

---

## Deployment Checklist

- [ ] Update schema and run migrations
- [ ] Test all API routes locally
- [ ] Add Zestful API key to `.env`
- [ ] Set up Python scraper microservice on Railway/Render
- [ ] Update `.env.production` with live URLs
- [ ] Deploy frontend to Vercel
- [ ] Run E2E tests in production
- [ ] Monitor error logs

---

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [recipe-scrapers on PyPI](https://pypi.org/project/recipe-scrapers/)
- [Zestful API](https://zestfuldata.com)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
