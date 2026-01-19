import { db } from '../../../lib/db';
import {
  shoppingLists,
  shoppingListItems,
  recipeIngredients,
  recipes,
} from '../../../lib/db/schema';
import { inArray, eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { name, recipeIds } = await req.json();

    if (!name || !recipeIds?.length) {
      return Response.json(
        { error: 'Name and recipeIds required' },
        { status: 400 }
      );
    }

    // Create shopping list
    const [list] = await db
      .insert(shoppingLists)
      .values({ name })
      .returning();

    // Fetch all ingredients from recipes
    const ingredients = await db
      .select()
      .from(recipeIngredients)
      .where(inArray(recipeIngredients.recipeId, recipeIds));

    // Aggregate by ingredient name + unit
    const aggregated = new Map<
      string,
      {
        name: string;
        unit: string | null;
        qty: number;
        sourceIds: Set<number>;
      }
    >();

    for (const ing of ingredients) {
  const name = ing.ingredient; 
  const unit = (ing as any).unit || ''; 
  
  const key = `${name.toLowerCase()}::${unit}`;
  
  const existing = aggregated.get(key) || {
    name: name,
    unit: unit,
    amount: 0
  };

      existing.qty += ing.quantity || 0;
      existing.sourceIds.add(ing.recipeId);
      aggregated.set(key, existing);
    }

    // Insert aggregated items
    const items = Array.from(aggregated.values()).map((v) => ({
      shoppingListId: list.id,
      ingredientName: v.name,
      unit: v.unit,
      quantity: v.qty,
      sourceRecipeIds: JSON.stringify([...v.sourceIds]),
    }));

    if (items.length) {
      await db.insert(shoppingListItems).values(items);
    }

    return Response.json({ listId: list.id, itemCount: items.length }, { status: 201 });
  } catch (error) {
    console.error('Shopping list error:', error);
    return Response.json({ error: 'Failed to create shopping list' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const listId = searchParams.get('listId');

    if (!listId) {
      return Response.json({ error: 'listId required' }, { status: 400 });
    }

    const items = await db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.shoppingListId, parseInt(listId)));

    return Response.json(items);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}
