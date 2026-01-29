'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Watch } from '@/types';

interface CartItem {
  watch: Watch;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (watch: Watch) => void;
  removeItem: (watchId: string) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('luxero-cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Make sure it's an array
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse cart:', e);
      localStorage.removeItem('luxero-cart');
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('luxero-cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (watch: Watch) => {
    setItems(prev => {
      const currentItems = Array.isArray(prev) ? prev : [];
      const existingItem = currentItems.find(item => item.watch.id === watch.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.watch.id === watch.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { watch, quantity: 1 }];
    });
  };

  const removeItem = (watchId: string) => {
    setItems(prev => {
      const currentItems = Array.isArray(prev) ? prev : [];
      return currentItems.filter(item => item.watch.id !== watchId);
    });
  };

  const updateQuantity = (watchId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(watchId);
      return;
    }
    setItems(prev => {
      const currentItems = Array.isArray(prev) ? prev : [];
      return currentItems.map(item =>
        item.watch.id === watchId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  // Safely calculate total and itemCount
  const safeItems = Array.isArray(items) ? items : [];
  const total = safeItems.reduce((sum, item) => sum + (item.watch?.price || 0) * (item.quantity || 0), 0);
  const itemCount = safeItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        items: safeItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}