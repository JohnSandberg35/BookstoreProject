// ─────────────────────────────────────────────────────────────────────────────
// App.tsx
// Root component — sets up routing and wraps the whole app in CartProvider
// so any component can access the cart via useCart().
//
// Routes:
//   /            → BooksPage      (public browsing + category filter + cart)
//   /cart        → CartPage       (shopping cart — from mission-12)
//   /adminbooks  → AdminBooksPage (CRUD admin panel — from phase6)
// ─────────────────────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import BooksPage from "./pages/BooksPage";
import CartPage from "./pages/CartPage";
import AdminBooksPage from "./pages/AdminBooksPage";

function App() {
  return (
    // CartProvider wraps everything so cart state is available site-wide
    <CartProvider>
      <BrowserRouter>
        {/* Navbar appears on every page */}
        <Navbar />

        <Routes>
          {/* Public book browsing page (category filter + cart) */}
          <Route path="/" element={<BooksPage />} />

          {/* Shopping cart page */}
          <Route path="/cart" element={<CartPage />} />

          {/* Admin CRUD panel — TAs will navigate here to test add/edit/delete */}
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
