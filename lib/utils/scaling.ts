import { RecipeIngredient } from '@/lib/db/schema';

const UNIT_CONVERSIONS: Record<string, { toBase: number; base: string }> = {
  tsp: { toBase: 5, base: 'ml' },
  tbsp: { toBase: 15, base: 'ml' },
  cup: { toBase: 240, base: 'ml' },
  oz: { toBase: 28.35, base: 'g' },
  lb: { toBase: 453.6, base: 'g' },
};

export function scaleIngredients(
  ingredients: RecipeIngredient[],
  baseServings: number,
  targetServings: number
): RecipeIngredient[] {
  const factor = targetServings / baseServings;

  return ingredients.map((ing) => {
    if (ing.quantity == null) return ing; // "to taste" items

    const scaledQty = ing.quantity * factor;
    // Round to nearest 0.25 for cleaner numbers
    const rounded = Math.round(scaledQty * 4) / 4;

    return { ...ing, quantity: rounded };
  });
}

export function normalizeUnit(rawUnit?: string): string | null {
  if (!rawUnit) return null;
  const lower = rawUnit.toLowerCase().trim();
  return lower || null;
}

export function aggregateIngredients(
  allIngredients: RecipeIngredient[]
): Map<string, { quantity: number; unit: string | null; name: string }> {
  const aggregated = new Map<string, { quantity: number; unit: string | null; name: string }>();

  for (const ing of allIngredients) {
    const key = `${ing.ingredientName.toLowerCase()}::${ing.unit || 'null'}`;
    const existing = aggregated.get(key) || {
      name: ing.ingredientName,
      unit: ing.unit,
      quantity: 0,
    };

    existing.quantity += ing.quantity || 0;
    aggregated.set(key, existing);
  }

  return aggregated;
}
