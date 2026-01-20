import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setRecipes(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch {
      console.error('Failed');
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await axios.delete('/api/recipes', {
        data: { id }, // matches req.body.id in API
      });
      await fetchRecipes();
    } catch {
      console.error('Failed');
    }
  };

  // Filter recipes based on search query
  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const filteredRecipes = safeRecipes.filter((recipe) => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.title?.toLowerCase().includes(query) ||
      recipe.description?.toLowerCase().includes(query)
    );
  });

  console.log('recipes value:', recipes);
  console.log('type:', typeof recipes, Array.isArray(recipes));

  if (loading)
    return (
      <div className="loading-container">
        <p>Loading recipes...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );

  return (
    <>
      <style jsx>{`
        .checkerboard-bg {
          min-height: 100vh;
          background-image: linear-gradient(45deg, #dc143c 25%, transparent 25%),
            linear-gradient(-45deg, #dc143c 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #dc143c 75%),
            linear-gradient(-45deg, transparent 75%, #dc143c 75%);
          background-size: 60px 60px;
          background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
          background-color: #ffffff;
          padding: 20px;
        }
        .container {
          max-width: 1400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px;
          background: linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%);
          border-radius: 10px;
          color: white;
        }
        .header h1 {
          margin: 0 0 20px 0;
          font-size: 3em;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          font-family: 'Georgia', serif;
        }
        .header-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .search-section {
          margin-bottom: 30px;
          text-align: center;
        }
        .search-input {
          width: 100%;
          max-width: 600px;
          padding: 15px 20px;
          font-size: 16px;
          border: 3px solid #dc143c;
          border-radius: 10px;
          outline: none;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          box-shadow: 0 0 20px rgba(220, 20, 60, 0.3);
          border-color: #ff6b6b;
        }
        .search-results-count {
          margin-top: 10px;
          color: #666;
          font-style: italic;
        }
        .btn {
          padding: 12px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary {
          background: white;
          color: #dc143c;
          border: 2px solid white;
        }
        .btn-primary:hover {
          background: #dc143c;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
        }
        .btn-secondary:hover {
          background: white;
          color: #dc143c;
          transform: translateY(-2px);
        }
        .btn-sm {
          padding: 8px 16px;
          font-size: 14px;
        }
        .btn-danger {
          background: #dc143c;
          color: white;
        }
        .btn-danger:hover {
          background: #a00000;
          transform: translateY(-2px);
        }
        .recipe-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
          margin-top: 20px;
        }
        .recipe-card {
          background: white;
          border: 3px solid #dc143c;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 5px 15px rgba(220, 20, 60, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .recipe-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #dc143c, #ff6b6b, #dc143c);
        }
        .recipe-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(220, 20, 60, 0.3);
        }
        .recipe-card h3 {
          margin: 0 0 15px 0;
          color: #dc143c;
          font-size: 1.8em;
          font-family: 'Georgia', serif;
          border-bottom: 2px solid #dc143c;
          padding-bottom: 10px;
        }
        .recipe-description {
          color: #555;
          font-size: 1em;
          line-height: 1.6;
          margin-bottom: 20px;
          min-height: 60px;
        }
        .recipe-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .meta-item {
          background: #f8f8f8;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.9em;
          color: #666;
          border: 1px solid #ddd;
        }
        .recipe-actions {
          display: flex;
          gap: 10px;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 2px dashed #dc143c;
        }
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: linear-gradient(135deg, #fff 0%, #ffe0e0 100%);
          border-radius: 12px;
          border: 3px dashed #dc143c;
        }
        .empty-state p {
          font-size: 1.4em;
          color: #dc143c;
          margin: 0;
          font-weight: bold;
        }
        .loading-container,
        .error-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: linear-gradient(45deg, #dc143c 25%, transparent 25%),
            linear-gradient(-45deg, #dc143c 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #dc143c 75%),
            linear-gradient(-45deg, transparent 75%, #dc143c 75%);
          background-size: 60px 60px;
          background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
          background-color: #ffffff;
        }
        .loading-container p,
        .error-container p {
          background: white;
          padding: 30px 60px;
          border-radius: 12px;
          font-size: 1.5em;
          color: #dc143c;
          border: 3px solid #dc143c;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        @media (max-width: 768px) {
          .recipe-grid {
            grid-template-columns: 1fr;
          }

          .header h1 {
            font-size: 2em;
          }

          .header-actions {
            flex-direction: column;
          }
        }
      `}</style>
      <div className="checkerboard-bg">
        <div className="container">
          <header className="header">
            <h1>🍳 My Cookbook V1.0</h1>
            <div className="header-actions">
              <Link href="/upload" className="btn btn-primary">
                📤 Parse Recipe
              </Link>
              <Link href="/recipe/new" className="btn btn-secondary">
                ➕ Add Recipe Manually
              </Link>
            </div>
          </header>
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search recipes by title, description, ingredients, or instructions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <p className="search-results-count">
                Found {filteredRecipes.length} recipe
                {filteredRecipes.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <main className="recipe-grid">
            {filteredRecipes.length === 0 ? (
              <div className="empty-state">
                <p>
                  {searchQuery
                    ? `No recipes found matching "${searchQuery}"`
                    : 'No recipes yet. Start by parsing or adding a recipe!'}
                </p>
              </div>
            ) : (
              filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <h3>{recipe.title}</h3>
                  <p className="recipe-description">
                    {recipe.description ||
                      'A delicious recipe waiting to be discovered'}
                  </p>
                  {(recipe.prepTime ||
                    recipe.cookTime ||
                    recipe.servings) && (
                    <div className="recipe-meta">
                      {recipe.prepTime && (
                        <span className="meta-item">
                          ⏱️ Prep: {recipe.prepTime}
                        </span>
                      )}
                      {recipe.cookTime && (
                        <span className="meta-item">
                          🔥 Cook: {recipe.cookTime}
                        </span>
                      )}
                      {recipe.servings && (
                        <span className="meta-item">
                          🍽️ Serves: {recipe.servings}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="recipe-actions">
                    <Link
                      href={`/recipe/${recipe.id}`}
                      className="btn btn-sm btn-secondary"
                    >
                      📖 View
                    </Link>
                    <Link
                      href={`/recipe/${recipe.id}/edit`}
                      className="btn btn-sm btn-primary"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => deleteRecipe(recipe.id)}
                      className="btn btn-sm btn-danger"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </>
  );
}
