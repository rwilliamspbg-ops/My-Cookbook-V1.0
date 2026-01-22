import Link from 'next/link';
import RecipeCard from './RecipeCard';

interface Recipe {
  id: string | number;
  title: string;
  description?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  category?: string;
  ingredients?: string[] | string;
}
async function getRecipes() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/recipes`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    return [];
  }
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="page-container">
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h1 className="card-title" style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>
              Your Recipes
            </h1>
            <p className="card-description" style={{ fontSize: '1rem' }}>
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} in your collection
            </p>
          </div>
          <div className="page-header-actions">
            <Link href="/upload" className="btn btn-secondary">
              📤 Parse
            </Link>
            <Link href="/recipe/new" className="btn btn-primary">
              ➕ Add
            </Link>
          </div>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div 
          className="card" 
          style={{ 
            textAlign: 'center',
            padding: '3rem 1.5rem',
            background: 'radial-gradient(circle at center, rgba(139,92,246,0.1), transparent 70%)'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍳</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>No recipes yet</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.7, maxWidth: '400px', margin: '0 auto 2rem' }}>
            Start building your cookbook by adding your first recipe
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/upload" className="btn btn-primary">
              📤 Parse recipe
            </Link>
            <Link href="/recipe/new" className="btn btn-secondary">
              ➕ Add manually
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {recipes.map((recipe: Recipe) => (
  <RecipeCard key={recipe.id} recipe={recipe} />
))}
        </div>
      )}
    </div>
  );
}
