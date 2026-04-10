export interface PlayPauseControlProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function PlayPauseControl({ isPlaying, onToggle }: PlayPauseControlProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      style={styles.button}
      data-testid="play-pause-btn"
    >
      <span style={styles.icon}>{isPlaying ? '❚❚' : '▶'}</span>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#7c4dff',
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
