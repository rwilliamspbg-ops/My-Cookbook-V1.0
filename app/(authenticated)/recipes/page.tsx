import Link from 'next/link';

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
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">Your Recipes</h1>
            <p className="card-description">
              Browse and manage your recipe collection
            </p>
          </div>
          <div className="page-header-actions">
            <Link href="/upload" className="btn btn-secondary">
              📤 Parse recipe
            </Link>
            <Link href="/recipe/new" className="btn btn-primary">
              ➕ Add recipe
            </Link>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', opacity: 0.7 }}>
              No recipes yet. Start by adding your first recipe!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/upload" className="btn btn-primary">
                📤 Parse recipe
              </Link>
              <Link href="/recipe/new" className="btn btn-secondary">
                ➕ Add manually
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-2" style={{ gap: '1rem' }}>
            {recipes.map((recipe: any) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="card"
                style={{
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>
                  {recipe.title || 'Untitled Recipe'}
                </h3>
                {recipe.description && (
                  <p
                    style={{
                      fontSize: '0.875rem',
                      opacity: 0.7,
                      marginBottom: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {recipe.description}
                  </p>
                )}
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                  {recipe.category && <span>{recipe.category} • </span>}
                  {recipe.servings && <span>{recipe.servings} servings</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
