"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import PageHero from "@/components/PageHero";

export default function OrdersPage() {
  const { lang } = useLanguage();

  const [userOrders, setUserOrders] = useState([]);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [form, setForm] = useState({
    orderCode: "",
    email: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);

  const statusSteps = [
    {
      key: "pending",
      labelTr: "Beklemede",
      labelEn: "Pending",
    },
    {
      key: "preparing",
      labelTr: "Hazırlanıyor",
      labelEn: "Preparing",
    },
    {
      key: "shipped",
      labelTr: "Kargoda",
      labelEn: "Shipped",
    },
    {
      key: "completed",
      labelTr: "Tamamlandı",
      labelEn: "Completed",
    },
  ];

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
        return status || "-";
    }
  };

  const getStatusIndex = (status) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  const renderTimeline = (status) => {
    if (status === "cancelled") {
      return (
        <div className="mt-8 border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          {lang === "tr"
            ? "Bu sipariş iptal edilmiştir."
            : "This order has been cancelled."}
        </div>
      );
    }

    const activeIndex = getStatusIndex(status);

    return (
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {statusSteps.map((step, index) => {
          const active = index <= activeIndex;

          return (
            <div key={step.key}>
              <div
                className={`border px-4 py-4 text-center text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
                  active
                    ? "border-[#c8a45d] bg-[#c8a45d] text-black"
                    : "border-[#c8a45d]/15 bg-white/[0.03] text-[#8f887b]"
                }`}
              >
                {lang === "tr" ? step.labelTr : step.labelEn}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const res = await fetch("/api/orders/my", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setIsLoggedIn(true);
          setUserOrders(data.orders || []);
        } else {
          setIsLoggedIn(false);
          setUserOrders([]);
        }
      } catch {
        setIsLoggedIn(false);
        setUserOrders([]);
      } finally {
        setLoading(false);
      }
    };

    getUserOrders();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    if (isLoggedIn) return;

    setMessage("");
    setTrackedOrder(null);
    setTracking(true);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderCode: form.orderCode,
          email: form.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Sipariş bulunamadı.");
        return;
      }

      setTrackedOrder(data.order);
    } catch {
      setMessage(
        lang === "tr"
          ? "Sipariş sorgulanırken hata oluştu."
          : "An error occurred while tracking the order.",
      );
    } finally {
      setTracking(false);
    }
  };

  const renderOrder = (order) => (
    <div key={order._id} className="border-t border-[#c8a45d]/15 pt-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_220px_160px]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#c8a45d]">
            {getStatusText(order.status)}
          </p>

          <h2 className="mt-3 text-3xl font-light">
            {lang === "tr" ? "Sipariş" : "Order"}{" "}
            {order.orderCode || `#${order._id?.slice(-6).toUpperCase()}`}
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

      {renderTimeline(order.status)}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {order.products?.map((product, index) => (
          <div
            key={`${order._id}-${index}`}
            className="border border-[#c8a45d]/10 bg-white/[0.03] p-5"
          >
            <p className="text-white">{product.name}</p>

            <p className="mt-2 text-sm text-[#8f887b]">{product.category}</p>

            <div className="mt-4 flex justify-between gap-6 text-sm">
              <span className="text-[#b8b0a1]">
                {lang === "tr" ? "Adet" : "Qty"}: {product.quantity}
              </span>

              <span className="text-[#c8a45d]">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const pageDescription = isLoggedIn
    ? lang === "tr"
      ? "Geçmiş ve güncel siparişlerinizi buradan takip edebilirsiniz."
      : "You can track your past and current orders here."
    : lang === "tr"
      ? "Üye değilseniz sipariş kodu ve e-posta adresinizle siparişinizi takip edebilirsiniz."
      : "If you are not signed in, you can track your order with your order code and email address.";

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <PageHero
        image="/hero.jpg"
        eyebrow={lang === "tr" ? "Sipariş Takibi" : "Order Tracking"}
        title={lang === "tr" ? "Siparişlerim" : "My Orders"}
        description={pageDescription}
      />

      <section className="px-6 py-24 md:px-12">
        <div
          className={`mx-auto grid max-w-7xl gap-14 ${
            isLoggedIn ? "lg:grid-cols-1" : "lg:grid-cols-[0.9fr_1.1fr]"
          }`}
        >
          {!isLoggedIn && (
            <form
              onSubmit={handleTrackOrder}
              className="border border-[#c8a45d]/15 bg-white/[0.03] p-8 backdrop-blur-xl"
            >
              <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#c8a45d]">
                {lang === "tr" ? "Kod ile Sorgula" : "Track by Code"}
              </p>

              <input
                name="orderCode"
                value={form.orderCode}
                onChange={handleChange}
                placeholder={lang === "tr" ? "Sipariş Kodu" : "Order Code"}
                className="w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={lang === "tr" ? "E-posta" : "Email"}
                className="mt-8 w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
              />

              {message && (
                <p className="mt-8 border border-[#c8a45d]/20 bg-black/30 px-5 py-4 text-sm text-[#c8a45d]">
                  {message}
                </p>
              )}

              <button className="mt-10 inline-flex items-center justify-center gap-3 border border-[#c8a45d] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black">
                <Search size={16} />
                {tracking
                  ? lang === "tr"
                    ? "Sorgulanıyor..."
                    : "Tracking..."
                  : lang === "tr"
                    ? "Siparişi Sorgula"
                    : "Track Order"}
              </button>
            </form>
          )}

          <div>
            {loading ? (
              <p className="text-[#b8b0a1]">
                {lang === "tr"
                  ? "Siparişler yükleniyor..."
                  : "Loading orders..."}
              </p>
            ) : isLoggedIn ? (
              userOrders.length > 0 ? (
                <div className="space-y-10">
                  {userOrders.map((order) => renderOrder(order))}
                </div>
              ) : (
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
              )
            ) : trackedOrder ? (
              <div>
                <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#c8a45d]">
                  {lang === "tr" ? "Sorgu Sonucu" : "Tracking Result"}
                </p>

                {renderOrder(trackedOrder)}
              </div>
            ) : (
              <div className="border-t border-[#c8a45d]/20 pt-10">
                <p className="text-[#b8b0a1]">
                  {lang === "tr"
                    ? "Siparişinizi görüntülemek için sipariş kodu ve e-posta adresinizi girin."
                    : "Enter your order code and email address to view your order."}
                </p>

                <Link
                  href="/products"
                  className="mt-8 inline-block border border-[#c8a45d] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
                >
                  {lang === "tr" ? "Alışverişe Başla" : "Start Shopping"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
