import React, { createContext, useContext, useState, useCallback } from "react";
import { CartContextType, CartItem, Product } from "@/types/product";
import { products } from "@/data/products";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const getSuggestionToRoundSum = useCallback((targetSum: number) => {
    const needed = targetSum - totalPrice;
    if (needed <= 0) return null;

    // Ищем товары, которые точно дополнят до нужной суммы
    const exactMatches = products.filter(product => product.price === needed);
    if (exactMatches.length > 0) {
      return { needed, suggestions: exactMatches.slice(0, 3) };
    }

    // Ищем товары, цена которых близка к нужной сумме (±20₽)
    const closeMatches = products.filter(product => 
      Math.abs(product.price - needed) <= 20 && product.price <= needed
    );
    
    if (closeMatches.length > 0) {
      return { needed, suggestions: closeMatches.slice(0, 3) };
    }

    // Ищем любые товары дешевле нужной суммы
    const anyMatches = products.filter(product => product.price <= needed);
    return { needed, suggestions: anyMatches.slice(0, 3) };
  }, [totalPrice]);

  const contextValue: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
    getSuggestionToRoundSum
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};