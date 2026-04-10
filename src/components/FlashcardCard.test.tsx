import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlashcardCard } from './FlashcardCard';
import type { Flashcard } from '../types';

const mockFlashcard: Flashcard = {
  id: 'fruit-apple',
  name: 'Apple',
  imageSrc: '/images/fruits/apple.png',
  category: 'Fruits',
};

describe('FlashcardCard', () => {
  it('renders the flashcard image with correct alt text', () => {
    render(<FlashcardCard flashcard={mockFlashcard} />);
    const img = screen.getByRole('img', { name: 'Apple' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/fruits/apple.png');
  });

  it('renders the name label', () => {
    render(<FlashcardCard flashcard={mockFlashcard} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('label has minimum 24px font size', () => {
    render(<FlashcardCard flashcard={mockFlashcard} />);
    // The label is a <p> with the flashcard name — grab all text matches and find the label (the <p>)
    const labels = screen.getAllByText('Apple');
    const labelP = labels.find((el) => el.tagName === 'P');
    expect(labelP).toBeDefined();
    expect(labelP!.style.fontSize).toBe('32px');
  });

  it('shows placeholder with item name on image error', () => {
    render(<FlashcardCard flashcard={mockFlashcard} />);
    const img = screen.getByRole('img', { name: 'Apple' });
    fireEvent.error(img);

    const placeholder = screen.getByTestId('image-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Apple');
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('calls onImageError callback when image fails to load', () => {
    const onError = vi.fn();
    render(<FlashcardCard flashcard={mockFlashcard} onImageError={onError} />);
    const img = screen.getByRole('img', { name: 'Apple' });
    fireEvent.error(img);
    expect(onError).toHaveBeenCalledOnce();
  });

  it('does not crash when onImageError is not provided', () => {
    render(<FlashcardCard flashcard={mockFlashcard} />);
    const img = screen.getByRole('img', { name: 'Apple' });
    expect(() => fireEvent.error(img)).not.toThrow();
  });
});
