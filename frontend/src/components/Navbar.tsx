import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cart } = useCart();

  // Calculate total quantity of items
  const totalQuantity = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand" to="/">
          📚 Bookstore
        </Link>

        {/* Cart button */}
        <Link to="/cart" className="btn btn-outline-light position-relative">
          🛒 Cart
          {/* ✅ Bootstrap Badge (NEW FEATURE) */}
          {totalQuantity > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalQuantity}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
