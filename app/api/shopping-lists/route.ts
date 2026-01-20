import { db } from '../../../lib/db';
import { shoppingLists, shoppingListItems } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

// Define the interface for shopping list creation
interface ShoppingListInput {
  name: string;
  collection_id?: number;
  items?: Array<{
    recipe_id?: number;
    ingredient: string;
    checked?: boolean;
  }>;
}

export async function GET() {
  try {
    const lists = await db.select().from(shoppingLists);
    return Response.json(lists);
  } catch {
    return Response.json({ error: 'Failed to fetch shopping lists' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data: ShoppingListInput = await req.json();

    if (!data.name) {
      return Response.json({ error: 'Shopping list name is required' }, { status: 400 });
    }

    // Create the shopping list
    const [newList] = await db
      .insert(shoppingLists)
      .values({
        name: data.name,
        collection_id: data.collection_id || null,
      })
      .returning();

    // If items are provided, insert them
    if (data.items && data.items.length > 0) {
      const itemsToInsert = data.items.map(item => ({
        list_id: newList.id,
        recipe_id: item.recipe_id || null,
        ingredient: item.ingredient,
        checked: item.checked || false,
      }));

      await db.insert(shoppingListItems).values(itemsToInsert);
    }

    return Response.json(newList, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to create shopping list' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data: ShoppingListInput & { id: number } = await req.json();

    if (!data.id) {
      return Response.json({ error: 'List ID is required' }, { status: 400 });
    }

    // Update the shopping list
    const [updatedList] = await db
      .update(shoppingLists)
      .set({
        name: data.name,
        collection_id: data.collection_id || null,
      })
      .where(eq(shoppingLists.id, data.id))
      .returning();

    // If items are provided, delete old items and insert new ones
    if (data.items !== undefined) {
      // Delete existing items
      await db.delete(shoppingListItems).where(eq(shoppingListItems.list_id, data.id));

      // Insert new items
      if (data.items.length > 0) {
        const itemsToInsert = data.items.map(item => ({
          list_id: data.id,
          recipe_id: item.recipe_id || null,
          ingredient: item.ingredient,
          checked: item.checked || false,
        }));

        await db.insert(shoppingListItems).values(itemsToInsert);
      }
    }

    return Response.json(updatedList);
  } catch {
    return Response.json({ error: 'Failed to update shopping list' }, { status: 500 });
  }
}
