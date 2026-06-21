"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  CircleUserRound,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";

export default function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const { lang, toggleLang } = useLanguage();

  const cart = useCartStore((state) => state.cart);
  const favorites = useFavoriteStore((state) => state.favorites);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favoriteCount = favorites.length;

const links =
  lang === "tr"
    ? [
        { name: "Koleksiyonlar", href: "/products" },
        { name: "Siparişlerim", href: "/orders" },
      ]
    : [
        { name: "Collections", href: "/products" },
        { name: "My Orders", href: "/orders" },
      ];

  const desktopLinks =
    user?.role === "admin"
      ? [
          {
            name: lang === "tr" ? "Yönetim Paneli" : "Dashboard",
            href: "/admin",
          },
        ]
      : links;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 useEffect(() => {
  const getUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  getUser();

  window.addEventListener("focus", getUser);

  return () => {
    window.removeEventListener("focus", getUser);
  };
}, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    window.location.href = `/products?search=${encodeURIComponent(value)}`;

    setSearch("");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
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

    await fetch("/api/auth/logout", {
      method: "POST",
    });

    useCartStore.getState().clearCart();
    useFavoriteStore.getState().clearFavorites();

    localStorage.removeItem("veritas-cart");
    localStorage.removeItem("veritas-favorites");

    setUser(null);
    setMobileOpen(false);

    window.location.href = "/";
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          scrolled || mobileOpen || searchOpen
            ? "border-b border-[#c8a45d]/10 bg-black/55 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto grid h-24 max-w-7xl grid-cols-[180px_1fr_auto] items-center px-6">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block w-[180px] text-xl tracking-[0.4em] text-[#c8a45d] transition-colors duration-500 hover:text-white"
          >
            VERITAS
          </Link>

          <nav className="hidden justify-center gap-8 lg:flex">
            {desktopLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative whitespace-nowrap text-sm uppercase tracking-[0.18em] text-white transition-all duration-500 hover:text-[#c8a45d]"
              >
                {item.name}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#c8a45d] transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center justify-end gap-5 text-white lg:flex">
            <button
              onClick={toggleLang}
              className="text-xs tracking-[0.2em] text-[#c8a45d] transition-all duration-500 hover:text-white"
            >
              {lang === "tr" ? "TR | EN" : "EN | TR"}
            </button>

            {user?.role === "admin" ? (
              <div className="flex items-center gap-5">
                <span className="text-xs uppercase tracking-[0.3em] text-[#8f887b]">
                  ADMIN
                </span>

                <Link
                  href="/admin"
                  className="border-b border-[#c8a45d] pb-1 text-xs uppercase tracking-[0.25em] text-[#c8a45d] transition-all duration-500 hover:text-white"
                >
                  {lang === "tr" ? "Panel" : "Dashboard"}
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-[0.25em] text-[#c8a45d] transition-all duration-500 hover:text-white"
                >
                  {lang === "tr" ? "Çıkış" : "Logout"}
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setSearchOpen(true)}>
                  <Search
                    size={18}
                    className="cursor-pointer transition-all duration-500 hover:text-[#c8a45d]"
                  />
                </button>

                <Link href="/favorites" className="relative">
                  <Heart
                    size={18}
                    className="cursor-pointer transition-all duration-500 hover:text-[#c8a45d]"
                  />

                  {favoriteCount > 0 && (
                    <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#c8a45d] text-[10px] text-black">
                      {favoriteCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="group relative">
                    <button className="flex items-center gap-2 text-[#c8a45d] transition-all duration-500 hover:text-white">
                      <CircleUserRound size={22} />

                      <span className="hidden text-xs uppercase tracking-[0.25em] xl:inline">
                        {lang === "tr" ? "Hesabım" : "Account"}
                      </span>
                    </button>

                    <div className="pointer-events-none absolute right-0 top-full w-56 border border-[#c8a45d]/20 bg-black/80 p-5 opacity-0 backdrop-blur-xl transition-all duration-500 group-hover:pointer-events-auto group-hover:opacity-100">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8f887b]">
                        {lang === "tr" ? "Hoş Geldin" : "Welcome"}
                      </p>

                      <p className="mt-2 truncate text-sm text-[#c8a45d]">
                        {user.name}
                      </p>

                      <div className="my-4 h-px bg-[#c8a45d]/20" />

                      <div className="flex flex-col gap-4">
                        <Link
                          href="/orders"
                          className="text-xs uppercase tracking-[0.25em] text-white transition-all duration-500 hover:text-[#c8a45d]"
                        >
                          {lang === "tr" ? "Siparişlerim" : "My Orders"}
                        </Link>

                        <Link
                          href="/favorites"
                          className="text-xs uppercase tracking-[0.25em] text-white transition-all duration-500 hover:text-[#c8a45d]"
                        >
                          {lang === "tr" ? "Favorilerim" : "My Favorites"}
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="text-left text-xs uppercase tracking-[0.25em] text-white transition-all duration-500 hover:text-[#c8a45d]"
                        >
                          {lang === "tr" ? "Çıkış Yap" : "Logout"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/login">
                    <User
                      size={18}
                      className="cursor-pointer transition-all duration-500 hover:text-[#c8a45d]"
                    />
                  </Link>
                )}

                <Link href="/cart" className="relative">
                  <ShoppingBag
                    size={18}
                    className="cursor-pointer transition-all duration-500 hover:text-[#c8a45d]"
                  />

                  {cartCount > 0 && (
                    <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#c8a45d] text-[10px] text-black">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="group relative z-[80] col-start-3 flex h-12 w-12 items-center justify-center justify-self-end rounded-full border border-[#c8a45d]/40 bg-black/20 backdrop-blur-md transition-all duration-500 hover:border-[#c8a45d] hover:bg-[#c8a45d]/10 lg:hidden"
            aria-label="Menü"
          >
            <span
              className={`absolute h-px w-6 bg-[#c8a45d] transition-all duration-500 ${
                mobileOpen ? "rotate-45" : "-translate-y-2"
              }`}
            />
            <span
              className={`absolute h-px w-6 bg-[#c8a45d] transition-all duration-500 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-px w-6 bg-[#c8a45d] transition-all duration-500 ${
                mobileOpen ? "-rotate-45" : "translate-y-2"
              }`}
            />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 transition-all duration-700 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/35 backdrop-blur-md" />

        <div
          className={`absolute right-0 top-0 h-full w-[82%] border-l border-[#c8a45d]/20 bg-[#080808]/55 backdrop-blur-2xl transition-all duration-700 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col justify-center px-10">
            <div className="mb-12 h-px w-20 bg-[#c8a45d]" />

            <nav className="flex flex-col gap-8">
              {desktopLinks.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-left text-3xl font-light tracking-[-0.04em] text-white transition-all duration-700 hover:translate-x-2 hover:text-[#c8a45d] ${
                    mobileOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{
                    transitionDelay: mobileOpen
                      ? `${index * 90 + 200}ms`
                      : "0ms",
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-14 flex flex-wrap items-center gap-6 text-[#c8a45d]">
              <button
                onClick={toggleLang}
                className="text-xs tracking-[0.3em]"
              >
                {lang === "tr" ? "TR | EN" : "EN | TR"}
              </button>

              {user?.role !== "admin" && (
                <>
                  <button
                    onClick={() => {
                      setSearchOpen(true);
                      setMobileOpen(false);
                    }}
                  >
                    <Search size={18} />
                  </button>

                  <Link
                    href="/favorites"
                    onClick={() => setMobileOpen(false)}
                    className="relative"
                  >
                    <Heart size={18} />

                    {favoriteCount > 0 && (
                      <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#c8a45d] text-[10px] text-black">
                        {favoriteCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {user ? (
                <div className="w-full border-t border-[#c8a45d]/20 pt-6">
                  <div className="mb-6 flex items-center gap-3">
                    <CircleUserRound size={22} />

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8f887b]">
                        {lang === "tr" ? "Hoş Geldin" : "Welcome"}
                      </p>

                      <p className="text-sm text-[#c8a45d]">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {user.role !== "admin" && (
                      <>
                        <Link
                          href="/orders"
                          onClick={() => setMobileOpen(false)}
                          className="text-xs uppercase tracking-[0.25em] text-white"
                        >
                          {lang === "tr" ? "Siparişlerim" : "My Orders"}
                        </Link>

                        <Link
                          href="/favorites"
                          onClick={() => setMobileOpen(false)}
                          className="text-xs uppercase tracking-[0.25em] text-white"
                        >
                          {lang === "tr" ? "Favorilerim" : "My Favorites"}
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="text-left text-xs uppercase tracking-[0.25em] text-white"
                    >
                      {lang === "tr" ? "Çıkış Yap" : "Logout"}
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <User size={18} />
                </Link>
              )}

              {user?.role !== "admin" && (
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="relative"
                >
                  <ShoppingBag size={18} />

                  {cartCount > 0 && (
                    <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#c8a45d] text-[10px] text-black">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-6 backdrop-blur-xl transition-all duration-700 ${
          searchOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <button
          onClick={() => setSearchOpen(false)}
          className="absolute right-8 top-8 text-[#c8a45d] transition-all duration-500 hover:rotate-90 hover:text-white"
          aria-label="Aramayı kapat"
        >
          <X size={30} />
        </button>

        <form
          onSubmit={handleSearchSubmit}
          className={`w-full max-w-3xl transition-all duration-700 ${
            searchOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-6 text-center text-xs uppercase tracking-[0.45em] text-[#c8a45d]">
            {lang === "tr" ? "Ürün Ara" : "Search Products"}
          </p>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus={searchOpen}
            placeholder={
              lang === "tr"
                ? "Takım elbise, gömlek, palto..."
                : "Suit, shirt, coat..."
            }
            className="w-full border-0 border-b border-[#c8a45d]/30 bg-transparent px-2 py-6 text-center text-3xl font-light text-white outline-none placeholder:text-white/25 focus:border-[#c8a45d] md:text-5xl"
          />

          <button className="mx-auto mt-10 block border border-[#c8a45d] px-10 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black">
            {lang === "tr" ? "Ara" : "Search"}
          </button>
        </form>
      </div>
    </>
  );
}