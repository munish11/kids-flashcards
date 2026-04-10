import { useState, useEffect, useRef, useCallback } from 'react';
import type { Flashcard } from '../types';
import { generateQuestion, evaluateAnswer } from './quizEngine';
import type { QuizQuestion } from './quizEngine';

export interface QuizSessionState {
  currentQuestion: QuizQuestion | null;
  questionNumber: number;
  score: number;
  totalAnswered: number;
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  isTransitioning: boolean;
}

export interface UseQuizSessionReturn {
  state: QuizSessionState;
  handleAnswer: (selectedId: string) => void;
  resetSession: () => void;
}

const CORRECT_DELAY = 1500;
const INCORRECT_DELAY = 2500;

function createInitialState(): QuizSessionState {
  return {
    currentQuestion: null,
    questionNumber: 1,
    score: 0,
    totalAnswered: 0,
    selectedOptionId: null,
    isCorrect: null,
    isTransitioning: false,
  };
}

export function useQuizSession(
  filteredFlashcards: Flashcard[],
  allFlashcards: Flashcard[]
): UseQuizSessionReturn {
  const [state, setState] = useState<QuizSessionState>(createInitialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousIdRef = useRef<string | undefined>(undefined);

  const cancelTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetSession = useCallback(() => {
    cancelTimer();
    previousIdRef.current = undefined;

    if (filteredFlashcards.length < 4) {
      setState({ ...createInitialState(), currentQuestion: null });
      return;
    }

    const firstQuestion = generateQuestion(filteredFlashcards, allFlashcards);
    previousIdRef.current = firstQuestion.correctOption.flashcardId;
    setState({
      ...createInitialState(),
      currentQuestion: firstQuestion,
    });
  }, [filteredFlashcards, allFlashcards, cancelTimer]);

  const handleAnswer = useCallback(
    (selectedId: string) => {
      setState((prev) => {
        if (prev.isTransitioning || !prev.currentQuestion || prev.selectedOptionId !== null) {
          return prev;
        }

        const correct = evaluateAnswer(prev.currentQuestion, selectedId);

        return {
          ...prev,
          selectedOptionId: selectedId,
          isCorrect: correct,
          isTransitioning: true,
          score: correct ? prev.score + 1 : prev.score,
          totalAnswered: prev.totalAnswered + 1,
        };
      });
    },
    []
  );

  // Transition timer: advance to next question after delay
  useEffect(() => {
    if (!state.isTransitioning || state.isCorrect === null) return;

    const delay = state.isCorrect ? CORRECT_DELAY : INCORRECT_DELAY;

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const nextQuestion = generateQuestion(
        filteredFlashcards,
        allFlashcards,
        previousIdRef.current
      );
      previousIdRef.current = nextQuestion.correctOption.flashcardId;

      setState((prev) => ({
        ...prev,
        currentQuestion: nextQuestion,
        questionNumber: prev.questionNumber + 1,
        selectedOptionId: null,
        isCorrect: null,
        isTransitioning: false,
      }));
    }, delay);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isTransitioning, state.isCorrect, filteredFlashcards, allFlashcards]);

  // React to filteredFlashcards changes: cancel pending timers and reset session
  useEffect(() => {
    cancelTimer();
    previousIdRef.current = undefined;

    if (filteredFlashcards.length < 4) {
      setState({ ...createInitialState(), currentQuestion: null });
      return;
    }

    const firstQuestion = generateQuestion(filteredFlashcards, allFlashcards);
    previousIdRef.current = firstQuestion.correctOption.flashcardId;
    setState({
      ...createInitialState(),
      currentQuestion: firstQuestion,
    });
  }, [filteredFlashcards, allFlashcards, cancelTimer]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      cancelTimer();
    };
  }, [cancelTimer]);

  return { state, handleAnswer, resetSession };
}
