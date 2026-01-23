import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    // Now that { schema } is passed in lib/db, this will work!
    const recipe = await db.query.recipe.findFirst({
      where: eq(recipes.id, parseInt(id)),
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
