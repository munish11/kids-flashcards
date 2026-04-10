import type { Flashcard } from '../types';
import { useQuizSession } from '../quiz/useQuizSession';
import { QuizPrompt } from './QuizPrompt';
import { QuizOptionCard } from './QuizOptionCard';
import { QuizScoreboard } from './QuizScoreboard';

export interface QuizViewProps {
  filteredFlashcards: Flashcard[];
  allFlashcards: Flashcard[];
}

export function QuizView({ filteredFlashcards, allFlashcards }: QuizViewProps) {
  const { state, handleAnswer } = useQuizSession(filteredFlashcards, allFlashcards);

  if (!state.currentQuestion) {
    return (
      <div style={styles.fallback}>
        <span style={styles.fallbackEmoji}>📚</span>
        <p style={styles.fallbackText}>
          Not enough cards for a quiz. Try another category!
        </p>
      </div>
    );
  }

  const { currentQuestion, selectedOptionId, isCorrect, questionNumber, score, totalAnswered } = state;
  const isRevealed = selectedOptionId !== null;

  return (
    <div style={styles.container}>
      <QuizPrompt word={currentQuestion.promptWord} />

      {isRevealed && isCorrect === true && (
        <div style={styles.feedback}>
          <span style={styles.feedbackEmoji}>⭐</span>
          <span style={styles.feedbackText}>Great job!</span>
        </div>
      )}
      {isRevealed && isCorrect === false && (
        <div style={styles.feedback}>
          <span style={styles.feedbackEmoji}>💪</span>
          <span style={styles.feedbackText}>Nice try! You'll get it next time!</span>
        </div>
      )}

      <div style={styles.grid}>
        {currentQuestion.options.map((option) => (
          <QuizOptionCard
            key={option.flashcardId}
            option={option}
            isSelected={selectedOptionId === option.flashcardId}
            isCorrectAnswer={option.flashcardId === currentQuestion.correctOption.flashcardId}
            isRevealed={isRevealed}
            disabled={isRevealed}
            onSelect={handleAnswer}
          />
        ))}
      </div>

      <QuizScoreboard
        questionNumber={questionNumber}
        score={score}
        totalAnswered={totalAnswered}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    userSelect: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    width: '100%',
    maxWidth: 480,
  },
  feedback: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '4px 0',
  },
  feedbackEmoji: {
    fontSize: 32,
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: 600,
    color: '#555',
  },
  fallback: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  fallbackEmoji: {
    fontSize: 64,
  },
  fallbackText: {
    fontSize: 24,
    fontWeight: 600,
    color: '#666',
    textAlign: 'center' as const,
  },
};
