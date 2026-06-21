"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { lang } = useLanguage();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    nameTr: "",
    nameEn: "",
    descriptionTr: "",
    descriptionEn: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "/hero.jpg",
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`, { cache: "no-store" }),
          fetch("/api/admin/categories", { cache: "no-store" }),
        ]);

        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();

        if (categoriesData.success) {
          setCategories(categoriesData.categories);
        }

        if (productData.success) {
          const product = productData.product;

          setForm({
            nameTr: product.nameTr || "",
            nameEn: product.nameEn || "",
            descriptionTr: product.descriptionTr || "",
            descriptionEn: product.descriptionEn || "",
            price: product.price || "",
            stock: product.stock || "",
            categoryId: product.categoryId || "",
            image: product.image || "/hero.jpg",
            images: product.images || [],
          });
        } else {
          setMessage(productData.message || "Ürün bulunamadı.");
        }
      } catch {
        setMessage(
          lang === "tr"
            ? "Ürün bilgileri alınamadı."
            : "Product data could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id, lang]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Görsel yüklenemedi.");
    }

    return data.url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const url = await uploadFile(file);

      setForm((prev) => ({
        ...prev,
        image: url,
        images: prev.images.includes(url) ? prev.images : [url, ...prev.images],
      }));
    } catch (error) {
      setMessage(
        lang === "tr"
          ? error.message || "Görsel yüklenirken hata oluştu."
          : "Image upload failed.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setUploading(true);
    setMessage("");

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const url = await uploadFile(file);
        uploadedUrls.push(url);
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        image:
          prev.image === "/hero.jpg" && uploadedUrls[0]
            ? uploadedUrls[0]
            : prev.image,
      }));
    } catch {
      setMessage(
        lang === "tr"
          ? "Çoklu görsel yüklenirken hata oluştu."
          : "Multiple image upload failed.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeGalleryImage = (image) => {
    setForm((prev) => {
      const nextImages = prev.images.filter((item) => item !== image);

      return {
        ...prev,
        images: nextImages,
        image: prev.image === image ? nextImages[0] || "/hero.jpg" : prev.image,
      };
    });
  };

  const setMainImage = (image) => {
    setForm((prev) => ({
      ...prev,
      image,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Ürün güncellenemedi.");
        return;
      }

      router.push("/admin/products");
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
        {lang === "tr" ? "Ürün yükleniyor..." : "Loading product..."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] px-6 pt-40 text-white md:px-12">
      <section className="mx-auto max-w-6xl">
        <div className="border-b border-[#c8a45d]/15 pb-10">
          <p className="mb-5 text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
            ADMIN PANEL / {form.nameTr || id}
          </p>

          <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
            {lang === "tr" ? "Ürün Düzenle" : "Edit Product"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-14 grid gap-10">
          <div className="grid gap-8 md:grid-cols-2">
            <input
              name="nameTr"
              value={form.nameTr}
              onChange={handleChange}
              placeholder={lang === "tr" ? "Ürün Adı TR" : "Product Name TR"}
              className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            />

            <input
              name="nameEn"
              value={form.nameEn}
              onChange={handleChange}
              placeholder={lang === "tr" ? "Ürün Adı EN" : "Product Name EN"}
              className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full border-0 border-b border-[#c8a45d]/20 bg-[#080808] py-5 text-[#c8a45d] outline-none focus:border-[#c8a45d]"
            >
              <option value="" className="bg-[#080808] text-[#c8a45d]">
                {lang === "tr" ? "Kategori Seç" : "Select Category"}
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category.slug}
                  className="bg-[#080808] text-white"
                >
                  {lang === "tr" ? category.nameTr : category.nameEn}
                </option>
              ))}
            </select>

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              placeholder={lang === "tr" ? "Fiyat" : "Price"}
              className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            />

            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              type="number"
              placeholder={lang === "tr" ? "Stok" : "Stock"}
              className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <textarea
              name="descriptionTr"
              value={form.descriptionTr}
              onChange={handleChange}
              rows="5"
              placeholder={
                lang === "tr" ? "Ürün Açıklaması TR" : "Product Description TR"
              }
              className="w-full resize-none border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            />

            <textarea
              name="descriptionEn"
              value={form.descriptionEn}
              onChange={handleChange}
              rows="5"
              placeholder={
                lang === "tr" ? "Ürün Açıklaması EN" : "Product Description EN"
              }
              className="w-full resize-none border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
            <div
              className="h-64 bg-cover bg-center"
              style={{
                backgroundImage: `url('${form.image || "/hero.jpg"}')`,
              }}
            />

            <label className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#c8a45d]/30 bg-white/[0.03] px-6 py-16 text-center transition-all duration-500 hover:border-[#c8a45d]">
              <ImagePlus
                size={38}
                className="mb-5 text-[#c8a45d] transition-all duration-500 group-hover:scale-110"
              />

              <span className="text-sm uppercase tracking-[0.3em] text-[#c8a45d]">
                {uploading
                  ? lang === "tr"
                    ? "Yükleniyor..."
                    : "Uploading..."
                  : lang === "tr"
                    ? "Ana Ürün Görseli Yükle"
                    : "Upload Main Product Image"}
              </span>

              <span className="mt-4 max-w-md text-sm leading-7 text-[#8f887b]">
                {lang === "tr"
                  ? "Ana ürün görselini seçin. Bu görsel liste ve detay kapaklarında kullanılır."
                  : "Choose the main product image. It will be used as the product cover."}
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="/hero.jpg"
            className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
          />

          <label className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#c8a45d]/30 bg-white/[0.03] px-6 py-14 text-center transition-all duration-500 hover:border-[#c8a45d]">
            <ImagePlus size={34} className="mb-5 text-[#c8a45d]" />

            <span className="text-sm uppercase tracking-[0.3em] text-[#c8a45d]">
              {uploading
                ? lang === "tr"
                  ? "Yükleniyor..."
                  : "Uploading..."
                : lang === "tr"
                  ? "Çoklu Ürün Görseli Yükle"
                  : "Upload Multiple Product Images"}
            </span>

            <span className="mt-4 max-w-md text-sm leading-7 text-[#8f887b]">
              {lang === "tr"
                ? "Birden fazla ürün görseli seçebilirsiniz."
                : "You can select multiple product images."}
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleImageUpload}
              className="hidden"
            />
          </label>

          {form.images.length > 0 && (
            <div className="grid gap-4 md:grid-cols-4">
              {form.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`relative h-40 overflow-hidden border ${
                    form.image === image
                      ? "border-[#c8a45d]"
                      : "border-[#c8a45d]/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(image)}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center bg-black/70 text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
                  >
                    <X size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMainImage(image)}
                    className="absolute bottom-2 left-2 z-10 bg-black/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
                  >
                    {form.image === image
                      ? lang === "tr"
                        ? "Ana Görsel"
                        : "Main"
                      : lang === "tr"
                        ? "Ana Yap"
                        : "Set Main"}
                  </button>

                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${image}')`,
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {message && (
            <p className="border border-[#c8a45d]/20 bg-white/[0.03] px-5 py-4 text-sm text-[#c8a45d]">
              {message}
            </p>
          )}

          <button
            disabled={saving || uploading}
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
