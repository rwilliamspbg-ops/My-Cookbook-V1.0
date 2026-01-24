'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
interface Recipe {
  id: string | number;
  title: string;
  description?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  category?: string;
  ingredients?: string[] | string;
}
export default function RecipeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: '',
    instructions: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create recipe');
      }

      router.push(`/recipe/${data.id}`);
      router.refresh();
    } catch (err: any) {
      console.error('Error creating recipe:', err);
      setError(err.message || 'Failed to create recipe');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Recipe Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Chocolate Chip Cookies"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            color: '#fff',
          }}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the recipe"
          rows={2}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            color: '#fff',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Row: Category, Prep, Cook, Servings */}
      <div className="grid grid-2" style={{ gap: '1rem' }}>
        <div>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Dessert"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
          />
        </div>

        <div>
          <label htmlFor="servings" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Servings
          </label>
          <input
            type="text"
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            placeholder="e.g., 4 servings"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
          />
        </div>

        <div>
          <label htmlFor="prepTime" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Prep Time
          </label>
          <input
            type="text"
            id="prepTime"
            name="prepTime"
            value={formData.prepTime}
            onChange={handleChange}
            placeholder="e.g., 15 mins"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
          />
        </div>

        <div>
          <label htmlFor="cookTime" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Cook Time
          </label>
          <input
            type="text"
            id="cookTime"
            name="cookTime"
            value={formData.cookTime}
            onChange={handleChange}
            placeholder="e.g., 30 mins"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
          />
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label htmlFor="ingredients" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Ingredients *
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          required
          placeholder="One ingredient per line"
          rows={8}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            color: '#fff',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Instructions */}
      <div>
        <label htmlFor="instructions" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Instructions *
        </label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          placeholder="Step-by-step instructions"
          rows={10}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            color: '#fff',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes, tips, or variations"
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            color: '#fff',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            borderRadius: '0.5rem',
            color: '#fca5a5',
          }}
        >
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        {isSubmitting ? 'Creating...' : '✅ Create Recipe'}
      </button>
    </form>
  );
}
