import { db } from '@/lib/db';
import { recipes as recipesTable } from '@/lib/schema';
import RecipeCard from '@/app/(authenticated)/recipes/RecipeCard'; // Adjust path if needed
import Link from 'next/link';

export default async function RecipesPage() {
  // Fetch recipes directly on the server
  const allRecipes = await db.select().from(recipesTable);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Recipes</h1>
        <Link href="/upload" className="btn btn-primary">
          ➕ Add New
        </Link>
      </div>

      {allRecipes.length === 0 ? (
        <p>No recipes found. Try uploading one!</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {allRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
