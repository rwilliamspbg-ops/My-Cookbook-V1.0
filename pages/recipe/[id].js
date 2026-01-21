import Link from "next/link";
import { useRouter as useNextRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import AppLayout from "../../components/AppLayout";

export default function RecipePage() {
  const router = useNextRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Recipe Data
  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) throw new Error("Recipe not found");
        const data = await res.json();
        setRecipe(data.recipe);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="error-container">
        <p>Recipe not found</p>
      </div>
    );
  }

  const ingredients = parseData(recipe.ingredients);
  const instructions = parseData(recipe.instructions);

  return (
  <>
    <Head>
      <title>{recipe.title} - My Cookbook</title>
    </Head>

    <AppLayout>
      {/* Action buttons - only render once */}
      <div className="page-actions" style={{ marginBottom: '1rem' }}>
        <Link href="/" className="btn-pill">
          ← Back to cookbook
        </Link>
        <Link
          href={`/recipe/${recipe.id}/edit`}
          className="btn-pill"
        >
          ✏️ Edit
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-pill primary"
          title="Print this recipe"
        >
          🖨️ Print recipe
        </button>
      </div>

      {/* Recipe title and description */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{recipe.title}</h1>
        {recipe.description && (
          <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>{recipe.description}</p>
        )}
      </div>

      {/* Recipe metadata */}
      <article className="recipe-detail">
        <header className="recipe-detail-header style={{ display: 'none' }}">
          <div className="recipe-card-meta">
            {(recipe.prepTime || recipe.prep_time) && (
              <span>⏱️ Prep: {recipe.prepTime || recipe.prep_time} min</span>
            )}
            {(recipe.cookTime || recipe.cook_time) && (
              <span> • 🔥 Cook: {recipe.cookTime || recipe.cook_time} min</span>
            )}
            {recipe.servings && (
              <span> • 🍽️ Serves: {recipe.servings}</span>
            )}
            {recipe.category && <span> • 🏷️ {recipe.category}</span>}
          </div>
        </header>

        {/* Ingredients section */}
        <section className="recipe-detail-ingredients">
          <h2>Ingredients</h2>
          {ingredients.length > 0 ? (
            <ul>
              {ingredients.map((ingredient, idx) => (
                <li key={idx}>
                  <input
                    type="checkbox"
                    id={`ingredient-${idx}`}
                    className="no-print"
                  />
                  <label htmlFor={`ingredient-${idx}`}> style={{ color: '#000' }}{ingredient}</label>
                </li>
              ))}
            </ul>
          ) : (
            <p>No ingredients listed.</p>
          )}
        </section>

        {/* Instructions section */}
        <section className="recipe-detail-instructions">
          <h2>Instructions</h2>
          {instructions.length > 0 ? (
            <ol>
              {instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          ) : (
            <p>No instructions listed.</p>
          )}
        </section>
      </article>
   </AppLayout>
  </>
);

function parseData(data) {
  try {
    if (typeof data === "string") return JSON.parse(data);
    return Array.isArray(data) ? data : [];
  } catch {
    return typeof data === "string"
      ? data.split("\n").filter(Boolean)
          : [];
  }
}
}

