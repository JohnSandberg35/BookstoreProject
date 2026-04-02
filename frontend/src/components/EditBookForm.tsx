// ─────────────────────────────────────────────────────────────────────────────
// EditBookForm.tsx
// A form pre-populated with an existing book's data that lets an admin
// edit and save changes. Very similar to AddBookForm, but the key difference
// is that formData is initialized from the book prop (not blank defaults),
// and we call updateBook() instead of addBook().
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import type { Book } from "../types/Book";
import { updateBook } from "../api/booksApi";

// Props expected by this component
interface EditBookFormProps {
  book: Book; // The existing book to pre-populate the form with
  onSuccess: () => void; // Called after a successful update
  onCancel: () => void; // Called when the user clicks Cancel
}

const EditBookForm = ({ book, onSuccess, onCancel }: EditBookFormProps) => {
  // Pre-populate form with the existing book's data
  const [formData, setFormData] = useState<Book>({ ...book });

  // Track any error message to display if the API call fails
  const [error, setError] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // handleChange
  // One universal handler for all form inputs.
  // Numeric fields (pageCount, price) are converted from string to number.
  // ─────────────────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pageCount" || name === "price" ? Number(value) : value,
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // handleSubmit
  // Prevents page reload, calls the PUT API, and notifies the parent.
  // ─────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // MUST be first — stops the page from refreshing
    setError(null);

    try {
      await updateBook(formData);
      onSuccess(); // Tell the parent to hide this form and refresh the list
    } catch (err) {
      setError("Could not update book. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="card shadow-sm mb-4 border-warning">
      <div className="card-body">
        <h4 className="card-title mb-3">Edit Book</h4>

        {/* Show error banner if the API call failed */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn btn-warning">
              Save Changes
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

export default EditBookForm;
