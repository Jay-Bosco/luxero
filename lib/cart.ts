import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Watch, CartItem, CartStore } from '@/types';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (watch: Watch) => {
        set((state) => {
          const existingItem = state.items.find(item => item.watch_id === watch.id);
          
          if (existingItem) {
            // Increment quantity if already in cart
            return {
              items: state.items.map(item =>
                item.watch_id === watch.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          
          // Add new item
          return {
            items: [...state.items, { watch_id: watch.id, watch, quantity: 1 }]
          };
        });
      },
      
      removeItem: (watchId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.watch_id !== watchId)
        }));
      },
      
      updateQuantity: (watchId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(watchId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.watch_id === watchId
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      total: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.watch.price * item.quantity),
          0
        );
      },
      
      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      }
    }),
    {
      name: 'luxero-cart',
    }
  )
);

// Helper to format price from cents
export function formatPrice(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
