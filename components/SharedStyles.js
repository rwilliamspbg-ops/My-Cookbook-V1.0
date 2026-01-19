// components/SharedStyles.js
export default function SharedStyles() {
  return (
    <style jsx global>{`
      .page-container {
        max-width: 960px;
        margin: 0 auto;
        padding: 2rem 1rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          sans-serif;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .page-header h1 {
        font-size: 1.8rem;
        margin: 0;
      }
      .back-link {
        color: #2563eb;
        text-decoration: none;
      }
      .back-link:hover {
        text-decoration: underline;
      }
      .page-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .card {
        background: #ffffff;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }
      .input-methods {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .input-methods button {
        flex: 1;
        padding: 0.5rem 0.75rem;
        border-radius: 999px;
        border: 1px solid #e5e7eb;
        background: #f9fafb;
        cursor: pointer;
      }
      .input-methods button.active {
        background: #2563eb;
        color: #ffffff;
        border-color: #2563eb;
      }
      .upload-form .form-group {
        margin-bottom: 1rem;
      }
      .upload-form label {
        display: block;
        font-weight: 500;
        margin-bottom: 0.25rem;
      }
      .upload-form input,
      .upload-form textarea {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid #d1d5db;
        font-size: 0.95rem;
      }
      .upload-form button {
        margin-top: 0.5rem;
        padding: 0.6rem 1.2rem;
        border-radius: 999px;
        border: none;
        background: #16a34a;
        color: #ffffff;
        font-weight: 500;
        cursor: pointer;
      }
      .upload-form button[disabled] {
        opacity: 0.7;
        cursor: default;
      }
      .alert {
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
      }
      .alert-success {
        background: #ecfdf5;
        color: #166534;
        border: 1px solid #bbf7d0;
      }
      .alert-error {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }
      .parsed-recipe h3 {
        margin-top: 0;
        margin-bottom: 0.25rem;
      }
      .parsed-recipe .description {
        margin-bottom: 0.5rem;
        color: #4b5563;
      }
      .parsed-recipe .meta {
        display: flex;
        gap: 0.75rem;
        font-size: 0.85rem;
        color: #6b7280;
        margin-bottom: 0.75rem;
      }
      .parsed-recipe .columns {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.25rem;
        margin-bottom: 1rem;
      }
      .parsed-recipe ul,
      .parsed-recipe ol {
        margin: 0;
        padding-left: 1.25rem;
      }
      .parsed-recipe button {
        padding: 0.6rem 1.2rem;
        border-radius: 999px;
        border: none;
        background: #2563eb;
        color: #ffffff;
        font-weight: 500;
        cursor: pointer;
      }
    `}</style>
  );
}

