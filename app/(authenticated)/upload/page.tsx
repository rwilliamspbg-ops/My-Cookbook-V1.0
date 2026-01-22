import UploadForm from './UploadForm';

export default function UploadPage() {
  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">Parse Recipe</h1>
            <p className="card-description">
              Upload a PDF, paste a URL, or enter recipe text to automatically extract recipe details
            </p>
          </div>
        </div>

        <UploadForm />
      </div>
    </div>
  );
}
