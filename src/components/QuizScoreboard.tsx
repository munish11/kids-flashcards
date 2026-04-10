export interface QuizScoreboardProps {
  questionNumber: number;
  score: number;
  totalAnswered: number;
}

export function QuizScoreboard({ questionNumber, score, totalAnswered }: QuizScoreboardProps) {
  return (
    <div style={styles.container}>
      <span style={styles.question}>Question {questionNumber}</span>
      <span style={styles.score}>{score} / {totalAnswered}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '8px 4px',
  },
  question: {
    fontSize: 20,
    fontWeight: 600,
    color: '#555',
  },
  score: {
    fontSize: 20,
    fontWeight: 600,
    color: '#555',
  },
};
