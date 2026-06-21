"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/context/LanguageContext";
import { useFavoriteStore } from "@/store/favoriteStore";

export default function FavoritesPage() {
  const { lang } = useLanguage();
  const favorites = useFavoriteStore((state) => state.favorites);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);
  const clearFavorites = useFavoriteStore((state) => state.clearFavorites);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <PageHero
        image="/hero.jpg"
        eyebrow={lang === "tr" ? "Favoriler" : "Favorites"}
        title={lang === "tr" ? "Favori Ürünler" : "Favorite Items"}
        description={
          lang === "tr"
            ? "Beğendiğiniz seçkin parçaları burada görüntüleyin."
            : "View the refined pieces you have saved."
        }
      />

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          {favorites.length === 0 ? (
            <div className="border-t border-[#c8a45d]/20 pt-10">
              <p className="text-[#b8b0a1]">
                {lang === "tr"
                  ? "Henüz favori ürününüz yok."
                  : "You do not have any favorite items yet."}
              </p>

              <Link
                href="/products"
                className="mt-8 inline-block border border-[#c8a45d] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
              >
                {lang === "tr" ? "Ürünlere Git" : "Go to Products"}
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-6 border-t border-[#c8a45d]/20 pt-8 md:grid-cols-[120px_1fr_auto]"
                >
                  <Link
                    href={`/products/${item.id}`}
                    className="h-36 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${item.image || "/hero.jpg"}')`,
                    }}
                  />

                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#c8a45d]">
                      {item.category}
                    </p>

                    <Link href={`/products/${item.id}`}>
                      <h2 className="mt-3 text-3xl font-light transition-all duration-500 hover:text-[#c8a45d]">
                        {item.name}
                      </h2>
                    </Link>

                    <p className="mt-4 text-[#b8b0a1]">{item.price}</p>
                  </div>

                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="text-[#b8b0a1] transition-all duration-500 hover:text-[#c8a45d]"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <div className="border-t border-[#c8a45d]/20 pt-10">
                <button
                  onClick={clearFavorites}
                  className="px-10 py-4 text-xs uppercase tracking-[0.3em] text-white transition-all duration-500 hover:text-[#c8a45d]"
                >
                  {lang === "tr" ? "Favorileri Temizle" : "Clear Favorites"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
