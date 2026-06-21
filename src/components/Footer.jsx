"use client";

import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t border-[#c8a45d]/10 bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-3">
          <div>
            <h3 className="text-2xl tracking-[0.35em] text-[#c8a45d]">
              VERITAS
            </h3>

            <p className="mt-6 max-w-xs leading-8 text-[#8f887b]">
              {lang === "tr"
                ? "Premium erkek giyim koleksiyonları ile zamansız şıklık."
                : "Timeless elegance with premium menswear collections."}
            </p>
          </div>

          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#c8a45d]">
              {lang === "tr" ? "Bağlantılar" : "Links"}
            </p>

            <div className="flex flex-col gap-4">
              <Link
                href="/products"
                className="text-[#b8b0a1] transition-all duration-500 hover:text-[#c8a45d]"
              >
                {lang === "tr" ? "Koleksiyonlar" : "Collections"}
              </Link>

              <Link
                href="/orders"
                className="text-[#b8b0a1] transition-all duration-500 hover:text-[#c8a45d]"
              >
                {lang === "tr" ? "Siparişlerim" : "My Orders"}
              </Link>

              <Link
                href="/favorites"
                className="text-[#b8b0a1] transition-all duration-500 hover:text-[#c8a45d]"
              >
                {lang === "tr" ? "Favorilerim" : "My Favorites"}
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#c8a45d]">
              {lang === "tr" ? "İletişim" : "Contact"}
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-3 text-[#b8b0a1]">
                <Phone size={16} />
                <span>+90 555 555 55 55</span>
              </div>

              <div className="flex items-center gap-3 text-[#b8b0a1]">
                <Mail size={16} />
                <span>info@veritas.com</span>
              </div>

<a
  href="https://instagram.com"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 text-[#b8b0a1] transition-all duration-500 hover:text-[#c8a45d]"
>
  Instagram
</a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#c8a45d]/10 pt-8 text-center text-sm text-[#6f675d]">
          © 2026 VERITAS.{" "}
          {lang === "tr"
            ? "Tüm Hakları Saklıdır."
            : "All Rights Reserved."}
        </div>
      </div>
    </footer>
  );
}