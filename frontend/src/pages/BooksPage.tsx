import { useState } from "react";
import BookList from "../components/BookList";
import CategoryFilter from "../components/CategoryFilter";
import CartSummary from "../components/CartSummary";

// BooksPage is the main page that holds the book list and filter components
function BooksPage() {
  // ✅ STATE LIVES HERE (shared between components)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">📚 Bookstore</h1>
      <CartSummary />
      <div className="row">
        {/* Filter sidebar */}
        <div className="col-md-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        {/* Book list */}
        <div className="col-md-9">
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
