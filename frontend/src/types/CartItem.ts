// CartItem.ts
// Represents a single item in the shopping cart.
// Note: this is separate from Book because it includes a quantity field.
export interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
}
