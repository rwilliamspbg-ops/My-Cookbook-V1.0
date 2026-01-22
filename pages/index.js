import { parseUserFromRequest } from "../lib/auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Layout from "../components/Layout";
import RecipeCarousel from "../components/RecipeCarousel";

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

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState(null);

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
      console.error("Failed to fetch recipes");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Loading recipes...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  const safeRecipes = Array.isArray(recipes) ? recipes : [];

  return (
    <Layout>
      <main className="home" style={styles.main}>
        <div style={styles.actions}>
          <Link href="/upload" className="btn-pill" style={styles.button}>
            📤 Parse Recipe
          </Link>
          <Link href="/recipe/new" className="btn-pill primary" style={{...styles.button, ...styles.buttonPrimary}}>
            ➕ Add Recipe
          </Link>
        </div>
        
        {safeRecipes.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No recipes yet. Start by parsing or adding a recipe!</p>
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
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.5rem 1.25rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(55,65,81,0.5)',
    color: '#e5e7eb',
    textDecoration: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-block',
  },
  buttonPrimary: {
    background: 'radial-gradient(circle at 30% 0, #a855f7, #6366f1)',
    color: '#fff',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#a0a0a0',
  },
};
