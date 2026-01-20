import { parseUserFromRequest } from '../lib/auth';

export async function getServerSideProps({ req, _res }) {
  const user = parseUserFromRequest(req);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: { user } };
}
import { useEffect, useState } from 'react';
import Link from 'next/link';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function RecipesRolodexPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState('A');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('/api/recipes');
        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load recipes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filtered = recipes.filter((r) => {
    const title = (r.title || '').trim();
    if (!title) return false;
    const first = title[0].toUpperCase();
    return first === selectedLetter;
  });

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
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%);
          border-radius: 10px;
          color: white;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 2.4em;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          font-family: 'Georgia', serif;
        }
        .subheading {
          margin: 0;
          font-size: 1rem;
          opacity: 0.9;
        }
        .rolodex-strip {
          display: flex;
          overflow-x: auto;
          gap: 6px;
          padding: 10px;
          margin: 20px 0 10px;
          background: #fff5f7;
          border-radius: 999px;
          border: 2px solid #dc143c;
        }
        .rolodex-letter {
          min-width: 32px;
          height: 32px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          cursor: pointer;
          border: 1px solid transparent;
          color: #dc143c;
          background: white;
          transition: all 0.2s ease;
          user-select: none;
        }
        .rolodex-letter:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        .rolodex-letter.active {
          background: #dc143c;
          color: white;
          border-color: #dc143c;
        }
        .letter-label {
          margin-top: 10px;
          font-style: italic;
          color: #666;
          text-align: center;
        }
        .recipe-row {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(260px, 1fr);
          gap: 20px;
          overflow-x: auto;
          padding: 10px 0 5px;
        }
        .recipe-card {
          background: white;
          border: 3px solid #dc143c;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(220, 20, 60, 0.2);
          transition: all 0.3s ease;
          position: relative;
          min-width: 260px;
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
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(220, 20, 60, 0.3);
        }
        .recipe-card h3 {
          margin: 0 0 10px 0;
          color: #dc143c;
          font-size: 1.4em;
          font-family: 'Georgia', serif;
          border-bottom: 2px solid #dc143c;
          padding-bottom: 8px;
        }
        .recipe-description {
          color: #555;
          font-size: 0.95em;
          line-height: 1.5;
          margin-bottom: 15px;
        }
        .recipe-meta {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        .meta-item {
          background: #f8f8f8;
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 0.8em;
          color: #666;
          border: 1px solid #ddd;
        }
        .recipe-actions {
          display: flex;
          gap: 8px;
          justify-content: space-between;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px dashed #dc143c;
        }
        .btn {
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-secondary {
          background: #ffffff;
          color: #dc143c;
          border: 2px solid #dc143c;
        }
        .btn-secondary:hover {
          background: #dc143c;
          color: white;
          transform: translateY(-2px);
        }
        .btn-primary {
          background: #ff6b6b;
          color: white;
          border: 2px solid #ff6b6b;
        }
        .btn-primary:hover {
          background: #dc143c;
          border-color: #dc143c;
          transform: translateY(-2px);
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #fff 0%, #ffe0e0 100%);
          border-radius: 12px;
          border: 3px dashed #dc143c;
          margin-top: 20px;
        }
        .empty-state p {
          font-size: 1.1em;
          color: #dc143c;
          margin: 0;
          font-weight: bold;
        }
        @media (max-width: 768px) {
          .recipe-row {
            grid-auto-columns: minmax(240px, 1fr);
          }
        }
      `}</style>
      <div className="checkerboard-bg">
        <div className="container">
          <header className="header">
            <h1>📇 Recipe Rolodex</h1>
            <p className="subheading">
              Slide through the alphabet and tap a card to view or edit a recipe.
            </p>
          </header>

          <div className="rolodex-strip">
            {LETTERS.map((letter) => (
              <button
                key={letter}
                type="button"
                className={`rolodex-letter ${
                  selectedLetter === letter ? 'active' : ''
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
                No recipes found starting with &quot;{selectedLetter}&quot;. Try a
                different letter.
              </p>
            </div>
          ) : (
            <div className="recipe-row">
              {filtered.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <h3>{recipe.title}</h3>
                  <p className="recipe-description">
                    {recipe.description ||
                      'A delicious recipe waiting to be discovered.'}
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
                      className="btn btn-secondary"
                    >
                      📖 View
                    </Link>
                    <Link
                      href={`/recipe/${recipe.id}/edit`}
                      className="btn btn-primary"
                    >
                      ✏️ Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
