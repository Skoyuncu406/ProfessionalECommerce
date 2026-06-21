"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
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

      setMessage(lang === "tr" ? "Giriş başarılı." : "Login successful.");

      localStorage.removeItem("veritas-cart");
      localStorage.removeItem("veritas-favorites");

      if (data.user?.role === "admin") {
        router.push("/admin");
      } else {
        window.location.href = "/";
      }
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
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero.jpg')",
          filter: "brightness(0.9) contrast(1.1)",
        }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-screen items-center px-6 py-32 md:px-12">
        <div className="mx-auto grid w-full max-w-7xl gap-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
              VERITAS
            </p>

            <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
              {lang === "tr"
                ? "Premium Deneyime Hoş Geldiniz"
                : "Welcome To Premium Experience"}
            </h1>

            <div className="mt-8 h-px w-24 bg-[#c8a45d]" />

            <p className="mt-8 max-w-xl text-lg leading-9 text-gray-300">
              {lang === "tr"
                ? "Favorilerinizi yönetin, siparişlerinizi takip edin ve seçkin koleksiyonlarımıza erişin."
                : "Manage your favorites, track your orders and access our exclusive collections."}
            </p>
          </div>

          <div className="lg:flex lg:justify-end">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl border border-[#c8a45d]/20 bg-white/5 p-8 backdrop-blur-2xl md:p-12"
            >
              <p className="mb-10 text-sm uppercase tracking-[0.35em] text-[#c8a45d]">
                {lang === "tr" ? "Giriş Yap" : "Sign In"}
              </p>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder={lang === "tr" ? "E-posta" : "Email"}
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
                    ? "Giriş yapılıyor..."
                    : "Signing in..."
                  : lang === "tr"
                    ? "Giriş Yap"
                    : "Sign In"}
              </button>

              <p className="mt-8 text-center text-sm text-[#b8b0a1]">
                {lang === "tr" ? "Hesabınız yok mu?" : "Don't have an account?"}{" "}
                <Link href="/register" className="text-[#c8a45d]">
                  {lang === "tr" ? "Kayıt Ol" : "Register"}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
