export interface QuizPromptProps {
  word: string;
}

export function QuizPrompt({ word }: QuizPromptProps) {
  return (
    <div style={styles.container}>
      <h1 style={styles.word}>{word}</h1>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '8px 0',
  },
  word: {
    fontSize: 48,
    fontWeight: 800,
    color: '#333',
    textAlign: 'center' as const,
    margin: 0,
    userSelect: 'none',
  },
};
