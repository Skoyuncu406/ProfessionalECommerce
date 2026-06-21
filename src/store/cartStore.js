import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      setCart: (cart) =>
        set({
          cart: cart || [],
        }),

      addToCart: (product) => {
        const cart = get().cart;
        const exists = cart.find((item) => item.id === product.id);

        if (exists) {
          if (product.stock && exists.quantity >= product.stock) {
            return;
          }

          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });

          return;
        }

        set({
          cart: [
            ...cart,
            {
              ...product,
              quantity: 1,
            },
          ],
        });
      },

      increaseQuantity: (id) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id !== id) return item;

            if (item.stock && item.quantity >= item.stock) {
              return item;
            }

            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }),
        }));
      },

      decreaseQuantity: (id) => {
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => {
        set({
          cart: [],
        });
      },
    }),
    {
      name: "veritas-cart",
    },
  ),
);
