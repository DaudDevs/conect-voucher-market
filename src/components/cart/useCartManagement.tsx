
import { useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  duration: string;
}

export const useCartManagement = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Initialize cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data:", e);
        setCart([]);
      }
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const newCart = cart.map((item) => 
      item.id === productId ? { ...item, quantity } : item
    );
    
    updateCart(newCart);
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter((item) => item.id !== productId);
    updateCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.discount 
        ? item.price * (1 - item.discount / 100) 
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  return {
    cart,
    updateCart,
    updateQuantity,
    removeItem,
    calculateTotal
  };
};
