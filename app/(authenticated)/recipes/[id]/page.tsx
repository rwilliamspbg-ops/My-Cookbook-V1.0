import { db } from '@/lib/db';
import { recipes } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import RecipeDetailPage from './RecipeDetailPage'; // Your client component
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  // 1. Fetch data on the server
  const recipeId = parseInt(params.id);
  
  const [recipe] = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, recipeId));

  // 2. Handle missing recipe
  if (!recipe) {
    notFound(); 
  }

  // 3. Pass data to your existing client component
  return <RecipeDetailPage recipe={recipe} />;
}

