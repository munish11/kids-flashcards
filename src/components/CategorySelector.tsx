import type { Category } from '../types';

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category | "All";
  onSelectCategory: (category: Category | "All") => void;
}

const categoryColors: Record<string, { bg: string; active: string; text: string }> = {
  All: { bg: '#e0e0e0', active: '#7c4dff', text: '#fff' },
  Fruits: { bg: '#ffecb3', active: '#ff9800', text: '#fff' },
  Vegetables: { bg: '#c8e6c9', active: '#4caf50', text: '#fff' },
  Animals: { bg: '#bbdefb', active: '#2196f3', text: '#fff' },
  Colors: { bg: '#f3e5f5', active: '#9c27b0', text: '#fff' },
  Shapes: { bg: '#fce4ec', active: '#e91e63', text: '#fff' },
  Vehicles: { bg: '#e8eaf6', active: '#3f51b5', text: '#fff' },
  "Body Parts": { bg: '#fbe9e7', active: '#ff5722', text: '#fff' },
  Numbers: { bg: '#e0f7fa', active: '#00bcd4', text: '#fff' },
  Letters: { bg: '#f1f8e9', active: '#8bc34a', text: '#fff' },
  Insects: { bg: '#fff9c4', active: '#fbc02d', text: '#333' },
  "Ocean Life": { bg: '#e1f5fe', active: '#0288d1', text: '#fff' },
  Birds: { bg: '#e8f5e9', active: '#388e3c', text: '#fff' },
  Food: { bg: '#fff3e0', active: '#ef6c00', text: '#fff' },
  Weather: { bg: '#eceff1', active: '#546e7a', text: '#fff' },
  "Musical Instruments": { bg: '#ede7f6', active: '#673ab7', text: '#fff' },
};

function getColors(category: string) {
  return categoryColors[category] ?? { bg: '#e0e0e0', active: '#9e9e9e', text: '#fff' };
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  const allOptions: (Category | "All")[] = ["All", ...categories];

  return (
    <div style={styles.container} data-testid="category-selector">
      {allOptions.map((cat) => {
        const isActive = cat === selectedCategory;
        const colors = getColors(cat);
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            style={{
              ...styles.button,
              backgroundColor: isActive ? colors.active : colors.bg,
              color: isActive ? colors.text : '#333',
              fontWeight: isActive ? 700 : 500,
              boxShadow: isActive ? '0 3px 8px rgba(0,0,0,0.25)' : '0 1px 3px rgba(0,0,0,0.1)',
              transform: isActive ? 'scale(1.08)' : 'scale(1)',
            }}
            aria-pressed={isActive}
            data-testid={`category-btn-${cat}`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    padding: '8px 12px',
  },
  button: {
    border: 'none',
    borderRadius: 24,
    padding: '10px 22px',
    fontSize: 18,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    minWidth: 80,
  },
};
