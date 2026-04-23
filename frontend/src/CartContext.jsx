import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('carrinho_carla');
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carrinho_carla', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert(`${product.title} adicionado! 🛒`);
  };

  // --- NOVA FUNÇÃO ADICIONADA AQUI ---
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Impede quantidade menor que 1
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  // ----------------------------------

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const totalValue = cart.reduce((acc, item) => {
    const priceString = String(item.price || "0");
    const priceClean = priceString.replace(/[^\d,.]/g, '').replace(',', '.');
    const price = parseFloat(priceClean) || 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    // Adicionado updateQuantity no value do Provider
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalValue }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);