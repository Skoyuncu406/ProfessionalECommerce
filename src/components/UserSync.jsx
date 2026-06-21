"use client";

import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";

export default function UserSync() {
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const favorites = useFavoriteStore((state) => state.favorites);
  const setFavorites = useFavoriteStore((state) => state.setFavorites);

  const loaded = useRef(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await fetch("/api/user/sync", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setIsLoggedIn(true);
          setCart(data.cart || []);
          setFavorites(data.favorites || []);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        loaded.current = true;
      }
    };

    loadUserData();
  }, [setCart, setFavorites]);

  useEffect(() => {
    if (!loaded.current) return;
    if (!isLoggedIn) return;

    const timer = setTimeout(async () => {
      try {
        await fetch("/api/user/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart,
            favorites,
          }),
        });
      } catch {
        console.log("Kullanıcı verileri kaydedilemedi.");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [cart, favorites, isLoggedIn]);

  return null;
}