import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Dynamically initialize cart from localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('ayurcure_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error parsing cart from local storage", error);
            return [];
        }
    });

    // Save to localStorage whenever cart dynamically changes
    useEffect(() => {
        localStorage.setItem('ayurcure_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantityToAdd = 1) => {
        setCartItems(prev => {
            const productId = product.id || product._id;
            const existing = prev.find(item => (item.id || item._id) === productId);
            if (existing) {
                return prev.map(item =>
                    (item.id || item._id) === productId
                        ? { ...item, quantity: (item.quantity || 1) + quantityToAdd }
                        : item
                );
            }
            return [...prev, { ...product, quantity: quantityToAdd }];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prev => {
            if (newQuantity <= 0) return prev.filter(item => (item.id || item._id) !== productId);
            return prev.map(item => 
                (item.id || item._id) === productId ? { ...item, quantity: newQuantity } : item
            );
        });
    };

    // NEW: Function to remove a specific item completely
    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => (item.id || item._id) !== productId));
    };

    // NEW: Function to empty the entire cart after checkout
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('ayurcure_cart');
    };

    // Calculate dynamic cart totals globally
    const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const cartTotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price || item.price_at_purchase || 0);
        return acc + (price * (item.quantity || 1));
    }, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            updateQuantity, 
            removeFromCart, 
            clearCart, 
            cartCount, 
            cartTotal 
        }}>
            {children}
        </CartContext.Provider>
    );
};