// ─────────────────────────────────────────────────────────────────────────────
// booksApi.ts
// Centralizes all HTTP calls to the backend Book API.
// If the base URL ever changes (local → Azure), update it in ONE place here.
// ─────────────────────────────────────────────────────────────────────────────

import type { Book } from "../types/Book";

// Base URL — update this to your Azure backend URL when deploying
const API_URL = "https://localhost:5000/Book";

// Shape of the paginated response from GET /Book/AllBooks
export interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchBooks
// Fetches a paginated, sorted, and optionally category-filtered page of books.
// selectedCategories is an array of category strings (empty = no filter).
// ─────────────────────────────────────────────────────────────────────────────
export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  sortOrder: string,
  selectedCategories: string[] = [], // Optional — from mission-12 category filter
): Promise<FetchBooksResponse> => {
  // Build the category query string (e.g. &categories=Fiction&categories=Drama)
  const categoryParams = selectedCategories
    .map((c) => `categories=${encodeURIComponent(c)}`)
    .join("&");

  const url = `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${categoryParams ? "&" + categoryParams : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch books from the server.");
  }

  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// addBook
// Sends a POST request to create a new book. BookId should be 0 (auto-gen).
// ─────────────────────────────────────────────────────────────────────────────
export const addBook = async (newBook: Book): Promise<Book> => {
  const response = await fetch(`${API_URL}/AddBook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBook),
  });

  if (!response.ok) {
    throw new Error("Failed to add book.");
  }

  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// updateBook
// Sends a PUT request to update an existing book identified by its ID.
// ─────────────────────────────────────────────────────────────────────────────
export const updateBook = async (updatedBook: Book): Promise<Book> => {
  const response = await fetch(`${API_URL}/UpdateBook/${updatedBook.bookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedBook),
  });

  if (!response.ok) {
    throw new Error("Failed to update book.");
  }

  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// deleteBook
// Sends a DELETE request to remove a book from the database by its ID.
// ─────────────────────────────────────────────────────────────────────────────
export const deleteBook = async (bookId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete book.");
  }
};
