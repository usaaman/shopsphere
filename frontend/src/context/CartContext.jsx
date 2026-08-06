import { createContext, useState, useEffect, useContext } from 'react';
import { ToastContext } from './ToastContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { showToast } = useContext(ToastContext);

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        showToast(`Increased "${product.name}" quantity to ${existing.quantity + quantity}`);
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      showToast(`Added "${product.name}" to shopping bag`);
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const removed = prev.find((item) => item._id === productId);
      if (removed) {
        showToast(`Removed "${removed.name}" from shopping bag`, 'info');
      }
      return prev.filter((item) => item._id !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    showToast('Shopping bag cleared', 'info');
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};