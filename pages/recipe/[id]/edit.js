// pages/recipe/[id]/edit.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes?id=${id}`);
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error("Failed to load recipe", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/recipes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });

      if (!res.ok) throw new Error("Failed to update recipe");
      router.push("/"); // or `/recipe/${id}` if you have a detail page
    } catch (err) {
      console.error(err);
      alert("Error saving recipe");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Edit Recipe</h1>
      <form onSubmit={handleSave}>
        <div>
          <label>Title</label>
          <input
            name="title"
            value={recipe.title || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={recipe.description || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Ingredients</label>
          <textarea
            name="ingredients"
            value={recipe.ingredients || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Instructions</label>
          <textarea
            name="instructions"
            value={recipe.instructions || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </main>
  );
}
