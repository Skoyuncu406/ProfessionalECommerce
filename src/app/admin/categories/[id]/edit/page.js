"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { lang } = useLanguage();

  const [form, setForm] = useState({
    nameTr: "",
    nameEn: "",
    slug: "",
    image: "/hero.jpg",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setForm({
            nameTr: data.category.nameTr || "",
            nameEn: data.category.nameEn || "",
            slug: data.category.slug || "",
            image: data.category.image || "/hero.jpg",
          });
        } else {
          setMessage(data.message || "Kategori bulunamadı.");
        }
      } catch {
        setMessage(
          lang === "tr"
            ? "Kategori bilgileri alınamadı."
            : "Category data could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    };

    getCategory();
  }, [id, lang]);

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
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Kategori güncellenemedi.");
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
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] text-[#c8a45d]">
        {lang === "tr" ? "Kategori yükleniyor..." : "Loading category..."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] px-6 pt-40 text-white md:px-12">
      <section className="mx-auto max-w-5xl">
        <div className="border-b border-[#c8a45d]/15 pb-10">
          <p className="mb-5 text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
            ADMIN PANEL / {form.slug}
          </p>

          <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
            {lang === "tr" ? "Kategori Düzenle" : "Edit Category"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-14 grid gap-8">
          <input
            name="nameTr"
            value={form.nameTr}
            onChange={handleChange}
            className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            placeholder={lang === "tr" ? "Kategori Adı TR" : "Category Name TR"}
          />

          <input
            name="nameEn"
            value={form.nameEn}
            onChange={handleChange}
            className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            placeholder={lang === "tr" ? "Kategori Adı EN" : "Category Name EN"}
          />

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            placeholder="Slug"
          />

          <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
            <div
              className="h-56 bg-cover bg-center"
              style={{ backgroundImage: `url('${form.image || "/hero.jpg"}')` }}
            />

            <label className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#c8a45d]/30 bg-white/[0.03] px-6 py-16 text-center transition-all duration-500 hover:border-[#c8a45d]">
              <ImagePlus size={38} className="mb-5 text-[#c8a45d]" />

              <span className="text-sm uppercase tracking-[0.3em] text-[#c8a45d]">
                {lang === "tr" ? "Görsel Yolu" : "Image Path"}
              </span>

              <span className="mt-4 text-sm text-[#8f887b]">
                {lang === "tr"
                  ? "Alt alandaki görsel yolunu değiştirin."
                  : "Update the image path below."}
              </span>
            </label>
          </div>

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            placeholder="/hero.jpg"
          />

          {message && (
            <p className="border border-[#c8a45d]/20 bg-white/[0.03] px-5 py-4 text-sm text-[#c8a45d]">
              {message}
            </p>
          )}

          <button
            disabled={saving}
            className="mt-6 border border-[#c8a45d] px-10 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? lang === "tr"
                ? "Kaydediliyor..."
                : "Saving..."
              : lang === "tr"
                ? "Değişiklikleri Kaydet"
                : "Save Changes"}
          </button>
        </form>
      </section>
    </main>
  );
}
