import { useState } from 'react';
import Link from 'next/link';
import SharedStyles from '../components/SharedStyles';
import axios from 'axios';

export default function UploadPage() {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('url'); // 'url' | 'text' | 'pdf'
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

      if (inputMethod === 'pdf') {
        if (!pdfFile) {
          setMessage({ type: 'error', text: 'Please select a PDF file.' });
          setLoading(false);
          return;
        }
        formData.append('file', pdfFile); // must be "file" to match parse-recipe.js
      } else if (inputMethod === 'url') {
        formData.append('url', urlInput);
      } else if (inputMethod === 'text') {
        formData.append('text', textInput);
      }

      const response = await axios.post('/api/parse-recipe', formData);

      if (response.data.success) {
        setParsedRecipe(response.data.recipe);
        setMessage({ type: 'success', text: '✅ Recipe parsed successfully!' });
      } else {
        setMessage({ type: 'error', text: '❌ Failed to parse recipe' });
      }
    } catch (error) {
  console.error('Parse error:', error);

  if (axios.isAxiosError(error)) {
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    setMessage({
      type: 'error',
      text:
        '❌ Error: ' +
        (error.response?.data?.error || error.message),
    });
  } else {
    setMessage({
      type: 'error',
      text: '❌ Unexpected error while parsing recipe.',
    });
  }
} finally {
  setLoading(false);
}

  };

  const saveRecipe = async () => {
    if (!parsedRecipe) return;

    try {
      await axios.post('/api/recipes', {
        title: parsedRecipe.title || 'Untitled Recipe',
        description: parsedRecipe.description || '',
        ingredients: (parsedRecipe.ingredients || []).join('\n'),
        prep_time: parsedRecipe.prepTime ?? null,
        cook_time: parsedRecipe.cookTime ?? null,
        imageUrl: null,
      });

      setMessage({
        type: 'success',
        text: '✅ Recipe saved to your cookbook!',
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      console.error('Save error:', err);
      setMessage({
        type: 'error',
        text:
          '❌ Failed to save recipe: ' +
          (err.response?.data?.error || err.message),
      });
    }
  };

  return (
    <>
      <SharedStyles />

      <div className="page-container">
        <header className="page-header">
          <h1>Upload / Parse Recipe</h1>
          <Link href="/" className="back-link">
            ← Back to Recipes
          </Link>
        </header>

        <main className="page-content">
          <section className="card">
            <h2>1. Choose Input Method</h2>

            <div className="input-methods">
              <button
                type="button"
                className={inputMethod === 'url' ? 'active' : ''}
                onClick={() => setInputMethod('url')}
              >
                URL
              </button>
              <button
                type="button"
                className={inputMethod === 'text' ? 'active' : ''}
                onClick={() => setInputMethod('text')}
              >
                Raw Text
              </button>
              <button
                type="button"
                className={inputMethod === 'pdf' ? 'active' : ''}
                onClick={() => setInputMethod('pdf')}
              >
                PDF
              </button>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
              {inputMethod === 'url' && (
                <div className="form-group">
                  <label htmlFor="urlInput">Recipe URL</label>
                  <input
                    id="urlInput"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/your-recipe"
                    required
                  />
                </div>
              )}

              {inputMethod === 'text' && (
                <div className="form-group">
                  <label htmlFor="textInput">
                    Paste Recipe Text (ingredients + steps)
                  </label>
                  <textarea
                    id="textInput"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={8}
                    placeholder="Paste the recipe here..."
                    required
                  />
                </div>
              )}

              {inputMethod === 'pdf' && (
                <div className="form-group">
                  <label htmlFor="pdfInput">Upload PDF (max 10MB)</label>
                  <input
                    id="pdfInput"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
              )}

              <button type="submit" disabled={loading}>
                {loading ? 'Parsing…' : 'Parse Recipe'}
              </button>
            </form>

            {message && (
              <div
                className={`alert ${
                  message.type === 'error' ? 'alert-error' : 'alert-success'
                }`}
              >
                {message.text}
              </div>
            )}
          </section>

          {parsedRecipe && (
            <section className="card">
              <h2>2. Parsed Recipe (Review & Save)</h2>

              <div className="parsed-recipe">
                <h3>{parsedRecipe.title || 'Untitled Recipe'}</h3>
                {parsedRecipe.description && (
                  <p className="description">{parsedRecipe.description}</p>
                )}

                <div className="meta">
                  {parsedRecipe.prepTime != null && (
                    <span>Prep: {parsedRecipe.prepTime} min</span>
                  )}
                  {parsedRecipe.cookTime != null && (
                    <span>Cook: {parsedRecipe.cookTime} min</span>
                  )}
                  {parsedRecipe.servings != null && (
                    <span>Servings: {parsedRecipe.servings}</span>
                  )}
                </div>

                <div className="columns">
                  <div>
                    <h4>Ingredients</h4>
                    <ul>
                      {(parsedRecipe.ingredients || []).map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Instructions</h4>
                    <ol>
                      {(parsedRecipe.instructions || []).map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <button onClick={saveRecipe}>Save to My Cookbook</button>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}

