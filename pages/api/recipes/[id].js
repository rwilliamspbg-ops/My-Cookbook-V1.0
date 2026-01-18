export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // TODO: replace this with your real data source
      const recipe = {
        id,
        name: 'Sample Recipe',
        description: 'Placeholder recipe from the /api/recipes/[id] route.',
        servings: 4,
        ingredients: ['1 cup flour', '2 eggs', '1 tsp salt'],
        instructions: ['Mix ingredients', 'Bake for 20 minutes at 350°F'],
      };

      res.status(200).json({ recipe });
    } catch (err) {
      res.status(500).json({ error: 'Failed to load recipe' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

    fetchRecipe();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading recipe...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!recipe) return <div className={styles.error}>Recipe not found</div>;

  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === 'string'
    ? recipe.ingredients.split('\n').filter(Boolean)
    : [];

  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : typeof recipe.instructions === 'string'
    ? recipe.instructions.split('\n').filter(Boolean)
    : [];

  return (
    <>
      <Head>
        <title>{recipe.name} - My Cookbook</title>
        <meta name="description" content={`Recipe for ${recipe.name}`} />
      </Head>

      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <a href="/" className={styles.backLink}>← Back to Cookbook</a>
          <button 
            onClick={() => window.print()} 
            className={styles.printButton}
            title="Print this recipe"
          >
            🖨️ Print
          </button>
        </header>

        <div className={styles.recipeCard}>
          <div className={styles.cardHeader}>
            <h1 className={styles.recipeName}>{recipe.name}</h1>
            {recipe.description && (
              <p className={styles.description}>{recipe.description}</p>
            )}
            {recipe.servings && (
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  👥 Servings: <strong>{recipe.servings}</strong>
                </span>
              </div>
            )}
          </div>

          <div className={styles.cardContent}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Ingredients</h2>
              <ul className={styles.ingredientsList}>
                {ingredients.map((ingredient, idx) => (
                  <li key={idx} className={styles.ingredientItem}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      id={`ingredient-${idx}`}
                    />
                    <label htmlFor={`ingredient-${idx}`}>
                      {ingredient}
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Instructions</h2>
              <ol className={styles.instructionsList}>
                {instructions.map((instruction, idx) => (
                  <li key={idx} className={styles.instructionItem}>
                    {instruction}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {recipe.notes && (
            <div className={styles.cardFooter}>
              <h3 className={styles.notesTitle}>Notes</h3>
              <p className={styles.notes}>{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


