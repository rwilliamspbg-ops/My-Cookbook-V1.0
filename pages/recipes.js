import Layout from '../components/Layout';
import RecipeCarousel from '../components/RecipeCarousel';

export async function getServerSideProps({ req }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    `http://${req.headers.host || 'localhost:3000'}`;

  const res = await fetch(`${baseUrl}/api/recipes`);
  let recipes = [];
  try {
    const data = await res.json();
    recipes = Array.isArray(data) ? data : [];
  } catch {
    recipes = [];
  }

  return {
    props: {
      recipes,
    },
  };
}

export default function RecipesPage({ recipes }) {
  return (
    <Layout>
      <main className="page-container">
        <header className="page-header">
          <div>
            <h1>Recipes</h1>
            <p>Browse and edit your saved recipes.</p>
          </div>
        </header>

        <section className="card">
          <RecipeCarousel recipes={recipes} />
        </section>
      </main>
    </Layout>
  );
}

