// Shared styles component for consistent theming across all pages
// Mobile-first responsive design with vivid aesthetics

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

      /* Button styles */
      .btn {
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        font-size: 15px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .btn-primary {
        background: white;
        color: #dc143c;
      }

      .btn-primary:hover {
        background: #dc143c;
        color: white;
        transform: translateY(-2px);
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid white;
      }

      .btn-secondary:hover {
        background: white;
        color: #dc143c;
      }

      .btn-success {
        background: #28a745;
        color: white;
      }

      .btn-success:hover {
        background: #20c997;
      }

      .btn-danger {
        background: #dc143c;
        color: white;
      }

      .btn-danger:hover {
        background: #c82333;
      }

      .btn-sm {
        padding: 8px 16px;
        font-size: 14px;
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
      }

      .form-input:focus,
      .form-textarea:focus {
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

      /* Mobile */
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
          font-size: 16px;
        }
      }
    `}</style>
  );
}
