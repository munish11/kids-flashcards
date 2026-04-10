import { useState } from 'react';
import type { Flashcard } from '../types';
import { assetPath } from '../utils/assetPath';

export interface FlashcardCardProps {
  flashcard: Flashcard;
  onImageError?: () => void;
}

export function FlashcardCard({ flashcard, onImageError }: FlashcardCardProps) {
  const [imageError, setImageError] = useState(false);
  const [exampleError, setExampleError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  const hasExample = !!flashcard.exampleImageSrc && !exampleError;

  return (
    <div style={styles.container}>
      <div style={hasExample ? styles.splitRow : undefined}>
        <div style={hasExample ? styles.half : undefined}>
          {imageError ? (
            <div style={styles.placeholder} data-testid="image-placeholder">
              <span style={styles.placeholderIcon}>?</span>
              <span style={styles.placeholderName}>{flashcard.name}</span>
            </div>
          ) : (
            <img
              src={assetPath(flashcard.imageSrc)}
              alt={flashcard.name}
              style={hasExample ? styles.halfImage : styles.image}
              onError={handleImageError}
              draggable={false}
            />
          )}
        </div>
        {hasExample && (
          <div style={styles.half}>
            <img
              src={assetPath(flashcard.exampleImageSrc!)}
              alt={flashcard.subtitle ?? flashcard.name}
              style={styles.halfImage}
              onError={() => setExampleError(true)}
              draggable={false}
            />
          </div>
        )}
      </div>
      <p style={styles.label}>{flashcard.name}</p>
      {flashcard.subtitle && (
        <p style={styles.subtitle}>{flashcard.subtitle}</p>
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
    width: '100%',
    userSelect: 'none',
  },
  splitRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  half: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    maxWidth: '80vw',
    maxHeight: '60vh',
    objectFit: 'contain',
    borderRadius: 16,
  },
  halfImage: {
    maxWidth: '38vw',
    maxHeight: '55vh',
    objectFit: 'contain',
    borderRadius: 16,
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38vw',
    height: '50vh',
    maxWidth: 480,
    backgroundColor: '#ffe0b2',
    borderRadius: 16,
    gap: 12,
  },
  placeholderIcon: {
    fontSize: 64,
    color: '#e65100',
  },
  placeholderName: {
    fontSize: 32,
    fontWeight: 700,
    color: '#bf360c',
  },
  label: {
    fontSize: 32,
    fontWeight: 700,
    marginTop: 16,
    color: '#333',
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 500,
    marginTop: 4,
    color: '#666',
    textAlign: 'center' as const,
  },
};
