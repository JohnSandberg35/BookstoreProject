// ─────────────────────────────────────────────────────────────────────────────
// CategoryFilter.tsx
// Fetches all distinct categories from the backend and renders them as
// checkboxes. Checked categories are passed up to BooksPage via props.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";

interface CategoryFilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch the distinct category list from the backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://localhost:5000/Book/GetCategories",
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Toggle a category in or out of the selected list
  const handleChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div>
      <h5 className="mb-3">Filter by Category</h5>
      {categories.map((c) => (
        <div key={c} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={c}
            checked={selectedCategories.includes(c)}
            onChange={() => handleChange(c)}
          />
          <label className="form-check-label">{c}</label>
        </div>
      ))}
    </div>
  );
}

export default CategoryFilter;
