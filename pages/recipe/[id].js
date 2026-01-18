import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/recipe-card.module.css';

export default function RecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dishImage, setDishImage] = useState(null);

  // 1. Fetch Recipe Data
  useEffect(() => {
    if (!id) return;
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) throw new Error('Recipe not found');
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

  // 2. Generate Image (Triggered when recipe name is available)
  useEffect(() => {
    if (!recipe?.name) return;
    const generateDishImage = async () => {
      // Your image generation logic here
    };
    generateDishImage();
  }, [recipe?.name]);

  if (loading) return <div className={styles.loading}>Loading recipe...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!recipe) return <div className={styles.error}>Recipe not found</div>;

  // Helper logic for parsing ingredients/instructions
  const ingredients = parseData(recipe.ingredients);
  const instructions = parseData(recipe.instructions);

  return (
    <>
      <Head>
        <title>{recipe.name} - My Cookbook</title>
      </Head>
      <div className={styles.pageContainer}>
        {/* Header with navigation and print button */}
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Cookbook
          </Link>
          <button
            onClick={() => window.print()}
            className={styles.printButton}
            title="Print this recipe"
          >
            🖨 Print
          </button>
        </header>

        {/* Main Recipe Card */}
        <article className={styles.recipeCard}>
          {/* Card Header with title and description */}
          <header className={styles.cardHeader}>
            <h1 className={styles.recipeName}>{recipe.name}</h1>
            {recipe.description && (
              <p className={styles.description}>{recipe.description}</p>
            )}
            {/* Meta information as pill-style badges */}
            <div className={styles.meta}>
              {recipe.prepTime && (
                <span className={styles.metaItem}>⏱ Prep: {recipe.prepTime}</span>
              )}
              {recipe.cookTime && (
                <span className={styles.metaItem}>🔥 Cook: {recipe.cookTime}</span>
              )}
              {recipe.servings && (
                <span className={styles.metaItem}>🍽 Serves: {recipe.servings}</span>
              )}
              {recipe.category && (
                <span className={styles.metaItem}>🏷 {recipe.category}</span>
              )}
            </div>
          </header>
            {/* Dish Image */}
            {dishImage && (
              <div className={styles.dishImageContainer}>
                <Image
                  src={dishImage}
                  alt={recipe.name}
                  className={styles.dishImage}
                  loading="lazy"
                />
              </div>
            )}

          {/* Two-column layout: ingredients and instructions */}
          <section className={styles.cardContent}>
            {/* Ingredients Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Ingredients</h2>
              <ul className={styles.ingredientsList}>
                {ingredients.map((ingredient, idx) => (
                  <li key={idx} className={styles.ingredientItem}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      id={`ingredient-${idx}`}
                      aria-label={`Check off ${ingredient}`}
                    />
                    <label
                      htmlFor={`ingredient-${idx}`}
                      className={styles.ingredientLabel}
                    >
                      {ingredient}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Instructions</h2>
              <ol className={styles.instructionsList}>
                {instructions.map((step, idx) => (
                  <li key={idx} className={styles.instructionItem}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </article>
      </div>
    </>
  );
function parseData(data) {
  try {
    if (typeof data === 'string') return JSON.parse(data);
    return Array.isArray(data) ? data : [];
  } catch () {
    return typeof data === 'string' ? data.split('\n').filter(Boolean) : [];
  }
}
}
