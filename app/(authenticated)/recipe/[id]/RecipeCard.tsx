'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="card"
      style={{
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 24px rgba(139,92,246,0.3)' : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category badge */}
      {recipe.category && (
        <div 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '0.25rem 0.75rem',
            background: 'rgba(139,92,246,0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 500,
            border: '1px solid rgba(139,92,246,0.4)'
          }}
        >
          {recipe.category}
        </div>
      )}

      <div style={{ flex: 1 }}>
        <h3 
          style={{ 
            marginBottom: '0.75rem', 
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: '1.4',
            paddingRight: recipe.category ? '80px' : '0'
          }}
        >
          {recipe.title || 'Untitled Recipe'}
        </h3>
        
        {recipe.description && (
          <p
            style={{
              fontSize: '0.875rem',
              opacity: 0.75,
              marginBottom: '1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.5'
            }}
          >
            {recipe.description}
          </p>
        )}
      </div>

      {/* Recipe meta info */}
      <div 
        style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.8125rem',
          opacity: 0.65,
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {recipe.prepTime && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            ⏱️ {recipe.prepTime}
          </span>
        )}
        {recipe.cookTime && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🔥 {recipe.cookTime}
          </span>
        )}
        {recipe.servings && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🍽️ {recipe.servings}
          </span>
        )}
      </div>
    </Link>
  );
}
