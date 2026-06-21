"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLoginPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Giriş başarısız.");
        return;
      }

      if (data.user?.role !== "admin") {
        setMessage(
          lang === "tr"
            ? "Bu alana yalnızca yöneticiler giriş yapabilir."
            : "Only administrators can access this area.",
        );
        return;
      }

      window.location.href = "/admin";
    } catch (error) {
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
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero.jpg')",
          filter: "brightness(0.9) contrast(1.1)",
        }}
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex min-h-screen items-center px-6 md:px-12">
        <div className="mx-auto grid w-full max-w-7xl gap-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
              ADMIN PANEL
            </p>

            <h1 className="text-5xl font-light tracking-[-0.05em] text-white md:text-7xl">
              {lang === "tr" ? "Yönetim Merkezi" : "Management Center"}
            </h1>

            <div className="mt-8 h-px w-24 bg-[#c8a45d]" />

            <p className="mt-8 max-w-xl text-lg leading-9 text-gray-300">
              {lang === "tr"
                ? "Ürünleri, kategorileri, siparişleri ve müşteri hesaplarını tek bir merkezden yönetin."
                : "Manage products, categories, orders and customer accounts from one central dashboard."}
            </p>
          </div>

          <div className="lg:flex lg:justify-end">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl border border-[#c8a45d]/20 bg-white/5 p-8 backdrop-blur-2xl md:p-12"
            >
              <p className="mb-10 text-sm uppercase tracking-[0.35em] text-[#c8a45d]">
                {lang === "tr" ? "Yönetici Girişi" : "Administrator Login"}
              </p>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder={
                  lang === "tr" ? "Yönetici E-posta" : "Administrator Email"
                }
                className="mb-8 w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none transition-all duration-500 placeholder:text-white/40 focus:border-[#c8a45d]"
              />

              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder={lang === "tr" ? "Şifre" : "Password"}
                className="mb-10 w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none transition-all duration-500 placeholder:text-white/40 focus:border-[#c8a45d]"
              />

              {message && (
                <p className="mb-8 border border-[#c8a45d]/20 bg-black/30 px-5 py-4 text-sm text-[#c8a45d]">
                  {message}
                </p>
              )}

              <button
                disabled={loading}
                className="w-full border border-[#c8a45d] py-4 text-xs uppercase tracking-[0.35em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? lang === "tr"
                    ? "Kontrol ediliyor..."
                    : "Checking..."
                  : lang === "tr"
                    ? "Yönetim Paneline Gir"
                    : "Enter Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
