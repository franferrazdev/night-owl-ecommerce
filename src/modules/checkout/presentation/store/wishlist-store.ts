import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";

interface WishlistState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      // Inverte o estado: se o item já existe, ele remove, se não existe, ele adiciona
      toggleFavorite: (id) => {
        const currentIds = get().favoriteIds;
        const exists = currentIds.includes(id);

        if (exists) {
          set({ favoriteIds: currentIds.filter((favId) => favId !== id) });
        } else {
          set({ favoriteIds: [...currentIds, id] });
        }
      },

      isFavorite: (id) => {
        return get().favoriteIds.includes(id);
      },

      clearWishlist: () => set({ favoriteIds: [] }),
    }),
    {
      name: "night-owl-wishlist-storage", // Nome da chave exclusiva gravada no LocalStorage do navegador
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
