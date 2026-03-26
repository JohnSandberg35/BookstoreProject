import { useEffect, useState } from "react";
import type { Book } from "../types/Book";
import { useCart } from "../context/CartContext"; // ✅ NEW

// ✅ Props interface
interface BookListProps {
  selectedCategories: string[];
}

function BookList({ selectedCategories }: BookListProps) {
  // ✅ Cart hook
  const { addToCart } = useCart();

  // State variables for books data, pagination, and sorting
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((c) => `categories=${encodeURIComponent(c)}`)
        .join("&");

      const response = await fetch(
        `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}&${categoryParams}`,
      );

      const data = await response.json();

      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]);

  return (
    <>
      {/* Sorting and results per page controls */}
      <div className="d-flex gap-3 mb-4 align-items-center">
        <div>
          <label className="me-2 fw-bold">Sort by Title:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPageNum(1);
            }}
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>

        <div>
          <label className="me-2 fw-bold">Results per page:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNum(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* Book cards */}
      {books.map((b) => (
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

            {/* ✅ ADD TO CART BUTTON */}
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

      {/* Pagination */}
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
            className={`btn ${
              pageNum === index + 1 ? "btn-primary" : "btn-outline-primary"
            }`}
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
