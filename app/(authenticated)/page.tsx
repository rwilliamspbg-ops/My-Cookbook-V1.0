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
      <section 
        className="card" 
        style={{ 
          marginBottom: '1.5rem',
          background: 'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.15), transparent 60%)'
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 
            className="card-title" 
            style={{ 
              fontSize: '2rem', 
              marginBottom: '0.75rem',
              background: 'linear-gradient(135deg, #e5e7eb 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Welcome back, {firstName}! 👋
          </h1>
          <p className="card-description" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            Your personal AI‑powered cookbook is ready. Parse new recipes,
            curate your favorites, and let dinner ideas find you.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/upload" className="btn btn-secondary">
            📤 Parse recipe
          </Link>
          <Link href="/recipe/new" className="btn btn-primary">
            ➕ Add recipe
          </Link>
          <Link href="/recipes" className="btn btn-secondary">
            📚 View all ({recipes.length})
          </Link>
        </div>
      </section>

      {/* Featured random recipe */}
      {featuredRecipe ? (
        <section
          className="card"
          style={{
            background: 'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.16), transparent 55%), radial-gradient(circle at 100% 100%, rgba(96,165,250,0.14), transparent 55%)',
            border: '1px solid rgba(139,92,246,0.3)'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <div 
                  style={{ 
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    opacity: 0.7,
                    marginBottom: '0.5rem',
                    fontWeight: 600
                  }}
                >
                  ✨ Today's Spotlight
                </div>
                <h2 
                  className="card-title" 
                  style={{ 
                    fontSize: '1.75rem',
                    marginBottom: '0.5rem',
                    lineHeight: '1.3'
                  }}
                >
                  {featuredRecipe.title || 'Untitled recipe'}
                </h2>
              </div>
              <Link
                href={`/recipe/${featuredRecipe.id}`}
                className="btn btn-primary"
                style={{ flexShrink: 0 }}
              >
                View Recipe →
              </Link>
            </div>

            {featuredRecipe.description && (
              <p style={{ 
                marginBottom: '1.25rem',
                lineHeight: '1.6',
                fontSize: '1rem',
                opacity: 0.85
              }}>
                {featuredRecipe.description}
              </p>
            )}

            <div 
              style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                padding: '1.25rem',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div>
                <h4 style={{ 
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  opacity: 0.6,
                  marginBottom: '0.75rem'
                }}>
                  Quick Info
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9375rem' }}>
                  {featuredRecipe.prepTime && (
                    <div>⏱️ Prep: <strong>{featuredRecipe.prepTime}</strong></div>
                  )}
                  {featuredRecipe.cookTime && (
                    <div>🔥 Cook: <strong>{featuredRecipe.cookTime}</strong></div>
                  )}
                  {featuredRecipe.servings && (
                    <div>🍽️ Serves: <strong>{featuredRecipe.servings}</strong></div>
                  )}
                  {featuredRecipe.category && (
                    <div>📁 <strong>{featuredRecipe.category}</strong></div>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ 
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  opacity: 0.6,
                  marginBottom: '0.75rem'
                }}>
                  First Ingredients
                </h4>
                <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', opacity: 0.85 }}>
                  {Array.isArray(featuredRecipe.ingredients)
                    ? featuredRecipe.ingredients.slice(0, 3).join(', ')
                    : typeof featuredRecipe.ingredients === 'string'
                    ? featuredRecipe.ingredients.split('\n').slice(0, 3).join(', ')
                    : 'Ingredients not available'}
                  {((Array.isArray(featuredRecipe.ingredients) && featuredRecipe.ingredients.length > 3) ||
                    (typeof featuredRecipe.ingredients === 'string' && featuredRecipe.ingredients.split('\n').length > 3)) && 
                    '...'}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section 
          className="card"
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            background: 'radial-gradient(circle at center, rgba(139,92,246,0.1), transparent 70%)'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍳</div>
          <h2 className="card-title" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            No recipes yet
          </h2>
          <p className="card-description" style={{ marginBottom: '2rem', fontSize: '1rem' }}>
            Start by parsing a recipe from a PDF, URL, or text, or add one
            manually.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
