import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "../../../components/Layout";
import RecipeForm from "../../../components/RecipeForm"; // adjust path to your form

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

  if (loading) return <div className="loading-container"><p>Loading recipe...</p></div>;
  if (error) return <div className="error-container"><p>Error: {error}</p></div>;
  if (!recipe) return <div className="error-container"><p>Recipe not found</p></div>;

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
