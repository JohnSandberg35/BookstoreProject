// ─────────────────────────────────────────────────────────────────────────────
// BookList.tsx  (lives in src/components/)
// Displays the paginated, sortable, filterable list of books.
// Uses the centralized fetchBooks() from booksApi (phase6) and supports
// the selectedCategories prop for filtering (mission-12).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import type { Book } from "../types/Book";
import { useCart } from "../context/CartContext";
import { fetchBooks } from "../api/booksApi";

// Props passed in from BooksPage
interface BookListProps {
  selectedCategories: string[]; // Array of active category filters (mission-12)
}

function BookList({ selectedCategories }: BookListProps) {
  // Cart hook so we can add items from this component
  const { addToCart } = useCart();

  // ── State ────────────────────────────────────────────────────────────────
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ── Data Fetching ────────────────────────────────────────────────────────
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        // Pass selectedCategories into the API call for server-side filtering
        const data = await fetchBooks(
          pageSize,
          pageNum,
          sortOrder,
          selectedCategories,
        );
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (err) {
        setError("Could not load books. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]); // Re-run when any filter changes

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Controls ──────────────────────────────────────────────── */}
      <div className="d-flex gap-3 mb-4 align-items-center">
        {/* Sort by title toggle */}
        <div>
          <label className="me-2 fw-bold">Sort by Title:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPageNum(1); // Reset to page 1 on sort change
            }}
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>

        {/* Results per page dropdown */}
        <div>
          <label className="me-2 fw-bold">Results per page:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNum(1); // Reset to page 1 when page size changes
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* ── Loading / Error States ─────────────────────────────────── */}
      {loading && <p>Loading books...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ── Book Cards ────────────────────────────────────────────── */}
      {!loading &&
        !error &&
        books.map((b) => (
          <div className="card mb-3 shadow-sm" key={b.bookId}>
            <div className="card-body">
              <h4 className="card-title">{b.title}</h4>
              <ul className="list-unstyled mb-0">
                <li>
                  <strong>Author:</strong> {b.author}
                </li>
                <li>
                  <strong>Publisher:</strong> {b.publisher}
                </li>
                <li>
                  <strong>ISBN:</strong> {b.isbn}
                </li>
                <li>
                  <strong>Classification:</strong> {b.classification}
                </li>
                <li>
                  <strong>Category:</strong> {b.category}
                </li>
                <li>
                  <strong>Pages:</strong> {b.pageCount}
                </li>
                <li>
                  <strong>Price:</strong> ${b.price.toFixed(2)}
                </li>
              </ul>

              {/* Add to Cart button — from mission-12 */}
              <button
                className="btn btn-success mt-3"
                onClick={() =>
                  addToCart({
                    bookId: b.bookId,
                    title: b.title,
                    price: b.price,
                    quantity: 1,
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}

      {/* ── Pagination ────────────────────────────────────────────── */}
      <div className="d-flex gap-2 mt-4 align-items-center flex-wrap">
        <button
          className="btn btn-outline-primary"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`btn ${pageNum === index + 1 ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setPageNum(index + 1)}
            disabled={pageNum === index + 1}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-primary"
          disabled={pageNum === totalPages}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>
      <br />
    </>
  );
}

export default BookList;
