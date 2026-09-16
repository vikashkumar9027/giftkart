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

  const addToCart = (product, quantity = 1, customization = {}, packaging = {}) => {
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    if (product.stock <= 0) {
      return { success: false, message: 'Sorry, this item is currently out of stock.' };
    }

    let errorMsg = null;
    const cartItemId = `${product._id}_${customization?.customText || ''}_${customization?.recipientName || ''}_${packaging?.name || ''}`.replace(/\s+/g, '-');

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.cartItemId && item.cartItemId === cartItemId) || (!item.cartItemId && item.product === product._id && !customization?.customText)
      );

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
          stock: product.stock,
          price: product.price,
          customization: customization || updated[existingIndex].customization,
          packaging: packaging || updated[existingIndex].packaging,
        };
        return updated;
      } else {
        if (qtyToAdd > product.stock) {
          errorMsg = `Cannot add more. Available stock limit is ${product.stock}.`;
          return prevItems;
        }

        const newItem = {
          cartItemId,
          product: product._id,
          name: product.name,
          price: product.price,
          image: (product.images && product.images[0]) || '',
          stock: product.stock,
          quantity: qtyToAdd,
          customization: {
            recipientName: customization?.recipientName || '',
            customText: customization?.customText || '',
            customPhotoUrl: customization?.customPhotoUrl || '',
            occasionBadge: customization?.occasionBadge || product.occasion || '',
          },
          packaging: {
            name: packaging?.name || '',
            price: Number(packaging?.price) || 0,
            ribbonColor: packaging?.ribbonColor || '',
          },
        };
        return [...prevItems, newItem];
      }
    });

    if (errorMsg) {
      return { success: false, message: errorMsg };
    }
    return { success: true, message: `Added "${product.name}" to your cart.` };
  };

  const updateQuantity = (identifier, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId === identifier || item.product === identifier) {
          const clampedQty = Math.min(qty, item.stock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (identifier) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== identifier && item.product !== identifier)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('giftnest_cart');
  };

  // Calculations: includes individual item packaging costs if configured
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price + (Number(item.packaging?.price) || 0)) * item.quantity,
    0
  );

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

