import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function RecipeForm({ mode = "create", initialValues }) {
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
  console.error("Failed");
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
    <div className="container">
      <div className="recipe-detail-header">
        <Link href="/" className="btn btn-back">← Back to Recipes</Link>
        <h1>Create New Recipe</h1>
      </div>

      <form onSubmit={handleSubmit} className="recipe-form">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-title"
          placeholder="Recipe Title"
          required
        />
        
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-description"
          placeholder="Description"
          rows="3"
        />

        <div className="form-row">
          <input
            type="text"
            value={formData.prepTime}
            onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
            placeholder="Prep Time (e.g., 15 min)"
          />
          <input
            type="text"
            value={formData.cookTime}
            onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
            placeholder="Cook Time (e.g., 30 min)"
          />
          <input
            type="number"
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
            placeholder="Servings"
          />
        </div>

        <h3>Ingredients</h3>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="array-item">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
              placeholder="Ingredient"
              required
            />
            <button type="button" onClick={() => removeArrayItem('ingredients', index)} className="btn-remove">×</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('ingredients')} className="btn btn-add">+ Add Ingredient</button>

        <h3>Instructions</h3>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="array-item">
            <textarea
              value={instruction}
              onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              rows="2"
              required
            />
            <button type="button" onClick={() => removeArrayItem('instructions', index)} className="btn-remove">×</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('instructions')} className="btn btn-add">+ Add Step</button>

        <button type="submit" className="btn btn-primary btn-large">Create Recipe</button>
      </form>
    </div>
  );
}
