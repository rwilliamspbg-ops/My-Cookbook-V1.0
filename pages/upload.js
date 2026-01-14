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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();

      if (inputMethod === 'url' && urlInput) {
        formData.append('inputType', 'url');
        formData.append('url', urlInput);
      } else if (inputMethod === 'text' && textInput) {
        formData.append('inputType', 'text');
        formData.append('text', textInput);
      } else if (inputMethod === 'pdf' && pdfFile) {
        formData.append('inputType', 'pdf');
        formData.append('file', pdfFile);
      } else {
        setMessage({ type: 'error', text: 'Please provide recipe input.' });
        setLoading(false);
        return;
      }

      // 1. Parse with OpenAI
      const parseResponse = await axios.post('/api/parse-recipe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parsed = parseResponse.data?.recipe;
      if (!parsed) {
        setMessage({ type: 'error', text: 'No recipe returned from parser.' });
        setLoading(false);
        return;
      }

      // 2. Save to DB
      await axios.post('/api/recipes', {
        title: parsed.title,
        description: parsed.description,
        ingredients: parsed.ingredients,
        instructions: parsed.instructions,
        prepTime: parsed.prepTime,
        cookTime: parsed.cookTime,
        servings: parsed.servings,
        category: parsed.category,
      });

      setMessage({ type: 'success', text: 'Recipe parsed and saved!' });
      setTimeout(() => (window.location.href = '/'), 1500);
    } catch (error) {
      console.error('Upload/parse error:', error);
      setMessage({
        type: 'error',
        text:
          error.response?.data?.error ||
          'Failed to parse and save recipe. Please try again.',
      });
    } finally {
      setLoading(false);
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
                onClick={() => setInputMethod('url')}
                className={`btn ${
                  inputMethod === 'url' ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{ flex: '1', minWidth: '120px' }}
                type="button"
              >
                🌐 URL
              </button>
              <button
                onClick={() => setInputMethod('pdf')}
                className={`btn ${
                  inputMethod === 'pdf' ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{ flex: '1', minWidth: '120px' }}
                type="button"
              >
                📄 PDF
              </button>
              <button
                onClick={() => setInputMethod('text')}
                className={`btn ${
                  inputMethod === 'text' ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{ flex: '1', minWidth: '120px' }}
                type="button"
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
                  <label c

