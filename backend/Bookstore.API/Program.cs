using Microsoft.EntityFrameworkCore;
using Bookstore.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Register the SQLite database context using the connection string from appsettings.json
builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Register CORS service so we can configure the policy below
builder.Services.AddCors();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// ─────────────────────────────────────────────────────────────────────────────
// CORS Policy
// AllowAnyMethod() is required so that POST, PUT, and DELETE requests from
// the React frontend are not blocked by the browser's same-origin policy.
// AllowAnyHeader() allows Content-Type: application/json headers sent with
// those requests.
//
// When you deploy to Azure, add your live frontend URL to WithOrigins():
//   .WithOrigins("http://localhost:3000", "https://your-app.azurestaticapps.net")
// ─────────────────────────────────────────────────────────────────────────────
app.UseCors(x => x
    .WithOrigins(
        "http://localhost:3000",
        "https://wonderful-rock-0ea2f941e.2.azurestaticapps.net"
    )
    .AllowAnyMethod()
    .AllowAnyHeader()
);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
