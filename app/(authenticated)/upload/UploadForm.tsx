'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const router = useRouter();
  const [uploadType, setUploadType] = useState<'pdf' | 'url' | 'text'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    setProgress('Uploading...');

    try {
      const formData = new FormData();
      formData.append('inputType', uploadType); // Changed from 'type' to 'inputType'

      if (uploadType === 'pdf' && file) {
        formData.append('file', file);
        setProgress('Processing PDF...');
      } else if (uploadType === 'url') {
        formData.append('url', url);
        setProgress('Fetching URL...');
      } else if (uploadType === 'text') {
        formData.append('text', text);
        setProgress('Parsing text...');
      } else {
        throw new Error('Please select a valid input');
      }

      const res = await fetch('/api/parse-recipe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to parse recipe');
      }

      setProgress('Success! Redirecting...');
      
      // Redirect to the new recipe
      if (data.recipeId || data.id) {
        router.push(`/recipe/${data.recipeId || data.id}`);
      } else {
        router.push('/recipes');
      }
      router.refresh();
    } catch (err: any) {
      console.error('Parse error:', err);
      setError(err.message || 'Failed to parse recipe. Please try again.');
      setIsProcessing(false);
      setProgress('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Upload Type Selector */}
      <div>
        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
          Upload Method
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setUploadType('pdf')}
            className={uploadType === 'pdf' ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            📄 PDF
          </button>
          <button
            type="button"
            onClick={() => setUploadType('url')}
            className={uploadType === 'url' ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            🔗 URL
          </button>
          <button
            type="button"
            onClick={() => setUploadType('text')}
            className={uploadType === 'text' ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            📝 Text
          </button>
        </div>
      </div>

      {/* PDF Upload */}
      {uploadType === 'pdf' && (
        <div>
          <label htmlFor="file" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
            Select PDF File
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            style={{
              display: 'block',
              width: '100%',
              padding: '0.875rem',
              background: 'rgba(30,27,48,0.6)',
              border: '2px dashed rgba(139,92,246,0.3)',
              borderRadius: '0.75rem',
              color: '#f3f4f6',
              cursor: 'pointer',
            }}
          />
          {file && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.9375rem', opacity: 0.8 }}>
              ✅ Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
      )}

      {/* URL Input */}
      {uploadType === 'url' && (
        <div>
          <label htmlFor="url" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
            Recipe URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/recipe"
            required
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
            Enter the full URL of a recipe from any website
          </p>
        </div>
      )}

      {/* Text Input */}
      {uploadType === 'text' && (
        <div>
          <label htmlFor="text" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
            Paste Recipe Text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your recipe text here... Include title, ingredients, and instructions."
            required
            rows={12}
            style={{
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
            Paste the full recipe text including ingredients and instructions
          </p>
        </div>
      )}

      {/* Progress Message */}
      {progress && !error && (
        <div
          style={{
            padding: '1.25rem',
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.4)',
            borderRadius: '0.75rem',
            color: '#e9d5ff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '3px solid rgba(139,92,246,0.3)',
              borderTop: '3px solid #a855f7',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          {progress}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <strong>❌ Error:</strong> {error}
          <details style={{ marginTop: '0.75rem', fontSize: '0.875rem', opacity: 0.9 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
              Troubleshooting tips
            </summary>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>For PDFs: Make sure the file is a valid recipe PDF (not scanned images)</li>
              <li>For URLs: Ensure the URL is publicly accessible</li>
              <li>For Text: Include both ingredients and instructions</li>
              <li>Check the browser console for more details</li>
            </ul>
          </details>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="btn btn-primary"
        style={{ width: '100%', fontSize: '1.0625rem', padding: '1rem' }}
      >
        {isProcessing ? (
          <>
            <span style={{ marginRight: '0.5rem' }}>⏳</span>
            {progress || 'Processing...'}
          </>
        ) : (
          <>
            <span style={{ marginRight: '0.5rem' }}>🪄</span>
            Parse Recipe
          </>
        )}
      </button>
    </form>
  );
}

// Add keyframe animation for spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
