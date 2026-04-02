using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Data;

namespace Bookstore.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        // Bring in the database context via dependency injection
        private BookstoreDbContext _bookContext;
        public BookController(BookstoreDbContext temp) => _bookContext = temp;

        // ─────────────────────────────────────────────────────────────
        // GET  /Book/AllBooks?pageSize=5&pageNum=1&sortOrder=asc
        // Returns a paginated, sorted list of books plus a total count
        // ─────────────────────────────────────────────────────────────
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(
            int pageSize = 5,        // Default to 5 books per page
            int pageNum = 1,         // Default to first page
            string sortOrder = "asc", // Default sort direction for title
            [FromQuery] List<string>? categories = null
        )
        {
            // Start with the full books query
            var query = _bookContext.Books.AsQueryable();

            // If categories are provided, only include matching books
            if (categories != null && categories.Any())
            {
                query = query.Where(b => categories.Contains(b.Category));
            }

            // Apply sorting by title based on sortOrder parameter
            query = sortOrder == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);

            // Get total count BEFORE applying pagination
            var totalNumBooks = query.Count();

            // Apply pagination using LINQ Skip/Take
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Return both the books list and total count so React can build pagination
            return Ok(new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            });
        }

        // ─────────────────────────────────────────────────────────────
        // GET  /Book/GetCategories
        // Returns a distinct, alphabetized list of all book categories
        // ─────────────────────────────────────────────────────────────
        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(b => b.Category)
                .Where(c => !string.IsNullOrWhiteSpace(c))
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }

        // ─────────────────────────────────────────────────────────────
        // POST  /Book/AddBook
        // Accepts a new Book object from the request body and saves it
        // ─────────────────────────────────────────────────────────────
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            // Add the new book to the database context and save
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();

            // Return 200 OK with the newly created book (includes generated BookId)
            return Ok(newBook);
        }

        // ─────────────────────────────────────────────────────────────
        // PUT  /Book/UpdateBook/{id}
        // Finds an existing book by ID and updates all of its fields
        // ─────────────────────────────────────────────────────────────
        [HttpPut("UpdateBook/{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
        {
            // Look up the existing book in the database
            var existingBook = _bookContext.Books.Find(id);

            // If the book does not exist, return 404
            if (existingBook == null)
            {
                return NotFound($"Book with ID {id} was not found.");
            }

            // Manually update each field with the incoming values
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            // Persist the changes to the database
            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        // ─────────────────────────────────────────────────────────────
        // DELETE  /Book/DeleteBook/{id}
        // Finds a book by ID and removes it from the database
        // ─────────────────────────────────────────────────────────────
        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            // Look up the book to delete
            var book = _bookContext.Books.Find(id);

            // If the book does not exist, return 404
            if (book == null)
            {
                return NotFound($"Book with ID {id} was not found.");
            }

            // Remove the book and save changes
            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            // Return 204 No Content — standard response for a successful DELETE
            return NoContent();
        }
    }
}
