// ─────────────────────────────────────────────────────────────────────────────
// CartSummary.tsx
// A compact summary card shown at the top of BooksPage displaying
// the total item count and total price of the current cart.
// ─────────────────────────────────────────────────────────────────────────────

import { useCart } from "../context/CartContext";

function CartSummary() {
  const { cart } = useCart();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">🛒 Cart Summary</h5>
        <p className="mb-1">
          <strong>Items:</strong> {totalQuantity}
        </p>
        <p className="mb-0">
          <strong>Total:</strong> ${totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default CartSummary;
