import { notFound } from 'next/navigation';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

async function getRecipe(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/recipes/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return null;
    
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch recipe:', error);
    return null;
  }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">{recipe.title || 'Untitled Recipe'}</h1>
            {recipe.description && (
              <p className="card-description">{recipe.description}</p>
            )}
          </div>
          <div className="page-header-actions">
            <Link href={`/recipe/${recipe.id}/edit`} className="btn btn-secondary">
              ✏️ Edit
            </Link>
            <DeleteButton recipeId={recipe.id} />
          </div>
        </div>

        {/* Recipe Info */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          {recipe.prepTime && (
            <div>
              <h4 style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                Prep Time
              </h4>
              <p>{recipe.prepTime}</p>
            </div>
          )}
          {recipe.cookTime && (
            <div>
              <h4 style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                Cook Time
              </h4>
              <p>{recipe.cookTime}</p>
            </div>
          )}
          {recipe.servings && (
            <div>
              <h4 style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                Servings
              </h4>
              <p>{recipe.servings}</p>
            </div>
          )}
        </div>

        {recipe.category && (
          <div style={{ marginBottom: '2rem' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '999px',
                fontSize: '0.875rem',
              }}
            >
              {recipe.category}
            </span>
          </div>
        )}

        {/* Ingredients */}
        {recipe.ingredients && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ingredients</h2>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
              {Array.isArray(recipe.ingredients) ? (
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {recipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              ) : (
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                  {recipe.ingredients}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Instructions</h2>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
              {Array.isArray(recipe.instructions) ? (
                <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {recipe.instructions.map((instruction: string, index: number) => (
                    <li key={index} style={{ marginBottom: '1rem' }}>
                      {instruction}
                    </li>
                  ))}
                </ol>
              ) : (
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                  {recipe.instructions}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {recipe.notes && (
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Notes</h2>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                {recipe.notes}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
