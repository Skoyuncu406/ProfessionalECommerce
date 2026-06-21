"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function OrderSuccessPage() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();

  const orderCode = searchParams.get("code");

  const copyCode = async () => {
    if (!orderCode) return;

    await navigator.clipboard.writeText(orderCode);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-white">
      <section className="mx-auto max-w-2xl border border-[#c8a45d]/20 bg-white/[0.03] p-10 text-center backdrop-blur-xl">
        <CheckCircle2 size={46} className="mx-auto text-[#c8a45d]" />

        <p className="mt-8 text-xl tracking-[0.4em] text-[#c8a45d]">VERITAS</p>

        <h1 className="mt-8 text-5xl font-light tracking-[-0.05em]">
          {lang === "tr" ? "Siparişiniz Alındı" : "Order Received"}
        </h1>

        <p className="mt-6 leading-8 text-[#b8b0a1]">
          {lang === "tr"
            ? "Siparişiniz başarıyla oluşturuldu. Sipariş takibi için aşağıdaki kodu saklayın."
            : "Your order has been created successfully. Keep the code below to track your order."}
        </p>

        {orderCode && (
          <div className="mt-8 border border-[#c8a45d]/20 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8f887b]">
              {lang === "tr" ? "Sipariş Takip Kodu" : "Order Tracking Code"}
            </p>

            <div className="mt-4 flex items-center justify-center gap-4">
              <span className="text-3xl font-light tracking-[0.15em] text-[#c8a45d]">
                {orderCode}
              </span>

              <button
                onClick={copyCode}
                className="text-[#b8b0a1] transition-all duration-500 hover:text-[#c8a45d]"
                aria-label="Kodu kopyala"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/orders"
            className="border border-[#c8a45d] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
          >
            {lang === "tr" ? "Sipariş Takibi" : "Track Order"}
          </Link>

          <Link
            href="/products"
            className="px-8 py-4 text-xs uppercase tracking-[0.3em] text-white transition-all duration-500 hover:text-[#c8a45d]"
          >
            {lang === "tr" ? "Alışverişe Devam Et" : "Continue Shopping"}
          </Link>
        </div>
      </section>
    </main>
  );
}
