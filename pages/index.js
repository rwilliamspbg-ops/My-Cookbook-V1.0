import { parseUserFromRequest } from "../lib/auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Layout from "../components/Layout";

export async function getServerSideProps({ req, _res }) {
  const user = parseUserFromRequest(req);

  // If no user, redirect to login (or wherever you want)
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { user } };
}

export default function Home({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      const data = await response.json();
      setRecipes(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch {
      console.error("Failed");
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await axios.delete("/api/recipes", {
        data: { id },
      });
      await fetchRecipes();
    } catch {
      console.error("Failed");
    }
  };

  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const filteredRecipes = safeRecipes.filter((recipe) => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.title?.toLowerCase().includes(query) ||
      recipe.description?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Layout>
      <main className="home">
        <div className="page-header">
          <div>
            <h1 className="page-title">🍳 My Cookbook</h1>
            <p className="page-subtitle">
              Search, add, and print family recipes.
            </p>
          </div>
          <div className="page-actions">
            <Link href="/upload" className="btn-pill">
              📤 Parse Recipe
            </Link>
            <Link href="/recipe/new" className="btn-pill primary">
              ➕ Add Recipe
            </Link>
          </div>
        </div>

        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <p className="search-results-count">
              Found {filteredRecipes.length} recipe
              {filteredRecipes.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <section className="recipe-list">
          {filteredRecipes.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchQuery
                  ? `No recipes found matching "${searchQuery}"`
                  : "No recipes yet. Start by parsing or adding a recipe!"}
              </p>
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <article key={recipe.id} className="recipe-card">
                <h3>{recipe.title}</h3>
                <p className="recipe-card-description">
                  {recipe.description ||
                    "A delicious recipe waiting to be discovered"}
                </p>

                {(recipe.prepTime ||
                  recipe.cookTime ||
                  recipe.servings) && (
                  <div className="recipe-card-meta">
                    {recipe.prepTime && <>⏱️ Prep: {recipe.prepTime} </>}
                    {recipe.cookTime && <>• 🔥 Cook: {recipe.cookTime} </>}
                    {recipe.servings && <>• 🍽️ Serves: {recipe.servings}</>}
                  </div>
                )}

                <div className="recipe-card-actions">
                  <Link
                    href={`/recipe/${recipe.id}`}
                    className="btn-pill primary"
                  >
                    📖 View
                  </Link>
                  <Link
                    href={`/recipe/${recipe.id}/edit`}
                    className="btn-pill"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="btn-pill danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </Layout>
  );
}
       
