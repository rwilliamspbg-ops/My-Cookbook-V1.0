export default function SharedStyles() {
  return (
    <style jsx global>{`
      :root {
        --primary: #8b5cf6;
        --primary-hover: #7c3aed;
        --primary-active: #6d28d9;
        --primary-light: #ede9fe;
        --success: #16a34a;
        --success-light: #ecfdf5;
        --warning: #ea580c;
        --warning-light: #fef3c7;
        --error: #dc2626;
        --error-light: #fef2f2;
        --gray-50: #0b1020;
        --gray-100: #111827;
        --gray-200: #1f2937;
        --gray-300: #374151;
        --gray-400: #6b7280;
        --gray-500: #9ca3af;
        --gray-600: #d1d5db;
        --gray-700: #e5e7eb;
        --gray-800: #f3f4f6;
        --gray-900: #f9fafb;
        --white: #ffffff;
        --space-1: 0.25rem;
        --space-2: 0.5rem;
        --space-3: 0.75rem;
        --space-4: 1rem;
        --space-6: 1.5rem;
        --space-8: 2rem;
        --space-12: 3rem;
        --space-16: 4rem;
        --text-sm: 0.875rem;
        --text-base: 1rem;
        --text-lg: 1.125rem;
        --text-xl: 1.25rem;
        --text-2xl: 1.5rem;
        --text-3xl: 1.875rem;
        --text-4xl: 2.25rem;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
        --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
        --radius-xl: 1rem;
        --radius-full: 9999px;
        --duration-150: 150ms;
        --duration-200: 200ms;
        --duration-300: 300ms;
        --ease: cubic-bezier(0.4, 0, 0.2, 1);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
          sans-serif;
        font-size: var(--text-base);
        line-height: 1.5;
        color: var(--gray-900);
        background-color: #050816; /* matches AppLayout root bg */
      }
      
      /* ==================== GLOBAL STYLES ==================== */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      html {
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        font-size: var(--text-base);
        line-height: 1.5;
        color: var(--gray-900);
        background-color: var(--gray-50);
      }
      
      /* ==================== TYPOGRAPHY ==================== */
      h1 {
        font-size: var(--text-4xl);
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: var(--space-6);
        color: var(--gray-900);
      }
      
      h2 {
        font-size: var(--text-3xl);
        font-weight: 700;
        line-height: 1.3;
        margin-bottom: var(--space-4);
        color: var(--gray-900);
      }
      
      h3 {
        font-size: var(--text-2xl);
        font-weight: 600;
        line-height: 1.4;
        margin-bottom: var(--space-3);
        color: var(--gray-900);
      }
      
      h4, h5, h6 {
        font-weight: 600;
        margin-bottom: var(--space-2);
        color: var(--gray-800);
      }
      
      h4 { font-size: var(--text-xl); }
      h5 { font-size: var(--text-lg); }
      h6 { font-size: var(--text-base); }
      
      p {
        margin-bottom: var(--space-4);
        line-height: 1.6;
        color: var(--gray-600);
      }
      
      a {
        color: var(--primary);
        text-decoration: none;
        transition: color var(--duration-150) var(--ease);
      }
      
      a:hover {
        color: var(--primary-hover);
        text-decoration: underline;
      }
      
      /* ==================== CONTAINERS ==================== */
      .page-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: var(--space-4);
        width: 100%;
      }
      
      @media (min-width: 768px) {
        .page-container {
          padding: var(--space-8);
        }
      }
      
      .page-header {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
        margin-bottom: var(--space-12);
      }
      
      @media (min-width: 768px) {
        .page-header {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }
      
      .page-header h1 {
        margin-bottom: 0;
      }
      
      .page-header-actions {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        width: 100%;
      }
      
      @media (min-width: 640px) {
        .page-header-actions {
          flex-direction: row;
          width: auto;
        }
      }
      
      /* ==================== CARDS ==================== */
      .card {
        background: var(--white);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--gray-200);
        transition: all var(--duration-200) var(--ease);
      }
      
      .card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
        border-color: var(--gray-300);
      }
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
        padding-bottom: var(--space-4);
        border-bottom: 1px solid var(--gray-200);
      }
      
      .card-title {
        font-size: var(--text-xl);
        font-weight: 600;
        color: var(--gray-900);
        margin: 0;
      }
      
      .card-description {
        font-size: var(--text-sm);
        color: var(--gray-600);
        margin-top: var(--space-2);
      }
      
      .card-footer {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        margin-top: var(--space-6);
        padding-top: var(--space-6);
        border-top: 1px solid var(--gray-200);
      }
      
      @media (min-width: 640px) {
        .card-footer {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }
      
      /* ==================== BUTTONS ==================== */
      button, .btn, [role="button"] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-lg);
        border: 2px solid transparent;
        font-family: inherit;
        font-size: var(--text-base);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--duration-150) var(--ease);
        white-space: nowrap;
      }
      
      button:disabled, .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      .btn-sm {
        padding: var(--space-1) var(--space-3);
        font-size: var(--text-sm);
      }
      
      .btn-lg {
        padding: var(--space-3) var(--space-6);
        font-size: var(--text-lg);
      }
      
      .btn-full {
        width: 100%;
      }
      
      .btn-primary, button.btn-primary {
        background-color: var(--primary);
        color: var(--white);
        border-color: var(--primary);
      }
      
      .btn-primary:hover, button.btn-primary:hover {
        background-color: var(--primary-hover);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
      }
      
      .btn-secondary, button.btn-secondary {
        background-color: var(--gray-100);
        color: var(--gray-900);
        border-color: var(--gray-300);
      }
      
      .btn-secondary:hover, button.btn-secondary:hover {
        background-color: var(--gray-200);
        border-color: var(--gray-400);
      }
      
      .btn-ghost, button.btn-ghost {
        background-color: transparent;
        color: var(--primary);
        border-color: var(--primary);
      }
      
      .btn-ghost:hover, button.btn-ghost:hover {
        background-color: var(--primary-light);
      }
      
      .btn-success, button.btn-success {
        background-color: var(--success);
        color: var(--white);
        border-color: var(--success);
      }
      
      .btn-success:hover, button.btn-success:hover {
        background-color: #15803d;
      }
      
      .btn-danger, button.btn-danger {
        background-color: var(--error);
        color: var(--white);
        border-color: var(--error);
      }
      
      .btn-danger:hover, button.btn-danger:hover {
        background-color: #b91c1c;
      }
      
      /* ==================== FORMS ==================== */
      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-bottom: var(--space-6);
      }
      
      label {
        font-weight: 500;
        color: var(--gray-700);
        font-size: var(--text-sm);
      }
      
      input, textarea, select {
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius-md);
        border: 1px solid var(--gray-300);
        font-family: inherit;
        font-size: var(--text-base);
        transition: border-color var(--duration-150) var(--ease), box-shadow var(--duration-150) var(--ease);
      }
      
      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-light);
      }
      
      textarea {
        resize: vertical;
        min-height: 100px;
      }
      
      /* ==================== ALERTS ==================== */
      .alert {
        padding: var(--space-4);
        border-radius: var(--radius-lg);
        margin-bottom: var(--space-4);
        border-left: 4px solid transparent;
      }
      
      .alert-success {
        background-color: var(--success-light);
        color: #166534;
        border-color: var(--success);
      }
      
      .alert-error {
        background-color: var(--error-light);
        color: #991b1b;
        border-color: var(--error);
      }
      
      .alert-warning {
        background-color: var(--warning-light);
        color: #92400e;
        border-color: var(--warning);
      }
      
      /* ==================== GRIDS ==================== */
      .grid {
        display: grid;
        gap: var(--space-6);
      }
      
      .grid-2 {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
      
      @media (min-width: 1024px) {
        .grid-2 {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      .grid-3 {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
      
      @media (min-width: 1024px) {
        .grid-3 {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      /* ==================== UTILITIES ==================== */
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .text-left { text-align: left; }
      
      .mt-2 { margin-top: var(--space-2); }
      .mt-4 { margin-top: var(--space-4); }
      .mt-6 { margin-top: var(--space-6); }
      
      .mb-2 { margin-bottom: var(--space-2); }
      .mb-4 { margin-bottom: var(--space-4); }
      .mb-6 { margin-bottom: var(--space-6); }
      
      .hidden { display: none; }
      
      @media (max-width: 767px) {
        .hidden-mobile { display: none; }
      }
      
      @media (min-width: 768px) {
        .hidden-tablet { display: none; }
      }
    `}</style>
  );
}

