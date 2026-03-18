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

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(
            int pageSize = 5,       // Default to 5 books per page (assignment requirement)
            int pageNum = 1,        // Default to first page
            string sortOrder = "asc" // Default sort direction for title
        )
        {
            // Start with the full books query
            var query = _bookContext.Books.AsQueryable();

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
    }
}