'use client';

import Link from 'next/link';
import DeleteButton from './DeleteButton';

interface Recipe {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  ingredients: string; // Stored as a JSON string in DB
  instructions: string; // Stored as a JSON string in DB
  prepTime?: string | null;
  cookTime?: string | null;
  servings?: string | null;
  notes?: string | null;
}

export default function RecipeDetailPage({ recipe }: { recipe: Recipe }) {
  // Parse JSON strings safely
  const ingredients = JSON.parse(recipe.ingredients || '[]');
  const instructions = JSON.parse(recipe.instructions || '[]');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Navigation & Header */}
      <header style={{ marginBottom: '2rem' }}>
        <Link 
          href="/recipes" 
          style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← Back to All Recipes
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0, lineHeight: '1.2' }}>{recipe.title}</h1>
          {recipe.category && (
            <span style={{ 
              padding: '0.4rem 1rem', 
              background: 'rgba(139,92,246,0.2)', 
              borderRadius: '99px', 
              fontSize: '0.8rem',
              border: '1px solid rgba(139,92,246,0.3)' 
            }}>
              {recipe.category}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
          {recipe.prepTime && <span>⏱️ Prep: {recipe.prepTime}</span>}
          {recipe.cookTime && <span>🔥 Cook: {recipe.cookTime}</span>}
          {recipe.servings && <span>🍽️ Serves: {recipe.servings}</span>}
        </div>
      </header>

      {/* Description */}
      {recipe.description && (
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem', fontStyle: 'italic', opacity: 0.9 }}>
          {recipe.description}
        </p>
      )}

      {/* Content Grid */}
      <div style={{ display: 'grid', gap: '3rem' }}>
        {/* Ingredients Section */}
        <section>
          <h2 style={{ color: '#a78bfa', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Ingredients
          </h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {ingredients.map((item: string, i: number) => (
              <li key={i} style={{ padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Instructions Section */}
        <section>
          <h2 style={{ color: '#a78bfa', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Instructions
          </h2>
          <ol style={{ paddingLeft: '1.2rem' }}>
            {instructions.map((step: string, i: number) => (
              <li key={i} style={{ marginBottom: '1.2rem', lineHeight: '1.7', paddingLeft: '0.5rem' }}>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Notes */}
        {recipe.notes && (
          <section style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Chef's Notes</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8 }}>{recipe.notes}</p>
          </section>
        )}
      </div>

      {/* Admin Actions */}
      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
        <DeleteButton recipeId={recipe.id} />
      </footer>
    </div>
  );
}
