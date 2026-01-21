import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function RecipeCarousel({ recipes = [] }) {
  const scrollContainerRef = useRef(null);
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Group recipes by first letter
  const groupedRecipes = recipes.reduce((acc, recipe) => {
    const firstLetter = recipe.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(recipe);
    return acc;
  }, {});

  // Get all available letters plus 'ALL'
  const letters = ['ALL', ...Object.keys(groupedRecipes).sort()];

  // Filter recipes based on selected letter
  const filteredRecipes = selectedLetter === 'ALL' 
    ? recipes 
    : (groupedRecipes[selectedLetter] || []);

  // Scroll to index
  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 800; // approximate card width
      container.scrollLeft = index * cardWidth;
      setCurrentIndex(index);
    }
  };

  // Handle letter selection
  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setCurrentIndex(0);
    // Scroll container to top
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(filteredRecipes.length - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  if (filteredRecipes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No recipes found</p>
      </div>
    );
  }

  const currentRecipe = filteredRecipes[currentIndex];

  return (
    <div style={styles.container}>
      {/* Letter Selector */}
      <div style={styles.letterSelector}>
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            style={{
              ...styles.letterButton,
              ...(selectedLetter === letter ? styles.letterButtonActive : {})
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Carousel Container */}
      <div style={styles.carouselWrapper}>
        <button onClick={handlePrevious} style={styles.arrowButton}>\u2190</button>
        
        <div ref={scrollContainerRef} style={styles.carouselContainer}>
          {filteredRecipes.map((recipe) => (
            <article key={recipe.id} style={styles.recipeCard}>
              <h2>{recipe.title}</h2>
              <p style={styles.description}>
                {recipe.description || 'A delicious recipe waiting to be discovered'}
              </p>
              {(recipe.prepTime || recipe.cookTime || recipe.servings) && (
                <div style={styles.meta}>
                  {recipe.prepTime && <span>⏱️ Prep: {recipe.prepTime}</span>}
                  {recipe.cookTime && <span>• 🔥 Cook: {recipe.cookTime}</span>}
                  {recipe.servings && <span>• 🍽️ Serves: {recipe.servings}</span>}
                </div>
              )}
              <div style={styles.actions}>
                <Link href={`/recipe/${recipe.id}`} style={{...styles.button, ...styles.buttonPrimary}}>
                  📖 View
                </Link>
                <Link href={`/recipe/${recipe.id}/edit`} style={styles.button}>
                  ✍️ Edit
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <button onClick={handleNext} style={styles.arrowButton}>→</button>
      </div>

      {/* Progress Indicator */}
      <div style={styles.progress}>
        {currentIndex + 1} / {filteredRecipes.length}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
  },
  letterSelector: {
    display: 'flex',
        gap: '0.3rem',
        justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '1rem 0',
  },
  letterButton: {
    padding: '00.0.5rem 1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(55,65,81,0.5)',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '0.0.65rem',
    transition: 'all 0.2s',
  },
  letterButtonActive: {
    background: 'radial-gradient(circle at 30% 0, #a855f7, #6366f1)',
    color: '#fff',
    borderColor: '#a855f7',
  },
  carouselWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative',
  },
  carouselContainer: {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
    flex: 1,
    scrollSnapType: 'x mandatory',
    paddingBottom: '0.5rem',
    '&::-webkit-scrollbar': {
      height: '0.5rem',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255,255,255,0.05)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '0.25rem',
    },
  },
  recipeCard: {
    flex: '0 0 calc(100% - 2rem)',
    minWidth: '700px',
    background: 'radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 60%), #141022',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.06)',
    scrollSnapAlign: 'start',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  arrowButton: {
    background: 'radial-gradient(circle at 30% 0, #a855f7, #6366f1)',
    border: 'none',
    color: '#fff',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
    transition: 'transform 0.2s',
  },
  description: {
    fontSize: '0.875rem',
    color: '#ccc',
    margin: '0.5rem 0',
  },
  meta: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
    display: 'flex',
    gap: '1rem',
    margin: '0.5rem 0',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(55,65,81,0.5)',
    color: '#e5e7eb',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    display: 'inline-block',
  },
  buttonPrimary: {
    background: 'radial-gradient(circle at 30% 0, #a855f7, #6366f1)',
    color: '#fff',
  },
  progress: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#9ca3af',
  },
};
