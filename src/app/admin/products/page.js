"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminProductsPage() {
  const { lang } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const res = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      lang === "tr"
        ? "Bu ürünü silmek istediğinize emin misiniz?"
        : "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        getProducts();
      }
    } catch {
      alert(
        lang === "tr" ? "Ürün silinemedi." : "Product could not be deleted.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] px-6 pt-40 text-white md:px-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 border-b border-[#c8a45d]/15 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
              ADMIN PANEL
            </p>

            <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
              {lang === "tr" ? "Ürün Yönetimi" : "Product Management"}
            </h1>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-3 border border-[#c8a45d] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
          >
            <Plus size={16} />
            {lang === "tr" ? "Yeni Ürün" : "New Product"}
          </Link>
        </div>

        <div className="mt-14">
          {loading ? (
            <p className="text-[#b8b0a1]">
              {lang === "tr" ? "Ürünler yükleniyor..." : "Loading products..."}
            </p>
          ) : products.length === 0 ? (
            <div className="border-t border-[#c8a45d]/20 pt-10">
              <p className="text-[#b8b0a1]">
                {lang === "tr"
                  ? "Henüz ürün eklenmemiş."
                  : "No products have been added yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="grid gap-6 border-t border-[#c8a45d]/15 pt-6 md:grid-cols-[90px_1fr_180px_120px_auto_auto]"
                >
                  <div
                    className="h-28 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${product.image || "/hero.jpg"}')`,
                    }}
                  />

                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#c8a45d]">
                      {product.categoryId}
                    </p>

                    <h2 className="mt-3 text-3xl font-light">
                      {lang === "tr" ? product.nameTr : product.nameEn}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#8f887b]">
                      {lang === "tr"
                        ? product.descriptionTr
                        : product.descriptionEn}
                    </p>
                  </div>

                  <p className="text-[#b8b0a1]">
                    ₺{Number(product.price).toLocaleString("tr-TR")}
                  </p>

                  <p className="text-[#b8b0a1]">
                    {lang === "tr" ? "Stok" : "Stock"}: {product.stock}
                  </p>

                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="flex items-center gap-3 text-[#b8b0a1] transition-all duration-500 hover:text-[#c8a45d]"
                  >
                    <Edit size={16} />
                    {lang === "tr" ? "Düzenle" : "Edit"}
                  </Link>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center gap-3 text-[#b8b0a1] transition-all duration-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                    {lang === "tr" ? "Sil" : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
