"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem } from "@/types/cart";

const CART_KEY = "lexi_cart";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (product_id: string) => void;
  updateQty: (product_id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (private browsing) — in-memory only
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const addItem = useCallback(
    (incoming: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = incoming.quantity ?? 1;
      setItems((prev) => {
        const existing = prev.find((i) => i.product_id === incoming.product_id);
        const next = existing
          ? prev.map((i) =>
              i.product_id === incoming.product_id
                ? { ...i, quantity: Math.min(99, i.quantity + qty) }
                : i
            )
          : [...prev, { ...incoming, quantity: qty }];
        writeCart(next);
        return next;
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((product_id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product_id !== product_id);
      writeCart(next);
      return next;
    });
  }, []);

  const updateQty = useCallback((product_id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const next = prev.map((i) =>
        i.product_id === product_id ? { ...i, quantity: Math.min(99, quantity) } : i
      );
      writeCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalAmount,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
