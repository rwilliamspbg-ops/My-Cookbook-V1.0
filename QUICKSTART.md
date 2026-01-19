# 🚀 SaaS Cookbook - Quick Start Guide

## What Was Just Fixed

✅ **500 Error Bug** - The missing `/api/recipes` route has been created.

You can now successfully save parsed recipes from the upload page.

---

## Next: Implement SaaS Features (30 mins)

### Step 1: Update Your Schema (5 min)

1. Open `lib/db/schema.ts`
2. Add these new tables (copy from `SAAS_UPGRADE_GUIDE.md` Phase 1)
3. Run:
   ```bash
   npx drizzle-kit generate:sqlite
   rm sqlite.db
   npm run dev
   ```

### Step 2: Create Utility Functions (5 min)

Create `lib/utils/scaling.ts`:
```typescript
export function scaleIngredients(ingredients, baseServings, targetServings) {
  const factor = targetServings / baseServings;
  return ingredients.map((ing) => ({
    ...ing,
    quantity: Math.round(ing.quantity * factor * 4) / 4,
  }));
}
```

### Step 3: Add Collections API (10 min)

Create `app/api/collections/route.ts` (see `SAAS_UPGRADE_GUIDE.md` Phase 2 Feature 1)

### Step 4: Add Shopping Lists API (10 min)

Create `app/api/shopping-lists/route.ts` (see `SAAS_UPGRADE_GUIDE.md` Phase 2 Feature 3)

---

## Testing Your Changes

### Test Collections
```bash
curl -X POST http://localhost:3000/api/collections \
  -H "Content-Type: application/json" \
  -d '{"name": "Breakfast"}'
```

### Test Shopping Lists
```bash
curl -X POST http://localhost:3000/api/shopping-lists \
  -H "Content-Type: application/json" \
  -d '{"name": "Weekly Prep", "recipeIds": [1, 2, 3]}'
```

---

## File Structure After Upgrade

```
app/api/
├── recipes/ ✅ DONE
│   └── route.ts
├── collections/ (TODO)
│   └── route.ts
├── shopping-lists/ (TODO)
│   └── route.ts
└── recipes/
    └── [id]/
        └── ingredients/
            └── route.ts

lib/
├── db/
│   ├── schema.ts (UPDATE with new tables)
│   └── index.ts
└── utils/
    ├── scaling.ts (NEW)
    └── zestful.ts (NEW)
```

---

## Key Files & Documentation

- **`SAAS_UPGRADE_GUIDE.md`** - Complete implementation guide with all code
- **`app/api/recipes/route.ts`** - The fixed recipe API (already committed)
- **`.env.local`** - Add your Zestful API key here

---

## Common Issues & Fixes

**Q: Still getting 500 error after recipe save?**
A: Make sure you've pulled the latest code with the `/api/recipes/route.ts` file.

**Q: Collections route not working?**
A: Create `app/api/collections/route.ts` first (see guide)

**Q: Shopping list aggregation is slow?**
A: Add indexes to `recipeIngredients` table in schema for `recipeId`

---

## Production Ready?

When ready to deploy:

1. Migrate from SQLite to Postgres (Neon/Supabase)
2. Deploy Python scraper microservice to Railway/Render
3. Set environment variables on Vercel
4. Run E2E tests
5. Monitor error logs

See `SAAS_UPGRADE_GUIDE.md` Deployment Checklist for full steps.

---

## Support & Resources

- Drizzle ORM: https://orm.drizzle.team
- recipe-scrapers: https://pypi.org/project/recipe-scrapers/
- Zestful API: https://zestfuldata.com
- Next.js Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

**Questions?** Check the detailed `SAAS_UPGRADE_GUIDE.md`!
