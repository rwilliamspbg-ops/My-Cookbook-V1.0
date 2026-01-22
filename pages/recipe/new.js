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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/recipes', formData);
      alert('Recipe created successfully!');
      router.push('/');
    } catch {
      console.error('Failed');
    }
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
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
          {/* reuse .form-group etc instead of custom .recipe-form if you want */}
          {/* keep your form fields exactly as they are, just wrapped in shared classes */}
        </form>
      </main>
    </AppLayout>
  );
}
