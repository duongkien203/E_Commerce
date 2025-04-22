import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = (accountId) => {
    if (accountId) {
      fetch(
        `http://localhost/E_Commerce/backend/user/api/CountCartItems.php?id=${accountId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setCartCount(data.data);
          } else {
            setCartCount(0);
          }
        })
        .catch(() => setCartCount(0));
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
