import { useState } from 'react';
import type { QuizOption } from '../quiz/quizEngine';
import { assetPath } from '../utils/assetPath';

export interface QuizOptionCardProps {
  option: QuizOption;
  isSelected: boolean;
  isCorrectAnswer: boolean;
  isRevealed: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}

export function QuizOptionCard({
  option,
  isSelected,
  isCorrectAnswer,
  isRevealed,
  disabled,
  onSelect,
}: QuizOptionCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      onSelect(option.flashcardId);
    }
  };

  let borderColor = '#ddd';
  if (isRevealed && isCorrectAnswer) {
    borderColor = '#4caf50';
  } else if (isRevealed && isSelected && !isCorrectAnswer) {
    borderColor = '#f44336';
  }

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    borderColor,
    borderWidth: isRevealed && (isCorrectAnswer || isSelected) ? 4 : 2,
    cursor: disabled ? 'default' : 'pointer',
    opacity: isRevealed && !isSelected && !isCorrectAnswer ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  };

  return (
    <button
      type="button"
      style={containerStyle}
      onClick={handleClick}
      disabled={disabled}
      aria-label={option.name}
    >
      {imageError ? (
        <div style={styles.placeholder}>
          <span style={styles.placeholderIcon}>?</span>
          <span style={styles.placeholderName}>{option.name}</span>
        </div>
      ) : (
        <img
          src={assetPath(option.imageSrc)}
          alt={option.name}
          style={styles.image}
          onError={() => setImageError(true)}
          draggable={false}
        />
      )}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 120,
    borderStyle: 'solid',
    borderRadius: 16,
    padding: 4,
    background: '#fff',
    boxSizing: 'border-box',
    overflow: 'hidden',
    transition: 'border-color 0.2s, opacity 0.2s',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 12,
    display: 'block',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    minHeight: 120,
    backgroundColor: '#ffe0b2',
    borderRadius: 12,
    gap: 8,
  },
  placeholderIcon: {
    fontSize: 40,
    color: '#e65100',
  },
  placeholderName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#bf360c',
    textAlign: 'center' as const,
  },
};
