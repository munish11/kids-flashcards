import { useState, useMemo, useCallback } from 'react';
import { getAllFlashcards, getCategories } from './data/flashcards';
import { nextIndex, prevIndex, filterByCategory, shuffleFlashcards } from './utils/flashcardUtils';
import { useAutoScroll } from './hooks/useAutoScroll';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { CategorySelector } from './components/CategorySelector';
import { FlashcardViewer } from './components/FlashcardViewer';
import { PlayPauseControl } from './components/PlayPauseControl';
import type { Category } from './types';

const allFlashcards = getAllFlashcards();
const categories = getCategories();

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollKey, setScrollKey] = useState(0);

  const filteredFlashcards = useMemo(
    () => shuffleFlashcards(filterByCategory(allFlashcards, selectedCategory)),
    [selectedCategory]
  );

  const resetTimer = useCallback(() => {
    setScrollKey((k) => k + 1);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => nextIndex(i, filteredFlashcards.length));
  }, [filteredFlashcards.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => prevIndex(i, filteredFlashcards.length));
  }, [filteredFlashcards.length]);

  const handleManualNext = useCallback(() => {
    handleNext();
    resetTimer();
  }, [handleNext, resetTimer]);

  const handleManualPrev = useCallback(() => {
    handlePrev();
    resetTimer();
  }, [handlePrev, resetTimer]);

  const handleCategoryChange = useCallback((category: Category | 'All') => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    resetTimer();
  }, [resetTimer]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  // Auto-scroll: scrollKey changes force the interval to restart
  useAutoScroll(isPlaying, handleNext, 5000, scrollKey);
  useKeyboardNav(handleManualNext, handleManualPrev);

  return (
    <div className="app-container" style={styles.app}>
      <header style={styles.header}>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </header>

      <main style={styles.main}>
        <FlashcardViewer
          flashcards={filteredFlashcards}
          currentIndex={currentIndex}
          onSwipeLeft={handleManualNext}
          onSwipeRight={handleManualPrev}
          onTap={handleTogglePlay}
        />
      </main>

      <footer style={styles.footer}>
        <PlayPauseControl isPlaying={isPlaying} onToggle={handleTogglePlay} />
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    maxWidth: 960,
    margin: '0 auto',
    padding: '12px 16px',
    boxSizing: 'border-box',
  },
  header: {
    flexShrink: 0,
    paddingBottom: 8,
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
};

export default App;
