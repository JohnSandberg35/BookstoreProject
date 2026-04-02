// ─────────────────────────────────────────────────────────────────────────────
// Navbar.tsx
// Top navigation bar shown on every page.
// Shows the cart item count badge and links to Browse, Cart, and Admin.
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cart } = useCart();

  // Calculate total quantity of items across all cart entries
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Brand / home link */}
        <Link className="navbar-brand" to="/">
          📚 Bookstore
        </Link>

        <div className="d-flex gap-3 align-items-center">
          {/* Browse books link */}
          <Link className="nav-link text-white" to="/">
            Browse
          </Link>

          {/* Admin panel link — added for phase6 */}
          <Link className="nav-link text-white" to="/adminbooks">
            Admin
          </Link>

          {/* Cart button with item count badge */}
          <Link to="/cart" className="btn btn-outline-light position-relative">
            🛒 Cart
            {/* Only show the badge when there are items in the cart */}
            {totalQuantity > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
