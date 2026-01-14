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
    // ... your full handleSubmit from previous message ...
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
        </div>
      </div>
    </>
  );
}

