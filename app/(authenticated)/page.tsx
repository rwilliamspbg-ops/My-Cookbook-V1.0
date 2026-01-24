import { cookies } from 'next/headers';
import { parseUserFromRequest } from '@/lib/auth';
import Link from 'next/link';

interface Recipe {
  id: number;
  title?: string;
  description?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number | string;
  category?: string;
  ingredients?: string[] | string;
}

async function getRecipes(): Promise<Recipe[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/recipes`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? (data as Recipe[]) : [];
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    return [];
  }
}

function getFeaturedRecipe(recipes: Recipe[]): Recipe | null {
  if (recipes.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * recipes.length);
  return recipes[randomIndex];
}

interface MockRequest {
  headers: {
    cookie?: string;
  };
}

export default async function Home() {
  const cookieStore = await cookies();
  const mockReq: MockRequest = {
    headers: { cookie: cookieStore.toString() },
  };
  const user = parseUserFromRequest(mockReq);

  const recipes = await getRecipes();
  const featuredRecipe = getFeaturedRecipe(recipes);

  const firstName =
    user?.name?.split?.(' ')?.[0] || user?.email?.split?.('@')?.[0] || 'Friend';

  const ingredientPreview = (() => {
    if (!featuredRecipe?.ingredients) return 'Ingredients not available';

    if (Array.isArray(featuredRecipe.ingredients)) {
      const slice = featuredRecipe.ingredients.slice(0, 3);
      return slice.join(', ') + (featuredRecipe.ingredients.length > 3 ? '…' : '');
    }

    if (typeof featuredRecipe.ingredients === 'string') {
      const lines = featuredRecipe.ingredients.split('\n').filter(Boolean);
      const slice = lines.slice(0, 3);
      return slice.join(', ') + (lines.length > 3 ? '…' : '');
    }

    return 'Ingredients not available';
  })();

  return (
    <main className="page-container">
      {/* Welcome hero */}
      <section
        className="card"
        style={{
          marginBottom: '1.5rem',
          background:
            'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.15), transparent 60%)',
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
              backgroundClip: 'text',
            }}
          >
            Welcome back, {firstName}! 👋
          </h1>
          <p
            className="card-description"
            style={{ fontSize: '1rem', lineHeight: '1.6' }}
          >
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
            background:
              'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.16), transparent 55%), radial-gradient(circle at 100% 100%, rgba(96,165,250,0.14), transparent 55%)',
            border: '1px solid rgba(139,92,246,0.3)',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
                gap: '1rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    opacity: 0.7,
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                  }}
                >
                  ✨ Today&apos;s Spotlight
                </div>
                <h2
                  className="card-title"
                  style={{
                    fontSize: '1.75rem',
                    marginBottom: '0.25rem',
                    lineHeight: '1.3',
                  }}
                >
                  {featuredRecipe.title || 'Untitled recipe'}
                </h2>
                {featuredRecipe.category && (
                  <div
                    style={{
                      marginTop: '0.25rem',
                      fontSize: '0.875rem',
                      opacity: 0.8,
                    }}
                  >
                    <span
                      style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '999px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(0,0,0,0.3)',
                      }}
                    >
                      📁 {featuredRecipe.category}
                    </span>
                  </div>
                )}
              </div>
              <Link
                href={`/recipe/${featuredRecipe.id}`}
                className="btn btn-primary"
                style={{ flexShrink: 0 }}
              >
                View Recipe →
              </Link>
            </div>

            {/* Description */}
            {featuredRecipe.description && (
              <p
                style={{
                  marginBottom: '1.25rem',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                  opacity: 0.85,
                  maxWidth: '48rem',
                }}
              >
                {featuredRecipe.description}
              </p>
            )}

            {/* Info grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                padding: '1.25rem',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Quick Info */}
              <div>
                <h4
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    opacity: 0.6,
                    marginBottom: '0.75rem',
                  }}
                >
                  Quick Info
                </h4>
                <dl
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    rowGap: '0.35rem',
                    columnGap: '0.75rem',
                    fontSize: '0.9375rem',
                  }}
                >
                  {featuredRecipe.prepTime && (
                    <>
                      <dt style={{ opacity: 0.8 }}>⏱️ Prep</dt>
                      <dd style={{ margin: 0, fontWeight: 600 }}>
                        {featuredRecipe.prepTime}
                      </dd>
                    </>
                  )}
                  {featuredRecipe.cookTime && (
                    <>
                      <dt style={{ opacity: 0.8 }}>🔥 Cook</dt>
                      <dd style={{ margin: 0, fontWeight: 600 }}>
                        {featuredRecipe.cookTime}
                      </dd>
                    </>
                  )}
                  {featuredRecipe.servings && (
                    <>
                      <dt style={{ opacity: 0.8 }}>🍽️ Serves</dt>
                      <dd style={{ margin: 0, fontWeight: 600 }}>
                        {featuredRecipe.servings}
                      </dd>
                    </>
                  )}
                </dl>
              </div>

              {/* First ingredients */}
              <div>
                <h4
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    opacity: 0.6,
                    marginBottom: '0.75rem',
                  }}
                >
                  First Ingredients
                </h4>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: '1.6',
                    opacity: 0.85,
                  }}
                >
                  {ingredientPreview}
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
            background:
              'radial-gradient(circle at center, rgba(139,92,246,0.1), transparent 70%)',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍳</div>
          <h2
            className="card-title"
            style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}
          >
            No recipes yet
          </h2>
          <p
            className="card-description"
            style={{ marginBottom: '2rem', fontSize: '1rem' }}
          >
            Start by parsing a recipe from a PDF, URL, or text, or add one
            manually.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
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

