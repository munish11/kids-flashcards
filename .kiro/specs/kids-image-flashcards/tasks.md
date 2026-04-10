# Implementation Plan: Kids Image Flashcards

## Overview

Build a single-page React + TypeScript + Vite application that displays kid-friendly image flashcards one at a time with auto-scrolling, keyboard/touch navigation, category filtering, and pause/resume controls. Implementation proceeds bottom-up: data layer and pure logic first, then hooks, then UI components, then wiring and integration.

## Tasks

- [x] 1. Scaffold project and install dependencies
  - Initialize a Vite + React + TypeScript project (if not already set up)
  - Install dev dependencies: `vitest`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
  - Configure Vitest in `vite.config.ts` with jsdom environment
  - Create base directory structure: `src/data/`, `src/components/`, `src/hooks/`, `src/utils/`, `src/types/`
  - _Requirements: N/A (project setup)_

- [x] 2. Define types and flashcard data
  - [x] 2.1 Create type definitions
    - Create `src/types/index.ts` with `Flashcard`, `Category`, and `AppState` interfaces as specified in the design
    - _Requirements: 4.3_

  - [x] 2.2 Create flashcard data module
    - Create `src/data/flashcards.ts` exporting the flashcard array with at least 5 items per category (Fruits, Vegetables, Animals)
    - Implement `getAllFlashcards()`, `getCategories()`, and `getFlashcardsByCategory()` functions
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 2.3 Add placeholder images
    - Add placeholder image files (PNG or SVG) under `public/images/fruits/`, `public/images/vegetables/`, `public/images/animals/`
    - At least 5 images per category matching the flashcard data entries
    - _Requirements: 4.1, 4.2_

- [x] 3. Implement core utility functions and property tests
  - [x] 3.1 Implement pure navigation and filter functions
    - Create `src/utils/flashcardUtils.ts` with `nextIndex`, `prevIndex`, `filterByCategory`, and `isValidFlashcard` functions
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 5.2, 5.3_

  - [ ]* 3.2 Write property test: Next index wraps correctly
    - **Property 1: Next index wraps correctly**
    - **Validates: Requirements 2.1, 2.2, 3.1, 3.3**

  - [ ]* 3.3 Write property test: Previous index wraps correctly
    - **Property 2: Previous index wraps correctly**
    - **Validates: Requirements 3.2, 3.4**

  - [ ]* 3.4 Write property test: Every flashcard has a non-empty name label
    - **Property 3: Every flashcard has a non-empty name label**
    - **Validates: Requirements 1.3, 4.3**

  - [ ]* 3.5 Write property test: Category filter returns only matching flashcards
    - **Property 4: Category filter returns only matching flashcards**
    - **Validates: Requirements 5.2, 5.3**

  - [ ]* 3.6 Write unit tests for data validation
    - Verify the image library has ≥ 3 categories and ≥ 5 items per category
    - _Requirements: 4.1, 4.2_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement custom hooks
  - [x] 5.1 Implement useAutoScroll hook
    - Create `src/hooks/useAutoScroll.ts` that sets up an interval calling `onAdvance` every `delay` ms when `isPlaying` is true, cleans up on unmount or pause
    - _Requirements: 2.1, 2.2, 2.3, 8.2, 8.3_

  - [x] 5.2 Implement useKeyboardNav hook
    - Create `src/hooks/useKeyboardNav.ts` that listens for ArrowRight and ArrowLeft keydown events and calls `onNext`/`onPrev` callbacks
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 5.3 Implement useSwipe hook
    - Create `src/hooks/useSwipe.ts` that tracks touch start/end positions, detects swipe left, swipe right, and tap gestures based on a threshold
    - Implement `detectSwipeDirection` as a pure helper function for testability
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 5.4 Write property test: Swipe direction detection
    - **Property 5: Swipe direction detection**
    - **Validates: Requirements 7.1, 7.2**

  - [ ]* 5.5 Write property test: Tap detection for small touch movements
    - **Property 6: Tap detection for small touch movements**
    - **Validates: Requirements 7.3**

- [x] 6. Implement UI components
  - [x] 6.1 Implement FlashcardCard component
    - Create `src/components/FlashcardCard.tsx` rendering a single flashcard image + label text
    - Handle image `onError` to show a placeholder graphic with the item name
    - Use a minimum font size of 24px for the label
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.3, 9.1_

  - [ ]* 6.2 Write property test: Image error produces placeholder with item name
    - **Property 7: Image error produces placeholder with item name**
    - **Validates: Requirements 9.1**

  - [x] 6.3 Implement FlashcardViewer component
    - Create `src/components/FlashcardViewer.tsx` that displays the current FlashcardCard, integrates the useSwipe hook, and tracks image error counts to show a fallback message when all images in the category fail
    - _Requirements: 1.1, 1.2, 7.1, 7.2, 7.3, 9.2, 9.3_

  - [x] 6.4 Implement CategorySelector component
    - Create `src/components/CategorySelector.tsx` rendering category buttons including "All", highlighting the active category
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 6.5 Implement PlayPauseControl component
    - Create `src/components/PlayPauseControl.tsx` as a toggle button showing play/pause icon reflecting current auto-scroll state
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Wire everything together in App component
  - [x] 8.1 Implement App component with full state management
    - Create `src/App.tsx` managing `currentIndex`, `selectedCategory`, `isPlaying`, and `filteredFlashcards` state
    - Wire up `useAutoScroll`, `useKeyboardNav` hooks
    - Connect `CategorySelector` (reset index to 0 and restart timer on category change), `FlashcardViewer`, and `PlayPauseControl`
    - Default to "All" category and `isPlaying=true` on initial load
    - Reset auto-scroll timer on any manual navigation
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 5.4, 8.2, 8.3_

  - [x] 8.2 Add responsive CSS styling
    - Style the app for screen widths from 320px to 1920px
    - Center the flashcard, maintain image aspect ratio, ensure label text ≥ 24px
    - Clean, minimal background with kid-friendly colors
    - _Requirements: 1.2, 1.4, 6.1, 6.2, 6.3_

  - [ ]* 8.3 Write unit tests for App integration
    - Test initial state defaults to "All" category (Requirement 5.4)
    - Test only one flashcard is displayed at a time (Requirement 1.1)
    - Test pause/play toggle updates icon state (Requirements 8.2, 8.3, 8.4)
    - Test category selection resets index and filters flashcards (Requirements 5.2, 5.3)
    - Test auto-scroll continues when image errors occur (Requirement 9.2)
    - _Requirements: 1.1, 5.4, 8.2, 8.3, 8.4, 9.2_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All images are static assets in `/public/images/` — no backend required
no