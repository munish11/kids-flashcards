import { useEffect, useRef } from "react";

/**
 * Hook that auto-advances flashcards on a timer.
 * Sets up an interval calling `onAdvance` every `delay` ms when `isPlaying` is true.
 * Cleans up the interval on unmount or when `isPlaying` becomes false.
 * Uses a ref for the callback to avoid stale closures.
 */
export function useAutoScroll(
  isPlaying: boolean,
  onAdvance: () => void,
  delay: number,
  resetKey: number = 0
): void {
  const callbackRef = useRef(onAdvance);

  // Keep the callback ref current without restarting the interval
  useEffect(() => {
    callbackRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      callbackRef.current();
    }, delay);

    return () => clearInterval(id);
  }, [isPlaying, delay, resetKey]);
}
