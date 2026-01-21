import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import RecipeCarousel from '../components/RecipeCarousel';

export async function getServerSideProps({ req }) {
  const user = req.cookies?.user_session || null;
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

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setRecipes(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={styles.container}>
          <p>Loading recipes...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={styles.container}>
          <p style={{ color: '#ff6b6b' }}>{error}</p>
        </div>
      </Layout>
    );
  }

  const safeRecipes = Array.isArray(recipes) ? recipes : [];

  return (
    <Layout>
      <main style={styles.main}>
        <h1 style={styles.title}>All Recipes</h1>
        {safeRecipes.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No recipes found</p>
          </div>
        ) : (
          <RecipeCarousel recipes={safeRecipes} />
        )}
      </main>
    </Layout>
  );
}

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
  },
  container: {
    textAlign: 'center',
    padding: '2rem',
    color: '#9ca3af',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#e5e7eb',
    margin: '0 0 1rem 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#9ca3af',
  },
};
