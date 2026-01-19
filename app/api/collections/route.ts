import { db } from '../../../lib/db';
import { collections } from '../../../lib/db/schema';

export async function GET() {
  try {
    const allCollections = await db.select().from(collections);
    return Response.json(allCollections);
  } catch (_error) { // Prefixed with _ to satisfy linting
    return Response.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return Response.json({ error: 'Name required' }, { status: 400 });

    // Removed 'const slug' as it was assigned but never used

    const [collection] = await db
      .insert(collections)
      .values({ name })
      .returning();

    return Response.json(collection, { status: 201 });
  } catch (_error) { // Prefixed with _ to satisfy linting
    return Response.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
