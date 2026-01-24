import { db } from '@/lib/db';
import { recipes } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import RecipeDetailPage from './RecipeDetailPage';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const recipeId = parseInt(resolvedParams.id);
  
  const [recipe] = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, recipeId));

  if (!recipe) {
    notFound(); 
  }

  // Passing the database record to your new Client Component
  return <RecipeDetailPage recipe={recipe} />;
}
