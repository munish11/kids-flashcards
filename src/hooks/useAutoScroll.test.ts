import { renderHook } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useAutoScroll } from "./useAutoScroll";

describe("useAutoScroll", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onAdvance at the specified interval when playing", () => {
    const onAdvance = vi.fn();
    renderHook(() => useAutoScroll(true, onAdvance, 5000));

    expect(onAdvance).not.toHaveBeenCalled();

    vi.advanceTimersByTime(5000);
    expect(onAdvance).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5000);
    expect(onAdvance).toHaveBeenCalledTimes(2);
  });

  it("does not call onAdvance when paused", () => {
    const onAdvance = vi.fn();
    renderHook(() => useAutoScroll(false, onAdvance, 5000));

    vi.advanceTimersByTime(15000);
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("stops the interval when isPlaying changes to false", () => {
    const onAdvance = vi.fn();
    const { rerender } = renderHook(
      ({ isPlaying }) => useAutoScroll(isPlaying, onAdvance, 5000),
      { initialProps: { isPlaying: true } }
    );

    vi.advanceTimersByTime(5000);
    expect(onAdvance).toHaveBeenCalledTimes(1);

    rerender({ isPlaying: false });

    vi.advanceTimersByTime(10000);
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("restarts the interval when isPlaying changes back to true", () => {
    const onAdvance = vi.fn();
    const { rerender } = renderHook(
      ({ isPlaying }) => useAutoScroll(isPlaying, onAdvance, 5000),
      { initialProps: { isPlaying: true } }
    );

    vi.advanceTimersByTime(5000);
    expect(onAdvance).toHaveBeenCalledTimes(1);

    rerender({ isPlaying: false });
    rerender({ isPlaying: true });

    vi.advanceTimersByTime(5000);
    expect(onAdvance).toHaveBeenCalledTimes(2);
  });

  it("cleans up the interval on unmount", () => {
    const onAdvance = vi.fn();
    const { unmount } = renderHook(() => useAutoScroll(true, onAdvance, 5000));

    vi.advanceTimersByTime(5000);
    expect(onAdvance).toHaveBeenCalledTimes(1);

    unmount();

    vi.advanceTimersByTime(10000);
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("uses the latest callback without restarting the interval", () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const { rerender } = renderHook(
      ({ cb }) => useAutoScroll(true, cb, 5000),
      { initialProps: { cb: firstCallback } }
    );

    // Advance partway through the interval
    vi.advanceTimersByTime(3000);

    // Swap the callback
    rerender({ cb: secondCallback });

    // Complete the original interval cycle
    vi.advanceTimersByTime(2000);

    // The second callback should fire, not the first
    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });
});
