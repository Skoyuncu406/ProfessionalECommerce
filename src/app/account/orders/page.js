"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import PageHero from "@/components/PageHero";

export default function AccountOrdersPage() {
  const { lang } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return lang === "tr" ? "Beklemede" : "Pending";
      case "preparing":
        return lang === "tr" ? "Hazırlanıyor" : "Preparing";
      case "shipped":
        return lang === "tr" ? "Kargoda" : "Shipped";
      case "completed":
        return lang === "tr" ? "Tamamlandı" : "Completed";
      case "cancelled":
        return lang === "tr" ? "İptal Edildi" : "Cancelled";
      default:
        return status;
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetch("/api/orders/my", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <PageHero
        image="/hero.jpg"
        eyebrow={lang === "tr" ? "Hesabım" : "My Account"}
        title={lang === "tr" ? "Siparişlerim" : "My Orders"}
        description={
          lang === "tr"
            ? "Geçmiş ve güncel siparişlerinizi buradan takip edebilirsiniz."
            : "Track your past and current orders here."
        }
      />

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <p className="text-[#b8b0a1]">
              {lang === "tr" ? "Siparişler yükleniyor..." : "Loading orders..."}
            </p>
          ) : orders.length === 0 ? (
            <div className="border-t border-[#c8a45d]/20 pt-10">
              <p className="text-[#b8b0a1]">
                {lang === "tr"
                  ? "Henüz siparişiniz bulunmuyor."
                  : "You have no orders yet."}
              </p>

              <Link
                href="/products"
                className="mt-8 inline-block border border-[#c8a45d] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
              >
                {lang === "tr" ? "Alışverişe Başla" : "Start Shopping"}
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border-t border-[#c8a45d]/15 pt-8"
                >
                  <div className="grid gap-8 lg:grid-cols-[1fr_220px_160px]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#c8a45d]">
                        {getStatusText(order.status)}
                      </p>

                      <h2 className="mt-3 text-3xl font-light">
                        {lang === "tr" ? "Sipariş" : "Order"} #
                        {order._id.slice(-6).toUpperCase()}
                      </h2>

                      <p className="mt-3 text-sm text-[#8f887b]">
                        {new Date(order.createdAt).toLocaleString("tr-TR")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#8f887b]">
                        {lang === "tr" ? "Toplam" : "Total"}
                      </p>

                      <p className="mt-3 text-2xl font-light text-[#c8a45d]">
                        ₺{Number(order.total).toLocaleString("tr-TR")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#8f887b]">
                        {lang === "tr" ? "Ürün Sayısı" : "Products"}
                      </p>

                      <p className="mt-3 flex items-center gap-3 text-[#c8a45d]">
                        <ShoppingBag size={18} />
                        {order.products?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {order.products?.map((product, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="border border-[#c8a45d]/10 bg-white/[0.03] p-5"
                      >
                        <p className="text-white">{product.name}</p>

                        <p className="mt-2 text-sm text-[#8f887b]">
                          {product.category}
                        </p>

                        <div className="mt-4 flex justify-between gap-6 text-sm">
                          <span className="text-[#b8b0a1]">
                            {lang === "tr" ? "Adet" : "Qty"}: {product.quantity}
                          </span>

                          <span className="text-[#c8a45d]">
                            {product.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
