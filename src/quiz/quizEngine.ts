import type { Flashcard, Category } from '../types';

export interface QuizOption {
  flashcardId: string;
  name: string;
  imageSrc: string;
  category: Category;
}

export interface QuizQuestion {
  promptWord: string;
  correctOption: QuizOption;
  options: QuizOption[];
}

/**
 * Get unique flashcard names from a list, returning one flashcard per unique name.
 * Used internally for distractor selection.
 */
export function getUniqueByName(flashcards: Flashcard[]): Flashcard[] {
  const seen = new Set<string>();
  const result: Flashcard[] = [];
  for (const card of flashcards) {
    if (!seen.has(card.name)) {
      seen.add(card.name);
      result.push(card);
    }
  }
  return result;
}

function toOption(card: Flashcard): QuizOption {
  return {
    flashcardId: card.id,
    name: card.name,
    imageSrc: card.imageSrc,
    category: card.category,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Generate a quiz question from the given flashcard pool.
 * - Selects a random correct answer from `pool`
 * - Picks 3 distractors with unique names, preferring same-category
 * - Falls back to other categories if same-category has < 4 unique names
 * - Shuffles option positions
 * - `previousId` is excluded from being the correct answer (no immediate repeats)
 */
export function generateQuestion(
  pool: Flashcard[],
  allFlashcards: Flashcard[],
  previousId?: string
): QuizQuestion {
  const uniquePool = getUniqueByName(pool);

  // Pick a correct answer, excluding previousId if possible
  const candidates = previousId && uniquePool.length > 1
    ? uniquePool.filter((c) => c.id !== previousId)
    : uniquePool;

  const correct = candidates[Math.floor(Math.random() * candidates.length)];
  const correctOption = toOption(correct);

  // Build distractor pool: prefer same category, fall back to others
  const uniqueAll = getUniqueByName(allFlashcards);
  const sameCategory = uniqueAll.filter(
    (c) => c.category === correct.category && c.name !== correct.name
  );
  const otherCategory = uniqueAll.filter(
    (c) => c.category !== correct.category && c.name !== correct.name
  );

  const shuffledSame = shuffle(sameCategory);
  const shuffledOther = shuffle(otherCategory);

  const distractors: QuizOption[] = [];
  const usedNames = new Set<string>([correct.name]);

  // Fill from same category first
  for (const card of shuffledSame) {
    if (distractors.length >= 3) break;
    if (!usedNames.has(card.name)) {
      usedNames.add(card.name);
      distractors.push(toOption(card));
    }
  }

  // Fall back to other categories if needed
  for (const card of shuffledOther) {
    if (distractors.length >= 3) break;
    if (!usedNames.has(card.name)) {
      usedNames.add(card.name);
      distractors.push(toOption(card));
    }
  }

  const options = shuffle([correctOption, ...distractors]);

  return {
    promptWord: correct.name,
    correctOption,
    options,
  };
}

/**
 * Evaluate whether the selected option is correct.
 * Returns true if selectedId matches the correct option's flashcardId.
 */
export function evaluateAnswer(
  question: QuizQuestion,
  selectedId: string
): boolean {
  return question.correctOption.flashcardId === selectedId;
}
