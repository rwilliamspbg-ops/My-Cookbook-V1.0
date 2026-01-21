// pages/recipes.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/AppLayout';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export async function getServerSideProps({ req }) {
  const user = req.cookies?.user_session || null;
  if (!user) {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }
  return { props: { user } };
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState('A');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/recipes');
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = recipes.filter(
    (recipe) => recipe.title && recipe.title[0].toUpperCase() === selectedLetter
  );

  return (
    <Layout>
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>My Recipes</h1>
            <p style={styles.subtitle}>
              Manage and organize your favorite recipes
            </p>
          </div>
          <Link href="/recipe/new">
            <a style={styles.uploadBtn}>
              ➕ Add New Recipe
            </a>
          </Link>
        </div>

        {/* Letter Filter */}
        <div style={styles.filterSection}>
          <p style={styles.filterLabel}>Filter by Letter:</p>
          <div style={styles.letterGrid}>
            {LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                style={{
                  ...styles.letterBtn,
                  ...(selectedLetter === letter ? styles.letterBtnActive : {}),
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.emptyState}>
            <div style={styles.spinner}></div>
            <p>Loading recipes...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>📚</p>
            <h3>No recipes found</h3>
            <p>
              No recipes starting with &quot;{selectedLetter}&quot;
            </p>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && filtered.length > 0 && (
          <div style={styles.grid}>
            {filtered.map((recipe) => (
              <div key={recipe.id} style={styles.card}>
                {recipe.image && (
                  <div style={styles.cardImage}>
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      width={280}
                      height={200}
                      style={styles.image}
                    />
                  </div>
                )}
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{recipe.title}</h3>
                  <p style={styles.cardDescription}>
                    {recipe.description?.substring(0, 100)}...
                  </p>
                  <div style={styles.cardMeta}>
                    {recipe.prepTime && (
                      <span>⏱️ {recipe.prepTime} min</span>
                    )}
                    {recipe.servings && (
                      <span>👥 {recipe.servings} servings</span>
                    )}
                  </div>
                  <div style={styles.cardActions}>
                    <Link href={`/recipe/${recipe.id}`}>
                      <a style={styles.viewBtn}>View</a>
                    </Link>
                    <Link href={`/recipe/${recipe.id}/edit`}>
                      <a style={styles.editBtn}>Edit</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  pageHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  uploadBtn: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    fontWeight: '500',
    transition: 'background-color 150ms ease',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  filterSection: {
    marginBottom: '3rem',
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  filterLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
  },
  letterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
    gap: '0.5rem',
  },
  letterBtn: {
    padding: '0.5rem',
    border: '2px solid #d1d5db',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 150ms ease',
    color: '#6b7280',
  },
  letterBtnActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderColor: '#2563eb',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'all 200ms ease',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImage: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.5rem',
    margin: 0,
  },
  cardDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem',
    margin: 0,
  },
  cardMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: 'auto',
  },
  viewBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '0.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 150ms ease',
    cursor: 'pointer',
  },
  editBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#f3f4f6',
    color: '#111827',
    borderRadius: '0.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 150ms ease',
    cursor: 'pointer',
  },
};
