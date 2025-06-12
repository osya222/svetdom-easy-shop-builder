export interface Product {
  id: number;
  name: string;
  power: string;
  lightColor: string;
  price: number;
  image: string;
  category: "led" | "emergency" | "decorative" | "set";
  compatibleWith?: number[];
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  getSuggestionToRoundSum: (targetSum: number) => { needed: number; suggestions: Product[] } | null;
}