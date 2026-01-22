import { cookies } from 'next/headers';
import { parseUserFromRequest } from '@/lib/auth';
import Link from 'next/link';

// Server Component - runs on the server
async function getRecipes() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/recipes`, {
      cache: 'no-store', // Always get fresh data
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    return [];
  }
}

function getFeaturedRecipe(recipes: any[]) {
  if (recipes.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * recipes.length);
  return recipes[randomIndex];
}

export default async function Home() {
  // Get user from cookies
  const cookieStore = await cookies();
  const mockReq = {
    headers: { cookie: cookieStore.toString() },
  };
  const user = parseUserFromRequest(mockReq as any);

  // Fetch recipes server-side
  const recipes = await getRecipes();
  const featuredRecipe = getFeaturedRecipe(recipes);

  const firstName =
    user?.name?.split?.(' ')?.[0] || user?.email?.split?.('@')?.[0] || 'Friend';

  return (
    <main className="page-container">
      {/* Welcome hero */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <h1 className="card-title">Welcome back, {firstName}!</h1>
            <p className="card-description">
              Your personal AI‑powered cookbook is ready. Parse new recipes,
              curate your favorites, and let dinner ideas find you.
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
      </section>

      {/* Featured random recipe */}
      {featuredRecipe ? (
        <section
          className="card"
          style={{
            background:
              'radial-gradient(circle at 0 0, rgba(139,92,246,0.16), transparent 55%), radial-gradient(circle at 100% 100%, rgba(96,165,250,0.14), transparent 55%)',
          }}
        >
          <div className="card-header">
            <div>
              <h2 className="card-title">Today&apos;s spotlight recipe</h2>
              <p className="card-description">
                Hand‑picked from your collection to inspire your next meal.
              </p>
            </div>
            <Link
              href={`/recipe/${featuredRecipe.id}`}
              className="btn btn-primary"
            >
              View full recipe
            </Link>
          </div>

          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>
              {featuredRecipe.title || 'Untitled recipe'}
            </h3>
            {featuredRecipe.description && (
              <p style={{ marginBottom: '0.75rem' }}>
                {featuredRecipe.description}
              </p>
            )}

            <div className="grid grid-2">
              <div>
                <h4>Quick info</h4>
                <p>
                  Prep: {featuredRecipe.prepTime || 'N/A'} · Cook:{' '}
                  {featuredRecipe.cookTime || 'N/A'} · Serves:{' '}
                  {featuredRecipe.servings || 'N/A'}
                </p>
                {featuredRecipe.category && (
                  <p>Category: {featuredRecipe.category}</p>
                )}
              </div>
              <div>
                <h4>First ingredients</h4>
                <p>
                  {Array.isArray(featuredRecipe.ingredients)
                    ? featuredRecipe.ingredients.slice(0, 3).join(', ')
                    : typeof featuredRecipe.ingredients === 'string'
                    ? featuredRecipe.ingredients.split('\n').slice(0, 3).join(', ')
                    : 'Ingredients not available'}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="card">
          <h2 className="card-title">No recipes yet</h2>
          <p className="card-description">
            Start by parsing a recipe from a PDF, URL, or text, or add one
            manually.
          </p>
          <div className="card-footer">
            <Link href="/upload" className="btn btn-primary">
              📤 Parse first recipe
            </Link>
            <Link href="/recipe/new" className="btn btn-secondary">
              ➕ Add manually
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
