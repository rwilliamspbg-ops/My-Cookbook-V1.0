'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/recipes');
        router.refresh();
      } else {
        alert('Failed to delete recipe');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn btn-primary"
          style={{ background: '#dc2626' }}
        >
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="btn btn-secondary"
      style={{ color: '#dc2626' }}
    >
      🗑️ Delete
    </button>
  );
}
