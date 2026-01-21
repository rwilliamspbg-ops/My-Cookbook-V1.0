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

  // Fetch recipe by ID
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
    ingredients: initialValues?.ingredients || [""],
    instructions: initialValues?.instructions || [""],
    prepTime: initialValues?.prepTime || "",
    cookTime: initialValues?.cookTime || "",
    servings: initialValues?.servings || "",
    category: initialValues?.category || "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        await axios.put(`/api/recipes/${initialValues.id}`, formData);
      } else {
        await axios.post("/api/recipes", formData);
      }
      router.push("/");
    } catch (err) {
      console.error("Failed", err);
    }
  };

  // TODO: reuse the same JSX structure from pages/recipe/new.js
  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      {/* minimal example – replace with your full form from new.js */}
      <div className="form-group">
        <label>Title</label>
        <input
          value={formData.title}
          onChange={handleChange("title")}
          required
        />
      </div>
      <button type="submit" className="btn-pill primary">
        Save changes
      </button>
    </form>
  );
}


