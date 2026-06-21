import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      setFavorites: (favorites) =>
        set({
          favorites: favorites || [],
        }),

      toggleFavorite: (product) => {
        const favorites = get().favorites;

        const exists = favorites.some((item) => item.id === product.id);

        if (exists) {
          set({
            favorites: favorites.filter((item) => item.id !== product.id),
          });
        } else {
          set({
            favorites: [...favorites, product],
          });
        }
      },

      addFavorite: (product) => {
        const favorites = get().favorites;

        const exists = favorites.some((item) => item.id === product.id);

        if (!exists) {
          set({
            favorites: [...favorites, product],
          });
        }
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== id),
        }));
      },

      clearFavorites: () => {
        set({
          favorites: [],
        });
      },

      isFavorite: (id) => {
        return get().favorites.some((item) => item.id === id);
      },
    }),
    {
      name: "veritas-favorites",
    },
  ),
);
