import { useCart } from "../context/CartContext";

function CartSummary() {
  const { cart } = useCart();

  // Total quantity
  const totalQuantity = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  // Total price
  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

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
