import { useRef, useState, useEffect, useCallback } from 'react';
import type { Flashcard } from '../types';
import { FlashcardCard } from './FlashcardCard';
import { useSwipe } from '../hooks/useSwipe';

export interface FlashcardViewerProps {
  flashcards: Flashcard[];
  currentIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap: () => void;
}

export function FlashcardViewer({
  flashcards,
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
  onTap,
}: FlashcardViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  // Reset error tracking when flashcards array changes (category switch)
  useEffect(() => {
    setErrorIds(new Set());
  }, [flashcards]);

  // Integrate swipe gestures
  useSwipe(containerRef, onSwipeLeft, onSwipeRight, onTap);

  const handleImageError = useCallback(
    (id: string) => {
      setErrorIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    },
    []
  );

  const allFailed = flashcards.length > 0 && errorIds.size >= flashcards.length;
  const currentFlashcard = flashcards[currentIndex];

  if (flashcards.length === 0) {
    return (
      <div style={styles.container} ref={containerRef} data-testid="flashcard-viewer">
        <p style={styles.emptyMessage}>No flashcards found.</p>
      </div>
    );
  }

  if (allFailed) {
    return (
      <div style={styles.container} ref={containerRef} data-testid="flashcard-viewer">
        <div style={styles.fallback} data-testid="all-failed-message">
          <span style={styles.fallbackIcon}>😕</span>
          <p style={styles.fallbackText}>
            Oops! Pictures aren't available right now. Try another category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container} ref={containerRef} data-testid="flashcard-viewer">
      {currentFlashcard && (
        <FlashcardCard
          key={currentFlashcard.id}
          flashcard={currentFlashcard}
          onImageError={() => handleImageError(currentFlashcard.id)}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    touchAction: 'pan-y',
    minHeight: '60vh',
  },
  emptyMessage: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center' as const,
  },
  fallback: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  fallbackIcon: {
    fontSize: 64,
  },
  fallbackText: {
    fontSize: 24,
    fontWeight: 600,
    color: '#555',
    textAlign: 'center' as const,
    maxWidth: 400,
  },
};
