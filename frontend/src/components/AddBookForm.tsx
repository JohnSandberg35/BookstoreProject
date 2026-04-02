// ─────────────────────────────────────────────────────────────────────────────
// AddBookForm.tsx
// A form that lets an admin user fill in details for a brand-new book.
// When submitted, it calls the addBook API function and then triggers
// onSuccess() so the parent page can hide the form and refresh the list.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import type { Book } from "../types/Book";
import { addBook } from "../api/booksApi";

// Props expected by this component
interface AddBookFormProps {
  onSuccess: () => void; // Called after a book is successfully added
  onCancel: () => void; // Called when the user clicks Cancel
}

const AddBookForm = ({ onSuccess, onCancel }: AddBookFormProps) => {
  // Initialize form state with blank/default values
  // BookId is set to 0 — the database will auto-generate the real ID
  const [formData, setFormData] = useState<Book>({
    bookId: 0,
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    classification: "",
    category: "",
    pageCount: 0,
    price: 0,
  });

  // Track any error message to display if the API call fails
  const [error, setError] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // handleChange
  // Updates the matching field in formData whenever the user types.
  // Uses a computed property name [e.target.name] so one handler covers
  // all inputs — no need for a separate handler per field.
  // ─────────────────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Convert numeric fields from string back to the correct type
      [name]: name === "pageCount" || name === "price" ? Number(value) : value,
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // handleSubmit
  // Prevents the default form reload, calls the API, and notifies the parent.
  // ─────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // MUST be first — stops the page from refreshing
    setError(null);

    try {
      await addBook(formData);
      onSuccess(); // Tell the parent to hide this form and refresh the list
    } catch (err) {
      setError("Could not add book. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h4 className="card-title mb-3">Add New Book</h4>

        {/* Show error banner if the API call failed */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Each label wraps its input — keeps label + input visually paired */}

          <div className="mb-2">
            <label className="form-label fw-bold">Title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold">Author</label>
            <input
              className="form-control"
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold">Publisher</label>
            <input
              className="form-control"
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold">ISBN</label>
            <input
              className="form-control"
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold">Classification</label>
            <input
              className="form-control"
              type="text"
              name="classification"
              value={formData.classification}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold">Category</label>
            <input
              className="form-control"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold">Page Count</label>
            <input
              className="form-control"
              type="number"
              name="pageCount"
              value={formData.pageCount}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Price ($)</label>
            <input
              className="form-control"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min={0}
              step={0.01}
              required
            />
          </div>

          {/* Submit and Cancel buttons */}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">
              Add Book
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
