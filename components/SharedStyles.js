// Shared styles component for consistent theming across all pages
// Mobile-first responsive design with vivid aesthetics and enhanced button styles

export default function SharedStyles() {
  return (
    <style jsx global>{`
      /* Global resets */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Checkerboard background */
      .checkerboard-bg {
        min-height: 100vh;
        background-image: 
          linear-gradient(45deg, #dc143c 25%, transparent 25%),
          linear-gradient(-45deg, #dc143c 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #dc143c 75%),
          linear-gradient(-45deg, transparent 75%, #dc143c 75%);
        background-size: 60px 60px;
        background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
        background-color: #ffffff;
        padding: 15px;
      }

      .container {
        max-width: 1400px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.97);
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px 20px;
        background: linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%);
        border-radius: 10px;
        color: white;
        box-shadow: 0 5px 15px rgba(220, 20, 60, 0.3);
      }

      .header h1 {
        margin: 0 0 15px 0;
        font-size: clamp(1.8em, 5vw, 3em);
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }

      .header-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
      }

      /* Enhanced Button Styles with Modern Effects */
      .btn {
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
        cursor: pointer;
        font-size: 15px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
        text-transform: none;
        letter-spacing: 0.3px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }

      .btn:hover::before {
        width: 300px;
        height: 300px;
      }

      .btn:active {
        transform: scale(0.95);
      }

      /* Primary Button - White with Red Text */
      .btn-primary {
        background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
        color: #dc143c;
        border: 2px solid #dc143c;
      }

      .btn-primary:hover {
        background: linear-gradient(135deg, #dc143c 0%, #c41230 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(220, 20, 60, 0.4);
      }

      /* Secondary Button - Transparent with White Border */
      .btn-secondary {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: 2px solid white;
        backdrop-filter: blur(10px);
      }

      .btn-secondary:hover {
        background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
        color: #dc143c;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(255, 255, 255, 0.5);
      }

      /* Success Button - Green */
      .btn-success {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        border: 2px solid transparent;
      }

      .btn-success:hover {
        background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(32, 201, 151, 0.4);
      }

      /* Danger Button - Red */
      .btn-danger {
        background: linear-gradient(135deg, #dc143c 0%, #a00000 100%);
        color: white;
        border: 2px solid transparent;
      }

      .btn-danger:hover {
        background: linear-gradient(135deg, #c82333 0%, #8b0000 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(220, 20, 60, 0.5);
      }

      /* Warning Button - Orange/Yellow */
      .btn-warning {
        background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
        color: #333;
        border: 2px solid transparent;
        font-weight: 700;
      }

      .btn-warning:hover {
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(255, 193, 7, 0.4);
      }

      /* Info Button - Blue */
      .btn-info {
        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
        color: white;
        border: 2px solid transparent;
      }

      .btn-info:hover {
        background: linear-gradient(135deg, #138496 0%, #0f6674 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(23, 162, 184, 0.4);
      }

      /* Small Button */
      .btn-sm {
        padding: 8px 16px;
        font-size: 14px;
      }

      /* Large Button */
      .btn-lg {
        padding: 16px 32px;
        font-size: 18px;
      }

      /* Disabled Button */
      .btn:disabled,
      .btn.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }

      .btn:disabled:hover,
      .btn.disabled:hover {
        transform: none !important;
      }

      /* Form elements */
      .form-group {
        margin-bottom: 20px;
      }

      .form-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
      }

      .form-input,
      .form-textarea,
      .form-select {
        width: 100%;
        padding: 12px 15px;
        font-size: 15px;
        border: 2px solid #ddd;
        border-radius: 8px;
        outline: none;
        transition: all 0.3s ease;
        font-family: inherit;
      }

      .form-input:focus,
      .form-textarea:focus,
      .form-select:focus {
        border-color: #dc143c;
        box-shadow: 0 0 15px rgba(220, 20, 60, 0.2);
      }

      .form-textarea {
        min-height: 120px;
        resize: vertical;
      }

      /* Card */
      .card {
        background: white;
        border: 3px solid #dc143c;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 5px 15px rgba(220, 20, 60, 0.2);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(90deg, #dc143c, #ff6b6b, #dc143c);
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(220, 20, 60, 0.3);
      }

      .card-title {
        margin: 0 0 15px 0;
        color: #dc143c;
        font-size: 1.6em;
        border-bottom: 2px solid #dc143c;
        padding-bottom: 10px;
      }

      /* Loading Spinner */
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #dc143c;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 20px auto;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .checkerboard-bg {
          padding: 10px;
          background-size: 40px 40px;
        }

        .container {
          padding: 15px;
        }

        .header-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
          justify-content: center;
        }

        .form-input,
        .form-textarea {
          font-size: 16px; /* Prevents zoom on iOS */
        }
      }

      /* Tablet Responsive */
      @media (min-width: 769px) and (max-width: 1024px) {
        .container {
          padding: 20px;
        }
      }
    `}</style>
  );
}
