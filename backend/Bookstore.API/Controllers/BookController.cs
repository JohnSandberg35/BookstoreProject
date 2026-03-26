using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Data;
using System.Linq;

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
           int pageSize = 5,
           int pageNum = 1,
           string sortOrder = "asc",
           [FromQuery] List<string>? categories = null
       )
        {
            // Start with IQueryable (important for filtering before execution)
            var query = _bookContext.Books.AsQueryable();

            // ✅ Apply category filtering FIRST
            if (categories != null && categories.Any())
            {
                query = query.Where(b => categories.Contains(b.Category));
            }

            // ✅ Apply sorting
            query = sortOrder == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);

            // ✅ Count AFTER filtering (critical for pagination)
            var totalNumBooks = query.Count();

            // ✅ Apply pagination LAST
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Return results
            return Ok(new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            });
        }

        // ✅ NEW ENDPOINT — GET DISTINCT CATEGORIES
        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(categories);
        }
    }
}