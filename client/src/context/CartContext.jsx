import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('giftnest_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to parse cart from storage:', e);
      return [];
    }
  });

  // Save to localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem('giftnest_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    if (product.stock <= 0) {
      return { success: false, message: 'Sorry, this item is currently out of stock.' };
    }

    let errorMsg = null;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product === product._id);

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + qtyToAdd;

        if (newQty > product.stock) {
          errorMsg = `Cannot add more. Available stock limit is ${product.stock}.`;
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          stock: product.stock, // keep stock updated
          price: product.price,
        };
        return updated;
      } else {
        if (qtyToAdd > product.stock) {
          errorMsg = `Cannot add more. Available stock limit is ${product.stock}.`;
          return prevItems;
        }

        const newItem = {
          product: product._id,
          name: product.name,
          price: product.price,
          image: (product.images && product.images[0]) || '',
          stock: product.stock,
          quantity: qtyToAdd,
        };
        return [...prevItems, newItem];
      }
    });

    if (errorMsg) {
      return { success: false, message: errorMsg };
    }
    return { success: true, message: `Added "${product.name}" to your cart.` };
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId) {
          // Cap at available stock
          const clampedQty = Math.min(qty, item.stock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('giftnest_cart');
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
