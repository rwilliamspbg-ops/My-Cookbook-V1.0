import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes');
      setRecipes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load recipes');
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      await axios.delete(`/api/recipes/${id}`);
      fetchRecipes();
    } catch (err) {
      alert('Failed to delete recipe');
    }
  };

  if (loading) return <div className="container"><p>Loading recipes...</p></div>;
  if (error) return <div className="container"><p>{error}</p></div>;

  return (
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

      <main className="recipe-grid">
        {recipes.length === 0 ? (
          <div className="empty-state">
            <p>No recipes yet. Start by parsing or adding a recipe!</p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p className="recipe-descrip
