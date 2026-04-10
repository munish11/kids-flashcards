import type { Flashcard, Category } from "../types";

const VALID_CATEGORIES: Category[] = [
  "Fruits", "Vegetables", "Animals", "Colors", "Shapes", "Vehicles",
  "Body Parts", "Numbers", "Letters", "Insects", "Ocean Life", "Birds",
  "Food", "Weather", "Musical Instruments",
  "Dinosaurs", "Space", "Sports", "Cars", "Household Items", "Emotions", "Toys",
];

export function nextIndex(current: number, length: number): number {
  return (current + 1) % length;
}

export function prevIndex(current: number, length: number): number {
  return (current - 1 + length) % length;
}

export function filterByCategory(
  flashcards: Flashcard[],
  category: Category | "All"
): Flashcard[] {
  if (category === "All") {
    return flashcards;
  }
  return flashcards.filter((card) => card.category === category);
}

export function shuffleFlashcards(cards: Flashcard[]): Flashcard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function isValidFlashcard(card: Flashcard): boolean {
  return (
    typeof card.id === "string" &&
    card.id.trim().length > 0 &&
    typeof card.name === "string" &&
    card.name.trim().length > 0 &&
    typeof card.imageSrc === "string" &&
    card.imageSrc.trim().length > 0 &&
    VALID_CATEGORIES.includes(card.category)
  );
}
