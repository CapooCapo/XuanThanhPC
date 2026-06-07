import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '@/services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load initial from local storage to prevent flicker
    const saved = localStorage.getItem('cartState');
    return saved ? JSON.parse(saved) : { items: [], total_price: 0 };
  });
  const [isCartLoading, setIsCartLoading] = useState(true);

  // Sync state to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(cart));
  }, [cart]);

  // Fetch real cart from backend on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsCartLoading(true);
    try {
      const res = await getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch cart', e);
    } finally {
      setIsCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await apiAddToCart({ product: productId, quantity });
      if (res.success && res.data) {
        setCart(res.data);
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (e) {
      console.error('Add to cart failed', e);
      return { success: false, error: e.response?.data?.message || 'Error adding to cart' };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await updateCartItem({ item_id: itemId, quantity });
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (e) {
      console.error('Update cart failed', e);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await removeCartItem({ item_id: itemId });
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (e) {
      console.error('Remove from cart failed', e);
    }
  };

  const clearCart = async () => {
    try {
      const res = await apiClearCart();
      if (res.success) {
        setCart({ items: [], total_price: 0, total_quantity: 0 });
        localStorage.removeItem('cartState');
      }
    } catch (e) {
      console.error('Clear cart failed', e);
      // Fallback
      setCart({ items: [], total_price: 0, total_quantity: 0 });
      localStorage.removeItem('cartState');
    }
  };

  const totalItems = cart?.total_quantity !== undefined 
    ? cart.total_quantity 
    : (cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
  const cartTotal = cart?.total_price || 0;

  return (
    <CartContext.Provider value={{
      cart,
      isCartLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
