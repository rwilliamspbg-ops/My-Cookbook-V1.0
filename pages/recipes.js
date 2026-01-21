import { parseUserFromRequest } from "../lib/auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export async function getServerSideProps({ req, _res }) {
  const user = parseUserFromRequest(req);
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

export default function RecipesRolodexPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState("A");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes");
        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load recipes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filtered = recipes.filter((r) => {
    const title = (r.title || "").trim();
    if (!title) return false;
    const first = title[0].toUpperCase();
    return first === selectedLetter;
  });

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">📇 Recipe Rolodex</h1>
          <p className="page-subtitle">
            Slide through the alphabet and tap a card to view or edit a recipe.
          </p>
        </div>
        <div className="page-actions">
          <Link href="/" className="btn-pill">
            ← Back to list
          </Link>
          <Link href="/recipe/new" className="btn-pill primary">
            ➕ Add Recipe
          </Link>
        </div>
      </div>

      <div className="rolodex-strip">
        {LETTERS.map((letter) => (
          <button
            key={letter}
            type="button"
            className={`rolodex-letter ${
              selectedLetter === letter ? "active" : ""
            }`}
            onClick={() => setSelectedLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <p className="letter-label">
        Showing recipes starting with &quot;{selectedLetter}&quot;
      </p>

      {loading ? (
        <div className="empty-state">
          <p>Loading your recipes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>
           No recipes found starting with &quot;{selectedLetter}&quot;. Try a different letter.
          </p>
        </div>
      ) : (
        <div className="recipe-row">
          {filtered.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p className="recipe-card-description">
                {recipe.description ||
                  "A delicious recipe waiting to be discovered."}
              </p>

              {(recipe.prepTime || recipe.cookTime || recipe.servings) && (
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
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
