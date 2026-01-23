import { NextResponse } from 'next/server';
import { fetchRecipe } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const recipe = await fetchRecipe(params.id);
  ...
}



