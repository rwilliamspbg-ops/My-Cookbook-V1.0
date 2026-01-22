import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import AppLayout from '../../components/AppLayout';

export default function RecipeForm({ _mode = 'create', _initialValues }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prepTime: '',
    cookTime: '',
    servings: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/recipes', formData);
      alert('Recipe created successfully!');
      router.push('/');
    } catch (err) {
      console.error('Failed to create recipe', err);
      alert('Failed to create recipe. Please try again.');
    }
  };

  return (
    <AppLayout>
      <main className="page-container">
        <div className="page-header">
          <h1>Create New Recipe</h1>
          <Link href="/" className="btn btn-secondary">
            ← Back to Recipes
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prepTime">Prep time</label>
            <input
              id="prepTime"
              name="prepTime"
              type="text"
              value={formData.prepTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cookTime">Cook time</label>
            <input
              id="cookTime"
              name="cookTime"
              type="text"
              value={formData.cookTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="servings">Servings</label>
            <input
              id="servings"
              name="servings"
              type="number"
              value={formData.servings}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full mt-4"
          >
            Create Recipe
          </button>
        </form>
      </main>
    </AppLayout>
  );
}
