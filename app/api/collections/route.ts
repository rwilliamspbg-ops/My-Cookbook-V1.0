import { db } from '../../../lib/db';
import { collections } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allCollections = await db.select().from(collections);
    return Response.json(allCollections);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return Response.json({ error: 'Name required' }, { status: 400 });

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const [collection] = await db
      .insert(collections)
      .values({ name, slug })
      .returning();

    return Response.json(collection, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
