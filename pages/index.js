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
          background-image: linear-gradient(45deg, #dc143c 
