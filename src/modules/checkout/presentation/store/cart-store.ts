import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CartItem,
  validateItemQuantity,
} from "@/modules/checkout/domain/entities/cart-item";
import { validateStockUsecase } from "@/modules/checkout/domain/usecases/validate-stock.usecase";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number, stock: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      clearCart: () => set({ items: [] }),

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === newItem.id,
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;
          const updatedItems = validateStockUsecase({
            currentItems,
            productId: newItem.id,
            targetQuantity: newQuantity,
            stockAvailable: newItem.stock,
          });
          set({ items: updatedItems });
        } else {
          const safeQuantity = validateItemQuantity(1, newItem.stock);
          set({
            items: [...currentItems, { ...newItem, quantity: safeQuantity }],
          });
        }
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity, stock) => {
        const currentItems = get().items;
        const updatedItems = validateStockUsecase({
          currentItems,
          productId: id,
          targetQuantity: quantity,
          stockAvailable: stock,
        });
        set({ items: updatedItems });
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getTotalItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "night-owl-cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
