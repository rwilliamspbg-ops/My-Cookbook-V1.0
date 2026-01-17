import { useState } from 'react';
import Link from 'next/link';
import SharedStyles from '../components/SharedStyles';
import axios from 'axios';

export default function UploadPage() {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('url');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [parsedRecipe, setParsedRecipe] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setParsedRecipe(null);

    try {
      const formData = new FormData();
      formData.append('inputType', inputMethod);

      if (inputMethod === 'url') {
        formData.append('url', urlInput);
      } else if (inputMethod === 'pdf' && pdfFile) {
        formData.append('file', pdfFile);
      } else if (inputMethod === 'text') {
        formData.append('text', textInput);
      }

      const response = await axios.post('/api/parse-recipe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setParsedRecipe(response.data.recipe);
        setMessage({ type: 'success', text: '✅ Recipe parsed successfully!' });
      } else {
        setMessage({ type: 'error', text: '❌ Failed to parse recipe' });
      }
    } } catch (error) {
      console.error('Parse error:', error);
      
      // Check if it's a 422 error with a partial recipe
      if (error.response?.status === 422 && error.response?.data?.recipe) {
        // Still set the parsed recipe so user can edit it
        setParsedRecipe(error.response.data.recipe);
        setMessage({
          type: 'error',
          text: `⚠️ ${error.response.data.error || 'Weak recipe format. Please review and edit manually.'}`
        });
      } else {
        // Other errors
        setMessage({
          type: 'error',
          text: `❌ Error: ${error.response?.data?.error || error.message}`,
        });
      }
    }
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!parsedRecipe) return;

    try {
      await axios.post('/api/recipes', parsedRecipe);
      setMessage({ type: 'success', text: '✅ Recipe saved to your cookbook!' });
      // Optionally redirect after a delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: '❌ Failed to save recipe' });
    }
  };

  return (
    <>
      <SharedStyles />
      <div className="checkerboard-bg">
        <div className="container">
          <header className="header">
            <h1>📤 Parse Recipe</h1>
            <p
              style={{
                margin: '10px 0 0 0',
                fontSize: '1.1em',
                opacity: 0.9,
              }}
            >
              Extract recipe information using AI from URLs, PDFs, or text
            </p>
          </header>

          <Link
            href="/"
            className="btn btn-secondary"
            style={{ marginBottom: '30px', display: 'inline-flex' }}
          >
            ← Back to Recipes
          </Link>

          {message && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          {!parsedRecipe && (
            <div className="card">
              <h2 className="card-title">Choose Input Method</h2>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '30px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={() => setInputMethod('url')}
                  className={`btn ${
                    inputMethod === 'url' ? 'btn-primary' : 'btn-secondary'
                  }`}
                  style={{ flex: '1', minWidth: '120px' }}
                >
                  🌐 URL
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('pdf')}
                  className={`btn ${
                    inputMethod === 'pdf' ? 'btn-primary' : 'btn-secondary'
                  }`}
                  style={{ flex: '1', minWidth: '120px' }}
                >
                  📄 PDF
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('text')}
                  className={`btn ${
                    inputMethod === 'text' ? 'btn-primary' : 'btn-secondary'
                  }`}
                  style={{ flex: '1', minWidth: '120px' }}
                >
                  📝 Text
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {inputMethod === 'url' && (
                  <div className="form-group">
                    <label className="form-label">Recipe URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://example.com/recipe"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      required
                    />
                    <p
                      style={{
                        fontSize: '0.9em',
                        color: '#666',
                        marginTop: '8px',
                      }}
                    >
                      Enter the URL of a recipe webpage
                    </p>
                  </div>
                )}

                {inputMethod === 'pdf' && (
                  <div className="form-group">
                    <label className="form-label">Upload PDF</label>
                    <input
                      type="file"
                      accept=".pdf"
                      className="form-input"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      required
                    />
                    <p
                      style={{
                        fontSize: '0.9em',
                        color: '#666',
                        marginTop: '8px',
                      }}
                    >
                      Upload a PDF file containing a recipe
                    </p>
                  </div>
                )}

                {inputMethod === 'text' && (
                  <div className="form-group">
                    <label className="form-label">Recipe Text</label>
                    <textarea
                      className="form-textarea"
                      placeholder={
                        'Paste your recipe text here...\n\nExample:\nChocolate Chip Cookies\n\nIngredients:\n- 2 cups flour\n- 1 cup sugar\n...\n\nInstructions:\n1. Preheat oven to 350°F\n2. Mix ingredients...'
                      }
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      required
                      style={{ minHeight: '250px' }}
                    />
                    <p
                      style={{
                        fontSize: '0.9em',
                        color: '#666',
                        marginTop: '8px',
                      }}
                    >
                      Paste recipe text including title, ingredients, and
                      instructions
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={loading}
                  style={{ width: '100%', marginTop: '20px' }}
                >
                  {loading ? '🔄 Parsing Recipe...' : '✨ Parse Recipe with AI'}
                </button>
              </form>
            </div>
      )}
          {parsedRecipe && (
            <div className="recipe-card">
              <h3>{parsedRecipe.title}</h3>
              
              {parsedRecipe.description && (
                <p className="recipe-description">{parsedRecipe.description}</p>
              )}

              <div className="recipe-meta">
                {parsedRecipe.prepTime && (
                  <span className="meta-item">⏱️ Prep: {parsedRecipe.prepTime} min</span>
                )}
                {parsedRecipe.cookTime && (
                  <span className="meta-item">🔥 Cook: {parsedRecipe.cookTime} min</span>
                )}
                {parsedRecipe.servings && (
                  <span className="meta-item">🍽️ Serves: {parsedRecipe.servings}</span>
                )}
                {parsedRecipe.category && (
                  <span className="meta-item">📂 {parsedRecipe.category}</span>
                )}
              </div>

              {parsedRecipe.ingredients && parsedRecipe.ingredients.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#dc143c', marginBottom: '10px' }}>🛒 Ingredients:</h4>
                  <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                    {parsedRecipe.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {parsedRecipe.instructions && parsedRecipe.instructions.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#dc143c', marginBottom: '10px' }}>👨‍🍳 Instructions:</h4>
                  <ol style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                    {parsedRecipe.instructions.map((instruction, idx) => (
                      <li key={idx} style={{ marginBottom: '10px' }}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="recipe-actions">
                <button
                  onClick={saveRecipe}
                  className="btn btn-success"
                  style={{ flex: 1 }}
                >
                  💾 Save to Cookbook
                </button>
                <button
                  onClick={() => {
                    setParsedRecipe(null);
                    setMessage(null);
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  🔄 Parse Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
