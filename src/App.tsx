import { useState, useMemo, useCallback } from 'react';
import { getAllFlashcards, getCategories } from './data/flashcards';
import { nextIndex, prevIndex, filterByCategory, shuffleFlashcards } from './utils/flashcardUtils';
import { useAutoScroll } from './hooks/useAutoScroll';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { CategorySelector } from './components/CategorySelector';
import { FlashcardViewer } from './components/FlashcardViewer';
import { PlayPauseControl } from './components/PlayPauseControl';
import { QuizToggleButton } from './components/QuizToggleButton';
import { QuizView } from './components/QuizView';
import type { Category } from './types';

const allFlashcards = getAllFlashcards();
const categories = getCategories();

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollKey, setScrollKey] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);

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

  const handleToggleQuiz = useCallback(() => {
    setIsQuizMode((prev) => !prev);
  }, []);

  // Auto-scroll: scrollKey changes force the interval to restart
  // Disable auto-scroll when quiz mode is active
  useAutoScroll(isPlaying && !isQuizMode, handleNext, 5000, scrollKey);
  useKeyboardNav(
    isQuizMode ? () => {} : handleManualNext,
    isQuizMode ? () => {} : handleManualPrev
  );

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
        {isQuizMode ? (
          <QuizView
            filteredFlashcards={filteredFlashcards}
            allFlashcards={allFlashcards}
          />
        ) : (
          <FlashcardViewer
            flashcards={filteredFlashcards}
            currentIndex={currentIndex}
            onSwipeLeft={handleManualNext}
            onSwipeRight={handleManualPrev}
            onTap={handleTogglePlay}
          />
        )}
      </main>

      <footer style={styles.footer}>
        {!isQuizMode && (
          <PlayPauseControl isPlaying={isPlaying} onToggle={handleTogglePlay} />
        )}
        <QuizToggleButton isQuizMode={isQuizMode} onToggle={handleToggleQuiz} />
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
    gap: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
};

export default App;
