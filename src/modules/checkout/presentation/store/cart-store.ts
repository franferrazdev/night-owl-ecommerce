import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CartItem,
  validateItemQuantity,
} from "@/modules/checkout/domain/entities/cart-item";
import { validateStockUsecase } from "@/modules/checkout/domain/usecases/validate-stock.usecase";

interface ActiveCoupon {
  code: string;
  discountPercentage: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  activeCoupon: ActiveCoupon | null; // Estado de cupom ativo
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number, stock: number) => void;
  applyCoupon: (code: string, percentage: number) => void; // Método para aplicar desconto
  removeCoupon: () => void; // Método para reverter desconto
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
      activeCoupon: null,

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      clearCart: () => set({ items: [], activeCoupon: null }),

      applyCoupon: (code, percentage) =>
        set({ activeCoupon: { code, discountPercentage: percentage } }),

      removeCoupon: () => set({ activeCoupon: null }),

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
        const rawTotal = get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );

        const coupon = get().activeCoupon;

        // Se houver cupom ativo, deduz o percentual do valor bruto final
        if (coupon) {
          const discountValue = rawTotal * (coupon.discountPercentage / 100);
          return Math.max(0, rawTotal - discountValue);
        }

        return rawTotal;
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
