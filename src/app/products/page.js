"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import PageHero from "@/components/PageHero";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { optimizeImage } from "@/utils/image";

export default function ProductsPage() {
  const { lang } = useLanguage();

  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const addToCart = useCartStore((state) => state.addToCart);
  const favorites = useFavoriteStore((state) => state.favorites);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [addedId, setAddedId] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPageData = async () => {
      try {
        const [productsRes, categoriesRes, userRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/auth/me", { cache: "no-store" }),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const userData = await userRes.json();

        if (productsData.success) {
          setProducts(productsData.products);
        }

        if (categoriesData.success) {
          setCategories(categoriesData.categories);
        }

        if (userData.success) {
          setUser(userData.user);
        }
      } catch {
        setProducts([]);
        setCategories([]);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getPageData();
  }, []);

  const showMessage = (text, duration = 1800) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, duration);
  };

  const categoryLinks = [
    {
      id: "all",
      name: lang === "tr" ? "Tümü" : "All",
    },
    ...categories.map((category) => ({
      id: category.slug,
      name: lang === "tr" ? category.nameTr : category.nameEn,
    })),
  ];

  const formattedProducts = products.map((product) => {
    const category = categories.find(
      (item) => item.slug === product.categoryId,
    );

    return {
      ...product,
      id: product._id,
      name: lang === "tr" ? product.nameTr : product.nameEn,
      categoryName:
        lang === "tr"
          ? category?.nameTr || product.categoryId
          : category?.nameEn || product.categoryId,
      priceText: `₺${Number(product.price).toLocaleString("tr-TR")}`,
      image: optimizeImage(product.image || "/hero.jpg", 700),
      stock: Number(product.stock) || 0,
    };
  });

  const filteredProducts = formattedProducts.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.categoryId === activeCategory;

    const matchesSearch =
      !searchQuery ||
      product.name?.toLowerCase().includes(searchQuery) ||
      product.categoryName?.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      showMessage(
        lang === "tr" ? "Bu ürün stokta yok." : "This product is out of stock.",
      );
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      category: product.categoryName,
      price: product.priceText,
      image: product.image,
      stock: product.stock,
    });

    setAddedId(product.id);
    showMessage(
      lang === "tr" ? "Ürün sepete eklendi." : "Product added.",
      1600,
    );

    setTimeout(() => {
      setAddedId(null);
    }, 1600);
  };

  const handleFavorite = (product) => {
    if (!user) {
      showMessage(
        lang === "tr"
          ? "Favorilere eklemek için giriş yapmalısınız."
          : "You must sign in to add favorites.",
        2000,
      );
      return;
    }

    toggleFavorite({
      id: product.id,
      name: product.name,
      category: product.categoryName,
      price: product.priceText,
      image: product.image,
      stock: product.stock,
    });

    showMessage(
      lang === "tr" ? "Favoriler güncellendi." : "Favorites updated.",
      1600,
    );
  };

  return (
    <main className="relative min-h-screen bg-[#080808] text-white">
      {message && (
        <div className="fixed right-6 top-28 z-[100] border border-[#c8a45d]/30 bg-black/75 px-6 py-4 text-xs uppercase tracking-[0.22em] text-[#c8a45d] backdrop-blur-xl">
          {message}
        </div>
      )}

      <PageHero
        image="/hero.jpg"
        eyebrow={lang === "tr" ? "Koleksiyonlar" : "Collections"}
        title={lang === "tr" ? "Ürünler" : "Products"}
        description={
          lang === "tr"
            ? "Premium erkek giyim koleksiyonunu keşfedin."
            : "Discover our premium menswear collection."
        }
      />

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          {searchQuery && (
            <div className="mb-10 flex flex-col gap-5 border-b border-[#c8a45d]/15 pb-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm tracking-[0.2em] text-[#b8b0a1]">
                {lang === "tr" ? "Arama sonucu:" : "Search result:"}{" "}
                <span className="text-[#c8a45d]">{searchQuery}</span>
              </p>

              <Link
                href={
                  activeCategory === "all"
                    ? "/products"
                    : `/products?category=${activeCategory}`
                }
                className="inline-flex w-fit border border-[#c8a45d]/40 px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
              >
                {lang === "tr" ? "Aramayı Temizle" : "Clear Search"}
              </Link>
            </div>
          )}

          <div className="mb-16 flex flex-wrap gap-6 border-b border-[#c8a45d]/15 pb-8">
            {categoryLinks.map((category) => (
              <Link
                key={category.id}
                href={
                  category.id === "all"
                    ? "/products"
                    : `/products?category=${category.id}`
                }
                className={`text-xs uppercase tracking-[0.3em] transition-all duration-500 ${
                  activeCategory === category.id
                    ? "text-[#c8a45d]"
                    : "text-[#8f887b] hover:text-[#c8a45d]"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {loading ? (
            <p className="text-[#b8b0a1]">
              {lang === "tr" ? "Ürünler yükleniyor..." : "Loading products..."}
            </p>
          ) : filteredProducts.length === 0 ? (
            <div className="border-t border-[#c8a45d]/20 pt-10">
              <p className="text-[#b8b0a1]">
                {lang === "tr" ? "Ürün bulunamadı." : "No products found."}
              </p>
            </div>
          ) : (
            <div className="grid gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => {
                const isFavorite = favorites.some(
                  (item) => item.id === product.id,
                );

                return (
                  <article key={product.id} className="group">
                    <Link href={`/products/${product.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: `url('${product.image}')`,
                            filter:
                              index % 2 === 0
                                ? "brightness(1.05) contrast(1.08)"
                                : "brightness(0.9) contrast(1.12)",
                          }}
                        />

                        <div className="absolute inset-0 bg-black/20 transition-all duration-700 group-hover:bg-black/5" />

                        {product.stock <= 0 && (
                          <div className="absolute left-5 top-5 z-10 border border-red-500/30 bg-black/70 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-red-400 backdrop-blur-xl">
                            {lang === "tr" ? "Stokta Yok" : "Out of Stock"}
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 transition-all duration-700 group-hover:opacity-100">
                          <span className="inline-block border border-[#c8a45d] px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-[#c8a45d] transition-all duration-500 group-hover:bg-[#c8a45d] group-hover:text-black">
                            {lang === "tr" ? "İncele" : "View"}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-6 border-t border-[#c8a45d]/15 pt-5">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8a45d]">
                            {product.categoryName || product.categoryId}
                          </p>

                          <Link href={`/products/${product.id}`}>
                            <h2 className="mt-3 text-2xl font-light tracking-[-0.03em] transition-all duration-500 hover:text-[#c8a45d]">
                              {product.name}
                            </h2>
                          </Link>

                          <p
                            className={`mt-3 text-[10px] uppercase tracking-[0.25em] ${
                              product.stock > 0
                                ? "text-[#8f887b]"
                                : "text-red-400"
                            }`}
                          >
                            {product.stock > 0
                              ? lang === "tr"
                                ? `Stok: ${product.stock}`
                                : `Stock: ${product.stock}`
                              : lang === "tr"
                                ? "Stokta Yok"
                                : "Out of Stock"}
                          </p>
                        </div>

                        <p className="whitespace-nowrap text-sm text-[#b8b0a1]">
                          {product.priceText}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                          className={`flex flex-1 items-center justify-center gap-3 border px-5 py-3 text-[10px] uppercase tracking-[0.25em] transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-40 ${
                            addedId === product.id
                              ? "border-[#c8a45d] bg-[#c8a45d] text-black"
                              : "border-[#c8a45d] text-[#c8a45d] hover:bg-[#c8a45d] hover:text-black"
                          }`}
                        >
                          {addedId === product.id ? (
                            <Check size={15} />
                          ) : (
                            <ShoppingBag size={15} />
                          )}

                          {product.stock <= 0
                            ? lang === "tr"
                              ? "Stokta Yok"
                              : "Out"
                            : addedId === product.id
                              ? lang === "tr"
                                ? "Eklendi"
                                : "Added"
                              : lang === "tr"
                                ? "Sepete Ekle"
                                : "Add"}
                        </button>

                        <button
                          onClick={() => handleFavorite(product)}
                          className={`flex flex-1 items-center justify-center gap-3 border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.25em] transition-all duration-500 ${
                            isFavorite
                              ? "text-[#c8a45d]"
                              : "text-white hover:border-[#c8a45d]/40 hover:text-[#c8a45d]"
                          }`}
                        >
                          <Heart
                            size={15}
                            className={isFavorite ? "fill-[#c8a45d]" : ""}
                          />

                          {lang === "tr" ? "Favori" : "Favorite"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
