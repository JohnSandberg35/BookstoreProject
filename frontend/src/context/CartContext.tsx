// ─────────────────────────────────────────────────────────────────────────────
// CartContext.tsx
// Provides global cart state to the entire app via React Context.
// Any component can call useCart() to read or modify the cart.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState } from "react";
import type { CartItem } from "../types/CartItem";

// Define what the context will expose to consumers
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

// Create the context (undefined until the Provider mounts)
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component — wrap App in this so all children can access the cart
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add an item to the cart — if it already exists, increase its quantity
  const addToCart = (item: CartItem) => {
    const existing = cart.find((c) => c.bookId === item.bookId);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.bookId === item.bookId
            ? { ...c, quantity: c.quantity + item.quantity }
            : c,
        ),
      );
    } else {
      setCart([...cart, item]);
    }
  };

  // Remove a single item from the cart by its bookId
  const removeFromCart = (bookId: number) => {
    setCart(cart.filter((c) => c.bookId !== bookId));
  };

  // Clear the entire cart (e.g. after checkout)
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook — throws a helpful error if used outside of CartProvider
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
