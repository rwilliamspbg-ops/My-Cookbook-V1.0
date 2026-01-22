import RecipeForm from './RecipeForm';

export default function NewRecipePage() {
  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">Add New Recipe</h1>
            <p className="card-description">
              Manually enter a new recipe to your collection
            </p>
          </div>
        </div>

        <RecipeForm />
      </div>
    </div>
  );
}
