import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate total price
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">🛒 Your Cart</h1>

      {/* If cart is empty */}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.bookId} className="card mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.title}</h5>
                  <p className="mb-1">Price: ${item.price.toFixed(2)}</p>
                  <p className="mb-1">Quantity: {item.quantity}</p>
                  <p className="mb-0">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  className="btn btn-danger"
                  onClick={() => removeFromCart(item.bookId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <h3 className="mt-4">Total: ${total.toFixed(2)}</h3>
        </>
      )}

      {/* Continue Shopping */}
      <button className="btn btn-secondary mt-4" onClick={() => navigate(-1)}>
        Continue Shopping
      </button>
    </div>
  );
}

export default CartPage;
