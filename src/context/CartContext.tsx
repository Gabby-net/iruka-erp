"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Product } from "@/types/product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];

  addToCart: (
    product: Product,
    quantity?: number
  ) => void;

  removeFromCart: (
    id: number
  ) => void;

  increaseQuantity: (
    id: number
  ) => void;

  decreaseQuantity: (
    id: number
  ) => void;

  clearCart: () => void;

  cartCount: number;

  cartTotal: number;
}

const CartContext =
  createContext<CartContextType>(
    {} as CartContextType
  );

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [cart, setCart] = useState<CartItem[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  /**
   * Load cart from localStorage
   */
  useEffect(() => {

    const stored =
      localStorage.getItem(
        "iruka-cart"
      );

    if (stored) {

      try {

        setCart(
          JSON.parse(stored)
        );

      } catch {

        setCart([]);

      }

    }

    setLoaded(true);

  }, []);

  /**
   * Save cart every time it changes
   */
  useEffect(() => {

    if (!loaded) return;

    localStorage.setItem(
      "iruka-cart",
      JSON.stringify(cart)
    );

  }, [cart, loaded]);

function addToCart(
  product: Product,
  quantity = 1
) {
  setCart((current) => {
    const existing = current.find(
      (item) => item.id === product.id
    );

    if (existing) {
      return current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity:
                item.quantity + quantity,
            }
          : item
      );
    }

    return [
      ...current,
      {
        ...product,
        quantity,
      },
    ];
  });
}

function removeFromCart(id: number) {
  setCart((current) =>
    current.filter(
      (item) => item.id !== id
    )
  );
}

function increaseQuantity(id: number) {
  setCart((current) =>
    current.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity:
              item.quantity + 1,
          }
        : item
    )
  );
}

function decreaseQuantity(id: number) {
  setCart((current) =>
    current
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      )
      .filter(
        (item) => item.quantity > 0
      )
  );
}

function clearCart() {
  setCart([]);
}

const cartCount = cart.reduce(
  (sum, item) =>
    sum + item.quantity,
  0
);

const cartTotal = cart.reduce(
  (sum, item) =>
    sum +
    item.price * item.quantity,
  0
);

return (
  <CartContext.Provider
    value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }}
  >
    {children}
  </CartContext.Provider>
);

}

export function useCart() {
  return useContext(
    CartContext
  );
}