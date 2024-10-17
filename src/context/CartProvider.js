import React, { createContext, useContext, useState } from 'react';

// Tạo context
const CartProviderContext = createContext();

// Tạo provider
export const CartProvider = ({ children }) => {
    const [previousCart, setPreviousCart] = useState(null);


    return (
        <CartProviderContext.Provider value={{
            previousCart,
            setPreviousCart,
        }}>
            {children}
        </CartProviderContext.Provider>
    );
};

// Hook để sử dụng context
export const useCartContext = () => useContext(CartProviderContext);