// ─────────────────────────────────────────────────────────────────────────────
// BooksPage.tsx
// The main public browsing page. Holds the selectedCategories state and
// passes it down to both CategoryFilter (to show checkboxes) and BookList
// (to apply the filter when fetching books).
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import BookList from "../components/BookList";
import CategoryFilter from "../components/CategoryFilter";
import CartSummary from "../components/CartSummary";

function BooksPage() {
  // State lives here so it can be shared between CategoryFilter and BookList
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">📚 Bookstore</h1>

      {/* Cart summary card at the top of the page */}
      <CartSummary />

      <div className="row">
        {/* Category filter sidebar */}
        <div className="col-md-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        {/* Main book list */}
        <div className="col-md-9">
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
