// This interface mirrors the Book model from the C# backend
// All field names are camelCase to match how C# serializes JSON automatically
export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}
