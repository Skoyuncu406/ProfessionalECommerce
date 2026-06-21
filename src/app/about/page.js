"use client";

import PageHero from "@/components/PageHero";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <PageHero
        image="/hero.jpg"
        eyebrow={lang === "tr" ? "Hikayemiz" : "Our Story"}
        title={lang === "tr" ? "VERITAS Dünyası" : "The World of VERITAS"}
        description={
          lang === "tr"
            ? "Zamansız erkek stilini modern lüks anlayışıyla buluşturan seçkin bir marka deneyimi."
            : "A refined brand experience where timeless menswear meets modern luxury."
        }
      />

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.45em] text-[#c8a45d]">
              {lang === "tr" ? "Felsefe" : "Philosophy"}
            </p>

            <h2 className="text-4xl font-light tracking-[-0.04em] md:text-6xl">
              {lang === "tr"
                ? "Gösterişten uzak, güçlü ve kalıcı bir şıklık."
                : "Quiet, powerful and lasting elegance."}
            </h2>
          </div>

          <div className="border-t border-[#c8a45d]/20 pt-10">
            <p className="leading-8 text-[#b8b0a1]">
              {lang === "tr"
                ? "VERITAS, erkek giyiminde sade lüks anlayışını merkeze alır. Her koleksiyon; kumaş kalitesi, kesim dengesi ve detaylarda gizlenen zarafet ile tasarlanır."
                : "VERITAS centers around understated luxury in menswear. Every collection is shaped by fabric quality, balanced tailoring and elegance hidden in the details."}
            </p>

            <p className="mt-8 leading-8 text-[#b8b0a1]">
              {lang === "tr"
                ? "Amacımız yalnızca kıyafet sunmak değil; güçlü bir duruş, seçkin bir yaşam tarzı ve zamansız bir gardırop oluşturmaktır."
                : "Our purpose is not only to offer clothing, but to create a strong presence, a refined lifestyle and a timeless wardrobe."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
