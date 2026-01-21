import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "../../../components/Layout";
import axios from "axios";

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) throw new Error("Recipe not found");
        const data = await res.json();
        setRecipe(data.recipe);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading)
    return (
      <div className="loading-container">
        <p>Loading recipe...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  if (!recipe)
    return (
      <div className="error-container">
        <p>Recipe not found</p>
      </div>
    );

  return (
    <>
      <Head>
        <title>Edit {recipe.title} - My Cookbook</title>
      </Head>
      <Layout>
        <RecipeForm mode="edit" initialValues={recipe} />
      </Layout>
    </>
  );
}

// Inline form – adapted from new.js
function RecipeForm({ mode = "create", initialValues }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    ingredients: Array.isArray(initialValues?.ingredients)
      ? initialValues.ingredients
      : [""],
    instructions: Array.isArray(initialValues?.instructions)
      ? initialValues.instructions
      : [""],
    prepTimeMinutes: initialValues?.prepTimeMinutes || "",
    cookTimeMinutes: initialValues?.cookTimeMinutes || "",
    servings: initialValues?.servings || "",
    category: initialValues?.category || "",
  });

  const handleFieldChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleArrayChange = (field, index) => (e) => {
    setFormData((prev) => {
      const next = [...prev[field]];
      next[index] = e.target.value;
      return { ...prev, [field]: next };
    });
  };

  const addArrayItem = (field) => () => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => () => {
    setFormData((prev) => {
      const next = [...prev[field]];
      next.splice(index, 1);
      return { ...prev, [field]: next.length ? next : [""] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        await axios.put(`/api/recipes/${initialValues.id}`, formData);
      } else {
        await axios.post("/api/recipes", formData);
      }
      router.push(`/recipe/${initialValues.id}`);
    } catch (err) {
      console.error("Failed", err);
    }
  };

  const handleCancel = () => {
    router.push(`/recipe/${initialValues.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      {/* Title */}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={formData.title}
          onChange={handleFieldChange("title")}
          required
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleFieldChange("description")}
        />
      </div>

      {/* Ingredients */}
      <div className="form-group">
        <label>Ingredients</label>
        {formData.ingredients.map((val, idx) => (
          <div key={idx} className="form-array-row">
            <input
              value={val}
              onChange={handleArrayChange("ingredients", idx)}
            />
            <button
              type="button"
              className="btn-pill"
              onClick={removeArrayItem("ingredients", idx)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-pill"
          onClick={addArrayItem("ingredients")}
        >
          + Add ingredient
        </button>
      </div>

      {/* Instructions */}
      <div className="form-group">
        <label>Instructions</label>
        {formData.instructions.map((val, idx) => (
          <div key={idx} className="form-array-row">
            <textarea
              value={val}
              onChange={handleArrayChange("instructions", idx)}
            />
            <button
              type="button"
              className="btn-pill"
              onClick={removeArrayItem("instructions", idx)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-pill"
          onClick={addArrayItem("instructions")}
        >
          + Add step
        </button>
      </div>

      {/* Meta fields */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="prepTimeMinutes">Prep time (min)</label>
          <input
            id="prepTimeMinutes"
            type="number"
            value={formData.prepTimeMinutes}
            onChange={handleFieldChange("prepTimeMinutes")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cookTimeMinutes">Cook time (min)</label>
          <input
            id="cookTimeMinutes"
            type="number"
            value={formData.cookTimeMinutes}
            onChange={handleFieldChange("cookTimeMinutes")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="servings">Servings</label>
          <input
            id="servings"
            type="number"
            value={formData.servings}
            onChange={handleFieldChange("servings")}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          value={formData.category}
          onChange={handleFieldChange("category")}
        />
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="submit" className="btn-pill primary">
          Save changes
        </button>
        <button
          type="button"
          className="btn-pill no-print"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}



