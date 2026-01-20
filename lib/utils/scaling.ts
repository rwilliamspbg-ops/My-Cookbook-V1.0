import { RecipeIngredient } from '@/lib/db/schema';
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
): Map<string, { qty: number; unit: string | null; name: string }> {
  
  const aggregated = new Map<string, { qty: number; unit: string | null; name: string }>();

  for (const ing of allIngredients) {
    const name = ing.ingredient; 
    const unit = ing.unit || 'null';
    const key = `${name.toLowerCase()}::${unit}`;
    
    const existing = aggregated.get(key) || {
      name: name,
      unit: unit,
      qty: 0, 
    };

    existing.qty += ing.quantity || 0;
    aggregated.set(key, existing);
  }

  // >>> ADD THIS LINE HERE <<<
  return aggregated; 
}
  
  
