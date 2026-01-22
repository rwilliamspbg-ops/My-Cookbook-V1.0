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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('type', uploadType);

      if (uploadType === 'pdf' && file) {
        formData.append('file', file);
      } else if (uploadType === 'url') {
        formData.append('url', url);
      } else if (uploadType === 'text') {
        formData.append('text', text);
      }

      const res = await fetch('/api/parse-recipe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse recipe');
      }

      // Redirect to the new recipe
      if (data.recipeId) {
        router.push(`/recipe/${data.recipeId}`);
      } else {
        router.push('/recipes');
      }
    } catch (err: any) {
      console.error('Parse error:', err);
      setError(err.message || 'Failed to parse recipe');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Upload Type Selector */}
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Upload Method
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          <label htmlFor="file" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
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
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
          />
        </div>
      )}

      {/* URL Input */}
      {uploadType === 'url' && (
        <div>
          <label htmlFor="url" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Recipe URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/recipe"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
          />
        </div>
      )}

      {/* Text Input */}
      {uploadType === 'text' && (
        <div>
          <label htmlFor="text" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Paste Recipe Text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your recipe text here..."
            required
            rows={10}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            borderRadius: '0.5rem',
            color: '#fca5a5',
          }}
        >
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        {isProcessing ? 'Processing...' : '🪄 Parse Recipe'}
      </button>
    </form>
  );
}
