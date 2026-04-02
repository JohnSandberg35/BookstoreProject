// ─────────────────────────────────────────────────────────────────────────────
// AdminBooksPage.tsx
// The admin panel where authenticated staff can add, edit, and delete books.
// Shows a full table of all books with Edit and Delete buttons per row,
// and an "Add Book" button that reveals the AddBookForm.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import type { Book } from "../types/Book";
import { fetchBooks, deleteBook } from "../api/booksApi";
import AddBookForm from "../components/AddBookForm";
import EditBookForm from "../components/EditBookForm";

const AdminBooksPage = () => {
  // ── State ────────────────────────────────────────────────────────────────
  const [books, setBooks] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize] = useState<number>(20); // Show more per page in the admin view
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Controls whether the Add form is visible
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Holds the book currently being edited (null = edit form hidden)
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // ── Data Fetching ────────────────────────────────────────────────────────
  // Load books whenever the page number changes
  const loadBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchBooks(pageSize, pageNum, "asc");
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    } catch (err) {
      setError("Could not load books. Is the backend running?");
      console.error(err);
    } finally {
      // Always turn off the loading spinner, success or failure
      setLoading(false);
    }
  };

  // Re-run loadBooks whenever the current page changes
  useEffect(() => {
    loadBooks();
  }, [pageNum]);

  // ── Delete Handler ───────────────────────────────────────────────────────
  const handleDelete = async (bookId: number, title: string) => {
    // Show a confirmation dialog before permanently deleting
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteBook(bookId);
      // Remove the deleted book from state instantly (no need to re-fetch)
      setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
      setTotalItems((prev) => prev - 1);
    } catch (err) {
      alert("Could not delete book. Please try again.");
      console.error(err);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin — Manage Books</h1>

      {/* Show total book count */}
      <p className="text-muted">Total books in database: {totalItems}</p>

      {/* ── Add Book Button / Form ─────────────────────────────────────── */}
      {!showAddForm && !editingBook && (
        <button
          className="btn btn-success mb-4"
          onClick={() => setShowAddForm(true)}
        >
          + Add Book
        </button>
      )}

      {/* Show AddBookForm when the button is clicked */}
      {showAddForm && (
        <AddBookForm
          onSuccess={() => {
            setShowAddForm(false); // Hide the form
            loadBooks(); // Refresh the table
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Show EditBookForm when a row's Edit button is clicked */}
      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null); // Hide the form
            loadBooks(); // Refresh the table
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      {/* ── Loading / Error States ─────────────────────────────────────── */}
      {loading && <p>Loading books...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ── Books Table ───────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                // Each row needs a unique key for React's reconciliation
                <tr key={b.bookId}>
                  <td>{b.bookId}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.publisher}</td>
                  <td>{b.isbn}</td>
                  <td>{b.classification}</td>
                  <td>{b.category}</td>
                  <td>{b.pageCount}</td>
                  <td>${b.price.toFixed(2)}</td>
                  <td>
                    {/* Edit button — populates editingBook to show the form */}
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setShowAddForm(false); // Close add form if open
                        setEditingBook(b);
                      }}
                    >
                      Edit
                    </button>

                    {/* Delete button — calls handleDelete with a confirmation prompt */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(b.bookId, b.title)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="d-flex gap-2 mt-3 flex-wrap">
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
      )}

      <br />
    </div>
  );
};

export default AdminBooksPage;
