import { db } from '../../../lib/db';
import { shoppingLists } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

// Define the interface to replace 'any' and satisfy the linter
interface ShoppingListInput {
  recipeId: string;
  items: string[];
}

export async function GET() {
  try {
    const lists = await db.select().from(shoppingLists);
    return Response.json(lists);
  } catch {
    // Empty catch block to avoid unused variable errors
    return Response.json({ error: 'Failed to fetch shopping lists' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data: ShoppingListInput = await req.json();

    if (!data.recipeId) {
      return Response.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const [newList] = await db
      .insert(shoppingLists)
      .values({
        recipeId: data.recipeId,
        items: data.items,
      })
      .returning();

    return Response.json(newList, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to create shopping list' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data: ShoppingListInput & { id: string } = await req.json();

    if (!data.id) {
      return Response.json({ error: 'List ID is required' }, { status: 400 });
    }

    const [updatedList] = await db
      .update(shoppingLists)
      .set({
        items: data.items,
      })
      .where(eq(shoppingLists.id, data.id))
      .returning();

    return Response.json(updatedList);
  } catch {

    return Response.json({ error: 'Failed to update shopping list' }, { status: 500 });
  }
}
