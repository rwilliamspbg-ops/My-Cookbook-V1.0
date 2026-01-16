// pages/test-debug.js - Comprehensive Test & Debug Page for PDF Parsing and Database
import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { recipes } from '../lib/schema';

export default function TestDebugPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [testResults, setTestResults] = useState({});
  const [pdfTestResult, setPdfTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all recipes from database on mount
  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setAllRecipes(data.recipes || []);
        setTestResults(prev => ({
          ...prev,
          dbConnection: '✅ Database connected',
          recipeCount: `Found ${data.recipes?.length || 0} recipes`
        }));
      } else {
        throw new Error('Failed to fetch recipes');
      }
    } catch (err) {
      setError(`Database Error: ${err.message}`);
      setTestResults(prev => ({
        ...prev,
        dbConnection: '❌ Database connection failed'
      }));
    }
  };

  // Test PDF parsing with sample text
  const testPDFParsing = async () => {
    setLoading(true);
    setPdfTestResult(null);
    setError(null);

    const sampleRecipeText = `
      Chocolate Chip Cookies
      
      A classic homemade cookie recipe that's crispy on the outside and chewy on the inside.
      
      Ingredients:
      - 2 1/4 cups all-purpose flour
      - 1 tsp baking soda
      - 1 tsp salt
      - 1 cup (2 sticks) butter, softened
      - 3/4 cup granulated sugar
      - 3/4 cup packed brown sugar
      - 2 large eggs
      - 2 tsp vanilla extract
      - 2 cups chocolate chips
      
      Instructions:
      1. Preheat oven to 375°F (190°C).
      2. Combine flour, baking soda, and salt in a bowl.
      3. Beat butter, granulated sugar, and brown sugar until creamy.
      4. Add eggs and vanilla; beat well.
      5. Gradually blend in flour mixture.
      6. Stir in chocolate chips.
      7. Drop rounded tablespoons onto ungreased cookie sheets.
      8. Bake for 9-11 minutes or until golden brown.
      9. Cool on baking sheet for 2 minutes; remove to wire rack.
      
      Prep Time: 15 minutes
      Cook Time: 11 minutes
      Servings: 48 cookies
    `;

    try {
      const formData = new FormData();
      formData.append('inputType', 'text');
      formData.append('text', sampleRecipeText);

      const response = await fetch('/api/parse-recipe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setPdfTestResult({
          status: '✅ Parsing successful',
          recipe: data.recipe,
          rawResponse: JSON.stringify(data, null, 2)
        });
        setTestResults(prev => ({
          ...prev,
          pdfParsing: '✅ PDF/Text parsing working'
        }));
      } else {
        throw new Error(data.error || 'Parse failed');
      }
    } catch (err) {
      setPdfTestResult({
        status: '❌ Parsing failed',
        error: err.message
      });
      setTestResults(prev => ({
        ...prev,
        pdfParsing: '❌ PDF/Text parsing failed'
      }));
      setError(`Parse Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test database write by adding parsed recipe
  const testDatabaseWrite = async () => {
    if (!pdfTestResult?.recipe) {
      alert('Please run PDF parsing test first!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfTestResult.recipe),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          dbWrite: `✅ Recipe added with ID: ${data.id}`
        }));
        await loadRecipes(); // Refresh the list
      } else {
        throw new Error('Failed to add recipe');
      }
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        dbWrite: '❌ Database write failed'
      }));
      setError(`Write Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-stone-900 mb-8">
          🧪 PDF Parsing & Database Test Console
        </h1>

        {/* Test Results Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(testResults).map(([key, value]) => (
              <div key={key} className="p-4 bg-stone-50 rounded border border-stone-200">
                <p className="font-medium text-stone-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-lg mt-2">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700 font-semibold">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testPDFParsing}
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⏳ Testing...' : '🔍 Test PDF/Text Parsing'}
          </button>
          
          <button
            onClick={testDatabaseWrite}
            disabled={loading || !pdfTestResult?.recipe}
            className="bg-secondary-600 hover:bg-secondary-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⏳ Writing...' : '💾 Test Database Write'}
          </button>
          
          <button
            onClick={loadRecipes}
            disabled={loading}
            className="bg-accent hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh Recipes'}
          </button>
        </div>

        {/* PDF Parse Result */}
        {pdfTestResult && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">PDF Parsing Result</h2>
            <p className="text-lg mb-4">{pdfTestResult.status}</p>
            
            {pdfTestResult.recipe && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                  <h3 className="font-bold text-xl text-blue-900 mb-2">
                    {pdfTestResult.recipe.title || 'Untitled Recipe'}
                  </h3>
                  <p className="text-stone-700">{pdfTestResult.recipe.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">📝 Ingredients</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {pdfTestResult.recipe.ingredients?.map((ing, i) => (
                        <li key={i} className="text-stone-700">{ing}</li>
                      )) || <li className="text-stone-400">No ingredients</li>}
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">👨‍🍳 Instructions</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      {pdfTestResult.recipe.instructions?.map((step, i) => (
                        <li key={i} className="text-stone-700">{step}</li>
                      )) || <li className="text-stone-400">No instructions</li>}
                    </ol>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded border border-stone-200">
                  <h4 className="font-semibold text-stone-900 mb-2">📊 Metadata</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Prep Time:</span> {pdfTestResult.recipe.prepTime || 'N/A'} min
                    </div>
                    <div>
                      <span className="font-medium">Cook Time:</span> {pdfTestResult.recipe.cookTime || 'N/A'} min
                    </div>
                    <div>
                      <span className="font-medium">Servings:</span> {pdfTestResult.recipe.servings || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {pdfTestResult.recipe.category || 'N/A'}
                    </div>
                  </div>
                </div>

                <details className="p-4 bg-stone-800 rounded text-white">
                  <summary className="cursor-pointer font-semibold">📄 Raw JSON Response</summary>
                  <pre className="mt-4 text-xs overflow-auto">{pdfTestResult.rawResponse}</pre>
                </details>
              </div>
            )}

            {pdfTestResult.error && (
              <div className="p-4 bg-red-50 rounded border border-red-200">
                <p className="text-red-700">{pdfTestResult.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Database Recipes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            📚 Database Recipes ({allRecipes.length})
          </h2>
          
          {allRecipes.length === 0 ? (
            <p className="text-stone-500 text-center py-8">
              No recipes in database. Test PDF parsing and add one!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRecipes.map((recipe) => (
                <div 
                  key={recipe.id} 
                  className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-lg text-stone-900 mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-stone-600 mb-3 line-clamp-2">
                    {recipe.description || 'No description'}
                  </p>
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>ID: {recipe.id}</span>
                    <span>{recipe.servings ? `${recipe.servings} servings` : ''}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs bg-stone-100 px-2 py-1 rounded">
                      {recipe.ingredients?.length || 0} ingredients
                    </span>
                    <span className="text-xs bg-stone-100 px-2 py-1 rounded">
                      {recipe.instructions?.length || 0} steps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-stone-800 text-white rounded-lg">
          <h3 className="font-semibold mb-2">🐛 Debug Information</h3>
          <div className="text-xs space-y-1">
            <p>• Environment: {process.env.NODE_ENV}</p>
            <p>• API Endpoints: /api/parse-recipe, /api/recipes</p>
            <p>• Database: SQLite with Drizzle ORM</p>
            <p>• PDF Parser: Tesseract.js with pdf-parse fallback</p>
            <p>• AI: OpenAI GPT-4o-mini for recipe extraction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
