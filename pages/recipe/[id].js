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
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || `Failed to load recipe ${id}`);
        }
        if (!data.recipe) {
          throw new Error(`Recipe ${id} not found`);
        }

        if (!cancelled) {
          setRecipe(data.recipe);
        }
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

      {recipe.ingredients?.length > 0 && (
        <>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </>
      )}

      {recipe.instructions?.length > 0 && (
        <>
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}



