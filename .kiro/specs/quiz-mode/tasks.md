# Implementation Plan: Quiz Mode

## Overview

Implement a word-to-image quiz mode for the Kids Image Flashcards app. The quiz engine is built as a pure-logic TypeScript module, connected to React via a custom hook, and rendered through a set of new components. The implementation integrates into the existing App shell with a footer toggle button, category filtering, score tracking, and auto-progression.

## Tasks

- [x] 1. Implement quiz engine (pure logic module)
  - [x] 1.1 Create `src/quiz/quizEngine.ts` with `QuizQuestion`, `QuizOption` interfaces and implement `getUniqueByName`, `generateQuestion`, and `evaluateAnswer` functions
    - `getUniqueByName` deduplicates flashcards by name, returning one flashcard per unique name
    - `generateQuestion` selects a random correct answer from the pool (excluding `previousId`), picks 3 distractors preferring same-category, falls back to other categories if needed, shuffles option positions, and returns a `QuizQuestion`
    - `evaluateAnswer` returns true if `selectedId` matches `correctOption.flashcardId`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 1.2 Write property test: Question structure invariant
    - **Property 1: Question structure invariant**
    - Use fast-check to generate arbitrary flashcard pools with ≥ 4 unique names
    - Assert: `options` has exactly 4 elements, all 4 names are distinct, exactly one matches `correctOption.flashcardId`, `promptWord` equals `correctOption.name`, correct option is from the input pool
    - **Validates: Requirements 2.1, 2.2, 2.6**

  - [ ]* 1.3 Write property test: Distractor category preference
    - **Property 2: Distractor category preference**
    - Generate pools where correct answer's category has ≥ 4 unique names; assert all 3 distractors share that category
    - Generate pools with < 4 same-category names; assert 4 options are still produced
    - **Validates: Requirements 2.3, 2.4, 6.3**

  - [ ]* 1.4 Write property test: No immediate repeat of correct answer
    - **Property 3: No immediate repeat of correct answer**
    - Generate pools with ≥ 2 unique names, call `generateQuestion` twice passing first question's `correctOption.flashcardId` as `previousId`, assert different correct answers
    - **Validates: Requirements 5.3**

  - [ ]* 1.5 Write property test: Correct answer position varies
    - **Property 4: Correct answer position varies**
    - Generate a pool with ≥ 4 unique names, generate 50 questions, collect correct-answer indices, assert not all identical
    - **Validates: Requirements 2.5**

  - [ ]* 1.6 Write unit tests for quiz engine edge cases
    - Test `generateQuestion` with a known set of flashcards (example-based)
    - Test cross-category distractor fallback when category has < 4 unique names
    - Test `evaluateAnswer` returns correct result for correct and incorrect selections
    - Test `getUniqueByName` deduplicates properly
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

- [x] 2. Checkpoint - Verify quiz engine
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Implement quiz UI components
  - [x] 3.1 Create `src/components/QuizOptionCard.tsx`
    - Render a tappable image with minimum 120×120px tap target
    - Accept `isSelected`, `isCorrectAnswer`, `isRevealed`, `disabled` props
    - Show green border when correct and revealed, red border when incorrect and selected
    - Show placeholder with flashcard name on image load error
    - _Requirements: 3.2, 3.3, 3.4, 4.1, 4.2_

  - [x] 3.2 Create `src/components/QuizPrompt.tsx`
    - Display the prompt word at ≥ 36px font size, centered at top
    - _Requirements: 3.1_

  - [x] 3.3 Create `src/components/QuizScoreboard.tsx`
    - Display current question number (e.g., "Question 3")
    - Display running score (e.g., "3 / 5")
    - _Requirements: 5.4, 7.1_

  - [x] 3.4 Create `src/components/QuizView.tsx`
    - Compose `QuizPrompt`, `QuizGrid` (2×2 grid of `QuizOptionCard`), and `QuizScoreboard`
    - Show celebratory visual (star/checkmark) on correct answer
    - Show encouraging visual ("try next time" icon) on incorrect answer, without negative imagery
    - Show fallback message when pool has insufficient flashcards for a quiz
    - Hide flashcard name label and browsing-mode image display
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 3.5 Write property test: Options disabled after selection
    - **Property 5: Options disabled after selection**
    - Render `QuizOptionCard` components in revealed state, assert all have disabled state (pointer-events none or disabled attribute)
    - **Validates: Requirements 4.3**

  - [ ]* 3.6 Write unit tests for quiz UI components
    - Test QuizPrompt renders word at ≥ 36px
    - Test QuizOptionCard shows green border on correct, red on incorrect
    - Test QuizOptionCard shows celebratory feedback on correct tap
    - Test QuizOptionCard shows encouraging feedback on incorrect tap
    - Test QuizView renders 4 image options in a 2×2 grid
    - Test QuizScoreboard displays question number and score
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.4, 4.5, 5.4, 7.1_

- [x] 4. Implement quiz session hook
  - [x] 4.1 Create `src/quiz/useQuizSession.ts`
    - Manage `QuizSessionState`: `currentQuestion`, `questionNumber`, `score`, `totalAnswered`, `selectedOptionId`, `isCorrect`, `isTransitioning`
    - `handleAnswer`: evaluate answer, update score, disable options, set transition timer (1500ms correct, 2500ms incorrect), then generate next question
    - `resetSession`: reset all state and generate first question
    - React to `filteredFlashcards` changes: cancel pending timers and reset session
    - Clean up timers on unmount via `useEffect` cleanup
    - _Requirements: 4.3, 5.1, 5.2, 5.3, 5.4, 6.2, 7.1, 7.2, 7.3_

  - [ ]* 4.2 Write unit tests for useQuizSession hook
    - Test auto-advance after 1500ms on correct answer
    - Test auto-advance after 2500ms on incorrect answer
    - Test score increments on correct answer
    - Test session resets when filteredFlashcards changes
    - Test timer cleanup on unmount
    - _Requirements: 5.1, 5.2, 7.1, 7.2, 7.3_

- [x] 5. Checkpoint - Verify quiz components and hook
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Integrate quiz mode into App shell
  - [x] 6.1 Create `src/components/QuizToggleButton.tsx`
    - Render a quiz mode toggle button for the footer
    - Accept `isQuizMode` and `onToggle` props
    - _Requirements: 1.1_

  - [x] 6.2 Update `src/App.tsx` to integrate quiz mode
    - Add `isQuizMode` state
    - Render `QuizToggleButton` in footer alongside `PlayPauseControl`
    - Conditionally render `FlashcardViewer` or `QuizView` in main area based on `isQuizMode`
    - Hide `PlayPauseControl` and disable swipe/keyboard navigation when quiz mode is active
    - Keep `CategorySelector` visible in quiz mode
    - Reset score when exiting quiz mode
    - Category change during quiz mode resets session (handled by `useQuizSession` reacting to `filteredFlashcards`)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.5, 6.1, 6.2, 6.3, 7.2, 7.3_

  - [ ]* 6.3 Write unit tests for App quiz mode integration
    - Test quiz toggle button appears in footer
    - Test tapping quiz button enters quiz mode and hides play/pause
    - Test tapping exit restores browsing mode
    - Test category selector remains visible in quiz mode
    - Test category change resets quiz session and score
    - Test exiting quiz mode resets score
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.2, 7.2, 7.3_

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The quiz engine is intentionally pure (no React) for easy testing with fast-check
- All components use inline styles consistent with the existing codebase pattern
