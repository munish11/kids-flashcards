export type Category =
  | "Fruits"
  | "Vegetables"
  | "Animals"
  | "Colors"
  | "Shapes"
  | "Vehicles"
  | "Body Parts"
  | "Numbers"
  | "Letters"
  | "Insects"
  | "Ocean Life"
  | "Birds"
  | "Food"
  | "Weather"
  | "Musical Instruments"
  | "Family"
  | "Dinosaurs"
  | "Space"
  | "Sports"
  | "Cars"
  | "Household Items"
  | "Emotions"
  | "Toys";

export interface Flashcard {
  id: string;
  name: string;
  imageSrc: string;
  category: Category;
  subtitle?: string;
  exampleImageSrc?: string;
}

export interface FlashcardDataModule {
  getAllFlashcards(): Flashcard[];
  getCategories(): Category[];
  getFlashcardsByCategory(category: Category): Flashcard[];
}

export interface AppState {
  allFlashcards: Flashcard[];
  filteredFlashcards: Flashcard[];
  currentIndex: number;
  selectedCategory: Category | "All";
  isPlaying: boolean;
}
