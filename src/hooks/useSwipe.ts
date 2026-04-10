import { useEffect, useRef, type RefObject } from "react";

/**
 * Pure helper that classifies a horizontal gesture as "left", "right", or "tap"
 * based on the horizontal delta between start and end positions.
 *
 * - If |endX - startX| < threshold → "tap"
 * - If endX < startX (moved left) → "left"
 * - If endX > startX (moved right) → "right"
 */
export function detectSwipeDirection(
  startX: number,
  endX: number,
  threshold: number
): "left" | "right" | "tap" {
  const delta = endX - startX;

  if (Math.abs(delta) < threshold) {
    return "tap";
  }

  return delta < 0 ? "left" : "right";
}

const SWIPE_THRESHOLD = 30;

/**
 * Hook that tracks touch start/end positions on the given element ref
 * and classifies the gesture as swipe left, swipe right, or tap.
 *
 * - Swipe left (endX < startX with delta > threshold) → onSwipeLeft
 * - Swipe right (endX > startX with delta > threshold) → onSwipeRight
 * - Tap (delta < threshold) → onTap
 *
 * Uses refs for callbacks to avoid stale closures (same pattern as other hooks).
 */
export function useSwipe(
  ref: RefObject<HTMLElement | null>,
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  onTap: () => void
): void {
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);
  const onTapRef = useRef(onTap);

  useEffect(() => {
    onSwipeLeftRef.current = onSwipeLeft;
  }, [onSwipeLeft]);

  useEffect(() => {
    onSwipeRightRef.current = onSwipeRight;
  }, [onSwipeRight]);

  useEffect(() => {
    onTapRef.current = onTap;
  }, [onTap]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const direction = detectSwipeDirection(startX, endX, SWIPE_THRESHOLD);

      if (direction === "left") {
        onSwipeLeftRef.current();
      } else if (direction === "right") {
        onSwipeRightRef.current();
      } else {
        onTapRef.current();
      }
    };

    el.addEventListener("touchstart", handleTouchStart);
    el.addEventListener("touchend", handleTouchEnd);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [ref]);
}
