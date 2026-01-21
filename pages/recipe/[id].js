import Link from "next/link";
import { useRouter as useNextRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";

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

      <Layout>
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
          <div className="page-actions">
            <Link href="/" className="btn-pill no-print">
              ← Back to cookbook
            </Link>
            <Link
              href={`/recipe/${recipe.id}/edit`}
              className="btn-pill no-print"
            >
              ✏️ Edit
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-pill primary no-print"
              title="Print this recipe"
            >
              🖨️ Print recipe
            </button>
          </div>
        </div>

        <article className="recipe-detail">
          <header className="recipe-detail-header">
            <div className="recipe-card-meta">
              {recipe.prepTimeMinutes && (
                <span>⏱️ Prep: {recipe.prepTimeMinutes} min</span>
              )}
              {recipe.cookTimeMinutes && (
                <span> • 🔥 Cook: {recipe.cookTimeMinutes} min</span>
              )}
              {recipe.servings && (
                <span> • 🍽️ Serves: {recipe.servings}</span>
              )}
              {recipe.category && <span> • 🏷️ {recipe.category}</span>}
            </div>
          </header>

          <section className="recipe-detail-ingredients">
            <h2>Ingredients</h2>
            <ul>
              {ingredients.map((ingredient, idx) => (
                <li key={idx}>
                  <input
                    type="checkbox"
                    id={`ingredient-${idx}`}
                    className="no-print"
                  />
                  <label htmlFor={`ingredient-${idx}`}>{ingredient}</label>
                </li>
              ))}
            </ul>
          </section>

          <section className="recipe-detail-instructions">
            <h2>Instructions</h2>
            <ol>
              {instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>
        </article>
      </Layout>
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
