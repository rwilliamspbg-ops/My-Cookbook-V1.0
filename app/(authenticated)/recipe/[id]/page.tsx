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
      {/* Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h1 className="card-title" style={{ marginBottom: '0.875rem' }}>
          {recipe.title || 'Untitled Recipe'}
        </h1>
        
        {recipe.description && (
          <p className="card-description" style={{ marginBottom: '1.5rem' }}>
            {recipe.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="page-header-actions">
          <Link href={`/recipe/${recipe.id}/edit`} className="btn btn-secondary">
            ✏️ Edit
          </Link>
          <DeleteButton recipeId={recipe.id} />
        </div>
      </div>

      {/* Quick Info Card */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '1.5rem',
          background: 'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.15), rgba(20,16,34,0.8) 70%)',
        }}
      >
        <div className="grid grid-3">
          {recipe.prepTime && (
            <div>
              <h4 style={{ fontSize: '0.75rem', marginBottom: '0.5rem', opacity: 0.7 }}>
                PREP TIME
              </h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                {recipe.prepTime}
              </p>
            </div>
          )}
          {recipe.cookTime && (
            <div>
              <h4 style={{ fontSize: '0.75rem', marginBottom: '0.5rem', opacity: 0.7 }}>
                COOK TIME
              </h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                {recipe.cookTime}
              </p>
            </div>
          )}
          {recipe.servings && (
            <div>
              <h4 style={{ fontSize: '0.75rem', marginBottom: '0.5rem', opacity: 0.7 }}>
                SERVINGS
              </h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                {recipe.servings}
              </p>
            </div>
          )}
          {recipe.category && (
            <div>
              <h4 style={{ fontSize: '0.75rem', marginBottom: '0.5rem', opacity: 0.7 }}>
                CATEGORY
              </h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                {recipe.category}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients Card */}
      {recipe.ingredients && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">
            <span className="section-title-icon">🥕</span>
            Ingredients
          </h2>
          <div className="content-section">
            {Array.isArray(recipe.ingredients) ? (
              <ul style={{ fontSize: '1.0625rem' }}>
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <li key={index}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="prose">
                {recipe.ingredients}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions Card */}
      {recipe.instructions && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">
            <span className="section-title-icon">👨‍🍳</span>
            Instructions
          </h2>
          <div className="content-section">
            {Array.isArray(recipe.instructions) ? (
              <ol style={{ fontSize: '1.0625rem', lineHeight: 1.9 }}>
                {recipe.instructions.map((instruction: string, index: number) => (
                  <li key={index} style={{ marginBottom: '1.25rem', paddingLeft: '0.5rem' }}>
                    {instruction}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="prose">
                {recipe.instructions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes Card */}
      {recipe.notes && (
        <div 
          className="card"
          style={{
            background: 'radial-gradient(circle at 100% 100%, rgba(96,165,250,0.12), rgba(20,16,34,0.8) 70%)',
          }}
        >
          <h2 className="section-title">
            <span className="section-title-icon">📝</span>
            Notes & Tips
          </h2>
          <div className="content-section">
            <div className="prose">
              {recipe.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
