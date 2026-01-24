'use client';

import Link from 'next/link';
import DeleteButton from './DeleteButton';

interface Recipe {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  ingredients?: string; // These are usually JSON strings or arrays in your DB
  instructions?: string;
  prepTimeMinutes?: number | string;
  cookTimeMinutes?: number | string;
  servings?: number | string;
}

export default function RecipeDetailPage({ recipe }: { recipe: Recipe }) {
  // Guard clause to handle missing data
  if (!recipe) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Recipe not found</h2>
        <Link href="/recipes">Back to all recipes</Link>
      </div>
    );
  }

  // If ingredients/instructions are stored as JSON strings, parse them
  const ingredients = typeof recipe.ingredients === 'string' 
    ? JSON.parse(recipe.ingredients) 
    : [];
  const instructions = typeof recipe.instructions === 'string' 
    ? JSON.parse(recipe.instructions) 
    : [];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <Link href="/recipes" style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Recipes
        </Link>
        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>{recipe.title}</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', opacity: 0.8 }}>
          {recipe.prepTimeMinutes && <span>⏱️ Prep: {recipe.prepTimeMinutes} mins</span>}
          {recipe.cookTimeMinutes && <span>🔥 Cook: {recipe.cookTimeMinutes} mins</span>}
          {recipe.servings && <span>🍽️ Serves: {recipe.servings}</span>}
        </div>
      </header>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Ingredients</h2>
        <ul>
          {ingredients.map((item: string, i: number) => (
            <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Instructions</h2>
        <ol>
          {instructions.map((step: string, i: number) => (
            <li key={i} style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{step}</li>
          ))}
        </ol>
      </section>

      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <DeleteButton recipeId={recipe.id} />
      </footer>
    </div>
  );
}


