import { useEffect, useRef } from "react";

/**
 * Hook that listens for keyboard arrow keys to navigate flashcards.
 * ArrowRight calls `onNext`, ArrowLeft calls `onPrev`.
 * Uses refs for callbacks to avoid stale closures (same pattern as useAutoScroll).
 * Cleans up the event listener on unmount.
 */
export function useKeyboardNav(
  onNext: () => void,
  onPrev: () => void
): void {
  const onNextRef = useRef(onNext);
  const onPrevRef = useRef(onPrev);

  // Keep callback refs current
  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  useEffect(() => {
    onPrevRef.current = onPrev;
  }, [onPrev]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        onNextRef.current();
      } else if (e.key === "ArrowLeft") {
        onPrevRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
