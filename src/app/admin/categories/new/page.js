"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NewCategoryPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState({
    nameTr: "",
    nameEn: "",
    slug: "",
    image: "/hero.jpg",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const createSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replaceAll("ı", "i")
      .replaceAll("ğ", "g")
      .replaceAll("ü", "u")
      .replaceAll("ş", "s")
      .replaceAll("ö", "o")
      .replaceAll("ç", "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nameTr") {
      setForm((prev) => ({
        ...prev,
        nameTr: value,
        slug: createSlug(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameTr: form.nameTr,
          nameEn: form.nameEn,
          slug: form.slug,
          image: form.image || "/hero.jpg",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Kategori eklenemedi.");
        return;
      }

      router.push("/admin/categories");
      router.refresh();
    } catch {
      setMessage(
        lang === "tr"
          ? "Bir hata oluştu. Lütfen tekrar deneyin."
          : "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] px-6 pt-40 text-white md:px-12">
      <section className="mx-auto max-w-5xl">
        <div className="border-b border-[#c8a45d]/15 pb-10">
          <p className="mb-5 text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
            ADMIN PANEL
          </p>

          <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
            {lang === "tr" ? "Yeni Kategori" : "New Category"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-14 grid gap-8">
          <input
            name="nameTr"
            value={form.nameTr}
            onChange={handleChange}
            type="text"
            placeholder={lang === "tr" ? "Kategori Adı TR" : "Category Name TR"}
            className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
          />

          <input
            name="nameEn"
            value={form.nameEn}
            onChange={handleChange}
            type="text"
            placeholder={lang === "tr" ? "Kategori Adı EN" : "Category Name EN"}
            className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
          />

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            type="text"
            placeholder="Slug örn: takim-elbise"
            className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
          />

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            type="text"
            placeholder="/hero.jpg"
            className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
          />

          <label className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#c8a45d]/30 bg-white/[0.03] px-6 py-14 text-center transition-all duration-500 hover:border-[#c8a45d]">
            <ImagePlus size={38} className="mb-5 text-[#c8a45d]" />

            <span className="text-sm uppercase tracking-[0.3em] text-[#c8a45d]">
              {lang === "tr" ? "Görsel Alanı" : "Image Field"}
            </span>

            <span className="mt-4 text-sm text-[#8f887b]">
              {lang === "tr"
                ? "Şimdilik görsel yolu kullanıyoruz. Örn: /hero.jpg"
                : "For now we use an image path. Example: /hero.jpg"}
            </span>
          </label>

          {message && (
            <p className="border border-[#c8a45d]/20 bg-white/[0.03] px-5 py-4 text-sm text-[#c8a45d]">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="mt-6 border border-[#c8a45d] px-10 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? lang === "tr"
                ? "Kaydediliyor..."
                : "Saving..."
              : lang === "tr"
                ? "Kategoriyi Kaydet"
                : "Save Category"}
          </button>
        </form>
      </section>
    </main>
  );
}
