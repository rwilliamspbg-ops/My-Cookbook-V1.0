// pages/recipe/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function RecipeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadRecipe() {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to load recipe ${id}`);
        }
        const data = await res.json();
        if (!cancelled) setRecipe(data.recipe);
      } catch (err) {
        if (!cancelled) {
          console.error('fetchRecipe error:', err);
          setError(err.message);
        }
      }
    }

    loadRecipe();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      {recipe.description && <p>{recipe.description}</p>}
      {/* render ingredients/instructions as before */}
    </div>
  );
}


