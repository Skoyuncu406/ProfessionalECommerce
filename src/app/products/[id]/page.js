"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { optimizeImage } from "@/utils/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { lang } = useLanguage();

  const addToCart = useCartStore((state) => state.addToCart);
  const favorites = useFavoriteStore((state) => state.favorites);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    const getProduct = async () => {
      try {
        const [productRes, categoriesRes, userRes] = await Promise.all([
          fetch(`/api/products/${id}`, { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/auth/me", { cache: "no-store" }),
        ]);

        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();
        const userData = await userRes.json();

        if (productData.success) {
          const foundProduct = productData.product;
          setProduct(foundProduct);

          const firstImage =
            foundProduct.image || foundProduct.images?.[0] || "/hero.jpg";

          setActiveImage(firstImage);

          if (categoriesData.success) {
            const category = categoriesData.categories.find(
              (item) => item.slug === foundProduct.categoryId,
            );

            setCategoryName(
              lang === "tr" ? category?.nameTr : category?.nameEn,
            );
          }
        } else {
          setProduct(null);
        }

        if (userData.success) {
          setUser(userData.user);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id, lang]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] text-[#c8a45d]">
        {lang === "tr" ? "Ürün yükleniyor..." : "Loading product..."}
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] text-[#b8b0a1]">
        {lang === "tr" ? "Ürün bulunamadı." : "Product not found."}
      </main>
    );
  }

  const galleryImages = Array.from(
    new Set([product.image, ...(product.images || [])].filter(Boolean)),
  );

  const displayProduct = {
    id: product._id,
    name: lang === "tr" ? product.nameTr : product.nameEn,
    category: categoryName || product.categoryId,
    desc: lang === "tr" ? product.descriptionTr : product.descriptionEn,
    priceText: `₺${Number(product.price).toLocaleString("tr-TR")}`,
    image: optimizeImage(activeImage || product.image || "/hero.jpg", 1000),
    stock: Number(product.stock) || 0,
  };

  const isFavorite = favorites.some((item) => item.id === displayProduct.id);

  const showMessage = (text, duration = 1800) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, duration);
  };

  const handleAddToCart = () => {
    if (displayProduct.stock <= 0) {
      showMessage(
        lang === "tr" ? "Bu ürün stokta yok." : "This product is out of stock.",
      );
      return;
    }

    addToCart({
      id: displayProduct.id,
      name: displayProduct.name,
      category: displayProduct.category,
      price: displayProduct.priceText,
      image: displayProduct.image,
      stock: displayProduct.stock,
    });

    setAdded(true);
    showMessage(
      lang === "tr" ? "Ürün sepete eklendi." : "Product added.",
      1600,
    );

    setTimeout(() => {
      setAdded(false);
    }, 1600);
  };

  const handleFavorite = () => {
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
      id: displayProduct.id,
      name: displayProduct.name,
      category: displayProduct.category,
      price: displayProduct.priceText,
      image: displayProduct.image,
      stock: displayProduct.stock,
    });

    showMessage(
      lang === "tr" ? "Favoriler güncellendi." : "Favorites updated.",
      1600,
    );
  };

  const handleZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <main className="relative min-h-screen bg-[#080808] text-white">
      {message && (
        <div className="fixed right-6 top-28 z-[100] border border-[#c8a45d]/30 bg-black/75 px-6 py-4 text-xs uppercase tracking-[0.22em] text-[#c8a45d] backdrop-blur-xl">
          {message}
        </div>
      )}

      <section className="mx-auto grid min-h-screen max-w-7xl gap-12 px-6 pt-32 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:px-12">
        <div className="relative flex h-[620px] max-h-[75vh] flex-col overflow-hidden bg-black">
          <div
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleZoomMove}
            className="relative flex-1 cursor-zoom-in overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover transition-transform duration-300"
              style={{
                backgroundImage: `url('${displayProduct.image}')`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isZooming ? "scale(2)" : "scale(1)",
                filter: "brightness(1.2) contrast(1.1)",
              }}
            />

            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </div>

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3 border-t border-[#c8a45d]/15 bg-[#080808] p-4 md:grid-cols-5">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => {
                    setActiveImage(image);
                    setIsZooming(false);
                    setZoomPosition({ x: 50, y: 50 });
                  }}
                  className={`relative h-24 overflow-hidden border transition-all duration-500 ${
                    activeImage === image
                      ? "border-[#c8a45d]"
                      : "border-[#c8a45d]/15 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${optimizeImage(image, 300)}')`,
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center px-6 py-32 md:px-16">
          <div className="max-w-xl">
            <p className="mb-5 text-xs uppercase tracking-[0.45em] text-[#c8a45d]">
              {displayProduct.category}
            </p>

            <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
              {displayProduct.name}
            </h1>

            <div className="mt-8 h-px w-28 bg-[#c8a45d]" />

            <p className="mt-8 text-2xl font-light text-[#c8a45d]">
              {displayProduct.priceText}
            </p>

            <p
              className={`mt-4 text-sm uppercase tracking-[0.25em] ${
                displayProduct.stock > 0 ? "text-[#8f887b]" : "text-red-400"
              }`}
            >
              {displayProduct.stock > 0
                ? lang === "tr"
                  ? `Stok: ${displayProduct.stock}`
                  : `Stock: ${displayProduct.stock}`
                : lang === "tr"
                  ? "Stokta Yok"
                  : "Out of Stock"}
            </p>

            <p className="mt-8 leading-8 text-[#b8b0a1]">
              {displayProduct.desc}
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={displayProduct.stock <= 0}
                className={`flex items-center justify-center gap-3 border px-10 py-4 text-xs uppercase tracking-[0.3em] transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-40 ${
                  added
                    ? "border-[#c8a45d] bg-[#c8a45d] text-black"
                    : "border-[#c8a45d] text-[#c8a45d] hover:bg-[#c8a45d] hover:text-black"
                }`}
              >
                {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                {displayProduct.stock <= 0
                  ? lang === "tr"
                    ? "Stokta Yok"
                    : "Out of Stock"
                  : added
                    ? lang === "tr"
                      ? "Eklendi"
                      : "Added"
                    : lang === "tr"
                      ? "Sepete Ekle"
                      : "Add to Cart"}
              </button>

              <button
                onClick={handleFavorite}
                className={`flex items-center justify-center gap-3 px-10 py-4 text-xs uppercase tracking-[0.3em] transition-all duration-500 ${
                  isFavorite
                    ? "text-[#c8a45d]"
                    : "text-white hover:text-[#c8a45d]"
                }`}
              >
                <Heart
                  size={16}
                  className={isFavorite ? "fill-[#c8a45d]" : ""}
                />

                {isFavorite
                  ? lang === "tr"
                    ? "Favoride"
                    : "Favorited"
                  : lang === "tr"
                    ? "Favori"
                    : "Favorite"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
