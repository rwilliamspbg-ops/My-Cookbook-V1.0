import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function RecipeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [],
    instructions: [],
    prepTime: '',
    cookTime: '',
    servings: '',
    category: '',
  });

  useEffect(() => {
    if (id) [fetchRecipe]();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      const data = response.data;
      setRecipe(data);
      setFormData({
        title: data.title,
        description: data.description || '',
        ingredients: JSON.parse(data.ingredients),
        instructions: JSON.parse(data.instructions),
        prepTime: data.prepTime || '',
        cookTime: data.cookTime || '',
        servings: data.servings || '',
        category: data.category || '',
      });
      setLoading(false);
    } catch (_err) {
      alert('Failed to load recipe');
      router.push('/');
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/recipes/${id}`, formData);
      alert('Recipe updated successfully!');
      setEditing(false);
      fetchRecipe();
    } catch (_err) {
      alert('Failed to update recipe');
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

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="recipe-detail-header">
        <Link href="/" className="btn btn-back">← Back to Recipes</Link>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn btn-primary">
            ✏️ Edit Recipe
          </button>
        ) : (
          <div>
            <button onClick={handleSave} className="btn btn-success">Save</button>
            <button onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
          </div>
        )}
      </div>

      <div className="recipe-detail">
        {editing ? (
          <div className="recipe-form">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-title"
              placeholder="Recipe Title"
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
                placeholder="Prep Time"
              />
              <input
                type="text"
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                placeholder="Cook Time"
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
                />
                <button onClick={() => removeArrayItem('ingredients', index)} className="btn-remove">×</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('ingredients')} className="btn btn-add">+ Add Ingredient</button>

            <h3>Instructions</h3>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="array-item">
                <textarea
                  value={instruction}
                  onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  rows="2"
                />
                <button onClick={() => removeArrayItem('instructions', index)} className="btn-remove">×</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('instructions')} className="btn btn-add">+ Add Step</button>
          </div>
        ) : (
          <div className="recipe-view">
            <h1>{recipe.title}</h1>
            {recipe.description && <p className="description">{recipe.description}</p>}
            
            <div className="recipe-meta">
              {recipe.prepTime && <span>⏱️ Prep: {recipe.prepTime}</span>}
              {recipe.cookTime && <span>🔥 Cook: {recipe.cookTime}</span>}
              {recipe.servings && <span>🍽️ Servings: {recipe.servings}</span>}
            </div>

            <section className="recipe-section">
              <h2>Ingredients</h2>
              <ul>
                {JSON.parse(recipe.ingredients).map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </section>

            <section className="recipe-section">
              <h2>Instructions</h2>
              <ol>
                {JSON.parse(recipe.instructions).map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
