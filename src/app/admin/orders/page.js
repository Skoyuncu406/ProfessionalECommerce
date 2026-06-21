"use client";

import { useEffect, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminOrdersPage() {
  const { lang } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          text: lang === "tr" ? "Beklemede" : "Pending",
          className:
            "border border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
        };

      case "preparing":
        return {
          text: lang === "tr" ? "Hazırlanıyor" : "Preparing",
          className: "border border-blue-500/20 bg-blue-500/10 text-blue-400",
        };

      case "shipped":
        return {
          text: lang === "tr" ? "Kargoda" : "Shipped",
          className:
            "border border-purple-500/20 bg-purple-500/10 text-purple-400",
        };

      case "completed":
        return {
          text: lang === "tr" ? "Tamamlandı" : "Completed",
          className:
            "border border-green-500/20 bg-green-500/10 text-green-400",
        };

      case "cancelled":
        return {
          text: lang === "tr" ? "İptal Edildi" : "Cancelled",
          className: "border border-red-500/20 bg-red-500/10 text-red-400",
        };

      default:
        return {
          text: status || "-",
          className: "border border-gray-500/20 bg-gray-500/10 text-gray-400",
        };
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders", {
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

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status } : order,
          ),
        );
      }
    } catch {
      alert(
        lang === "tr"
          ? "Sipariş durumu güncellenemedi."
          : "Order status could not be updated.",
      );
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = confirm(
      lang === "tr"
        ? "Bu siparişi silmek istediğinize emin misiniz?"
        : "Are you sure you want to delete this order?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== id));
      }
    } catch {
      alert(
        lang === "tr" ? "Sipariş silinemedi." : "Order could not be deleted.",
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const value = search.toLowerCase();

    return (
      order.customerName?.toLowerCase().includes(value) ||
      order.email?.toLowerCase().includes(value) ||
      order.phone?.toLowerCase().includes(value) ||
      order.status?.toLowerCase().includes(value)
    );
  });

  return (
    <main className="min-h-screen bg-[#080808] px-6 pt-40 text-white md:px-12">
      <section className="mx-auto max-w-7xl">
        <div className="border-b border-[#c8a45d]/15 pb-10">
          <p className="mb-5 text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
            ADMIN PANEL
          </p>

          <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
            {lang === "tr" ? "Sipariş Yönetimi" : "Order Management"}
          </h1>
        </div>

        <div className="mt-10 flex items-center gap-4 border-b border-[#c8a45d]/15 pb-8">
          <Search size={18} className="text-[#c8a45d]" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              lang === "tr"
                ? "İsim, e-posta, telefon veya duruma göre ara..."
                : "Search by name, email, phone or status..."
            }
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-[#7d766b]"
          />
        </div>

        <div className="mt-14">
          {loading ? (
            <p className="text-[#b8b0a1]">
              {lang === "tr" ? "Siparişler yükleniyor..." : "Loading orders..."}
            </p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-[#b8b0a1]">
              {lang === "tr" ? "Sipariş bulunamadı." : "No orders found."}
            </p>
          ) : (
            <div className="space-y-8">
              {filteredOrders.map((order) => {
                const status = getStatusStyle(order.status);

                return (
                  <div
                    key={order._id}
                    className="border-t border-[#c8a45d]/15 pt-8"
                  >
                    <div className="grid gap-8 lg:grid-cols-[1fr_220px_160px]">
                      <div>
                        <div
                          className={`inline-flex items-center rounded-full px-4 py-2 text-xs uppercase tracking-[0.25em] ${status.className}`}
                        >
                          {status.text}
                        </div>

                        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[#8f887b]">
                          {lang === "tr" ? "Sipariş Kodu" : "Order Code"}:{" "}
                          <span className="text-[#c8a45d]">
                            {order.orderCode ||
                              `#${order._id?.slice(-6).toUpperCase()}`}
                          </span>
                        </p>

                        <h2 className="mt-5 text-3xl font-light">
                          {order.customerName}
                        </h2>

                        <p className="mt-3 text-sm text-[#8f887b]">
                          {order.email} • {order.phone}
                        </p>

                        <p className="mt-4 max-w-2xl leading-7 text-[#b8b0a1]">
                          {order.address}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-[#8f887b]">
                          {lang === "tr" ? "Toplam" : "Total"}
                        </p>

                        <p className="mt-3 text-2xl font-light text-[#c8a45d]">
                          ₺{Number(order.total).toLocaleString("tr-TR")}
                        </p>

                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className="mt-5 w-full border border-[#c8a45d]/20 bg-[#080808] px-4 py-3 text-sm text-[#c8a45d] outline-none"
                        >
                          <option
                            value="pending"
                            className="bg-[#080808] text-white"
                          >
                            {lang === "tr" ? "Beklemede" : "Pending"}
                          </option>

                          <option
                            value="preparing"
                            className="bg-[#080808] text-white"
                          >
                            {lang === "tr" ? "Hazırlanıyor" : "Preparing"}
                          </option>

                          <option
                            value="shipped"
                            className="bg-[#080808] text-white"
                          >
                            {lang === "tr" ? "Kargoda" : "Shipped"}
                          </option>

                          <option
                            value="completed"
                            className="bg-[#080808] text-white"
                          >
                            {lang === "tr" ? "Tamamlandı" : "Completed"}
                          </option>

                          <option
                            value="cancelled"
                            className="bg-[#080808] text-white"
                          >
                            {lang === "tr" ? "İptal Edildi" : "Cancelled"}
                          </option>
                        </select>
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
                              {lang === "tr" ? "Adet" : "Qty"}:{" "}
                              {product.quantity}
                            </span>

                            <span className="text-[#c8a45d]">
                              {product.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {["completed", "cancelled"].includes(order.status) && (
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="mt-6 border border-red-500/30 px-6 py-3 text-xs uppercase tracking-[0.25em] text-red-400 transition-all duration-500 hover:bg-red-500 hover:text-white"
                      >
                        {lang === "tr" ? "Siparişi Sil" : "Delete Order"}
                      </button>
                    )}
                    <p className="mt-6 text-xs uppercase tracking-[0.25em] text-[#8f887b]">
                      {new Date(order.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
