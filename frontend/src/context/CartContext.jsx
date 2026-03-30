import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCart } from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (user) {
      try {
        const data = await getCart();
        setCartItems(data.items || []);
      } catch (err) {
        console.error('Failed to fetch cart', err);
      }
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
