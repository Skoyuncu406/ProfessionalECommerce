"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { lang, t } = useLanguage();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 25;
      const y = (e.clientY / window.innerHeight - 0.5) * 25;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const collections =
    lang === "tr"
      ? [
          {
            title: "Takım Elbise",
            desc: "Keskin siluet, güçlü duruş.",
            href: "/products?category=suits",
          },
          {
            title: "Gömlek",
            desc: "İnce dokular, kusursuz detay.",
            href: "/products?category=shirts",
          },
          {
            title: "Dış Giyim",
            desc: "Soğuk sezona sofistike katmanlar.",
            href: "/products?category=outerwear",
          },
        ]
      : [
          {
            title: "Suits",
            desc: "Sharp silhouette, powerful presence.",
            href: "/products?category=suits",
          },
          {
            title: "Shirts",
            desc: "Fine textures, flawless details.",
            href: "/products?category=shirts",
          },
          {
            title: "Outerwear",
            desc: "Sophisticated layers for the cold season.",
            href: "/products?category=outerwear",
          },
        ];

  return (
    <main className="bg-[#080808] text-white">
      <section className="relative h-screen overflow-hidden bg-black">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            backgroundImage: "url('/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translate(${position.x}px, ${position.y}px) scale(1.12)`,
            filter: "brightness(1.35) contrast(1.15) saturate(1.08)",
          }}
        />

        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />

        <section className="relative z-10 flex h-screen items-center">
          <div className="mx-auto w-full max-w-7xl px-8">
            <div className="max-w-2xl">
              <p className="mb-6 text-xs uppercase tracking-[0.55em] text-[#c8a45d]">
                {t.premium}
              </p>

              <h1 className="text-5xl font-light leading-none tracking-[-0.05em] text-white md:text-8xl">
                {t.title1}
                <br />
                {t.title2}
              </h1>

              <div className="mt-8 h-px w-28 bg-[#c8a45d]" />

              <p className="mt-8 max-w-xl text-lg leading-9 text-gray-200">
                {t.desc}
              </p>

              <div className="mt-12 flex flex-col gap-5 sm:flex-row">
                <Link
                  href="/products"
                  className="border border-[#c8a45d] px-10 py-4 text-center text-xs uppercase tracking-[0.35em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
                >
                  {t.collection}
                </Link>

                <Link
                  href="/about"
                  className="px-10 py-4 text-center text-xs uppercase tracking-[0.35em] text-white transition-all duration-500 hover:text-[#c8a45d]"
                >
                  {t.story}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 md:block">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#c8a45d]">
              Scroll
            </span>
            <div className="h-12 w-px bg-[#c8a45d]/70" />
          </div>
        </div>
      </section>

      <section className="border-y border-[#c8a45d]/15 px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.45em] text-[#c8a45d]">
              {lang === "tr" ? "İmza Koleksiyon" : "The Signature"}
            </p>

            <h2 className="text-4xl font-light tracking-[-0.04em] md:text-6xl">
              {lang === "tr"
                ? "Modern erkek gardırobuna lüks bir yorum."
                : "A luxury interpretation of the modern men's wardrobe."}
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-8 text-[#b8b0a1] md:text-lg">
            {lang === "tr"
              ? "Koleksiyonlarımız, zamansız çizgileri çağdaş detaylarla birleştirir. Her parça; kumaş kalitesi, kesim dengesi ve sade şıklık anlayışıyla seçkin bir duruş sunar."
              : "Our collections combine timeless lines with contemporary details. Each piece offers a refined presence through fabric quality, balanced cuts and understated elegance."}
          </p>
        </div>
      </section>

      <section className="px-6 py-28 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex items-end justify-between gap-8">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.45em] text-[#c8a45d]">
                {lang === "tr" ? "Koleksiyonlar" : "Collections"}
              </p>

              <h2 className="text-4xl font-light tracking-[-0.04em] md:text-6xl">
                {lang === "tr" ? "Sezonun Öne Çıkanları" : "Season Highlights"}
              </h2>
            </div>

            <Link
              href="/products"
              className="hidden border-b border-[#c8a45d] pb-2 text-xs uppercase tracking-[0.3em] text-[#c8a45d] md:block"
            >
              {lang === "tr" ? "Tümünü Gör" : "View All"}
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {collections.map((item) => (
              <Link
                href={item.href}
                key={item.title}
                className="group border-t border-[#c8a45d]/20 pt-8"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-3xl font-light tracking-[-0.03em]">
                      {item.title}
                    </h3>

                    <p className="mt-5 leading-7 text-[#9b9588]">{item.desc}</p>
                  </div>

                  <span className="text-[#c8a45d] transition-all duration-500 group-hover:translate-x-2">
                    →
                  </span>
                </div>

                <div className="mt-10 h-px w-0 bg-[#c8a45d] transition-all duration-700 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[75vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/hero.jpg')",
            filter: "brightness(1.15) contrast(1.08)",
          }}
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex min-h-[75vh] items-center justify-center px-6 text-center">
          <div className="max-w-3xl">
            <p className="mb-6 text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
              {lang === "tr" ? "Yeni Sezon" : "New Season"}
            </p>

            <h2 className="text-5xl font-light leading-tight tracking-[-0.05em] md:text-7xl">
              {lang === "tr"
                ? "Şıklık, detaylarda saklıdır."
                : "Elegance lives in the details."}
            </h2>

            <p className="mx-auto mt-8 max-w-xl leading-8 text-gray-300">
              {lang === "tr"
                ? "İş hayatından özel davetlere uzanan seçkin parçalarla stilini sade ama güçlü bir çizgide yeniden tanımla."
                : "Redefine your style with refined pieces extending from business life to special occasions."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
