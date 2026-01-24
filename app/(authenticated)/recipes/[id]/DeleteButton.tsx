'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  recipeId: number | string;
}

export default function DeleteButton({ recipeId }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // 1. Confirmation dialog
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      // 2. Call your API route to handle the deletion
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 3. Redirect to the main recipes list on success
        router.push('/recipes');
        router.refresh(); // Refresh the list to show it's gone
      } else {
        const errorData = await response.json();
        alert(`Failed to delete recipe: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while trying to delete the recipe.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      style={{
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        padding: '0.6rem 1.2rem',
        borderRadius: '6px',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'opacity 0.2s ease',
        opacity: isDeleting ? 0.7 : 1,
      }}
    >
      {isDeleting ? 'Deleting...' : '🗑️ Delete Recipe'}
    </button>
  );
}
