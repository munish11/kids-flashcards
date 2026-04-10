export interface QuizToggleButtonProps {
  isQuizMode: boolean;
  onToggle: () => void;
}

export function QuizToggleButton({ isQuizMode, onToggle }: QuizToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isQuizMode ? 'Exit quiz mode' : 'Start quiz mode'}
      style={styles.button}
      data-testid="quiz-toggle-btn"
    >
      <span style={styles.icon}>{isQuizMode ? '📖' : '🧩'}</span>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#ff6d00',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
    transition: 'transform 0.15s ease, background-color 0.15s ease',
    padding: 0,
  },
  icon: {
    fontSize: 22,
    lineHeight: 1,
  },
};
