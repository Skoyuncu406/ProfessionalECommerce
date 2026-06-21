"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import PageHero from "@/components/PageHero";

export default function CheckoutPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => {
    const price = Number(String(item.price).replace(/[₺.]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const syncEmptyCart = async () => {
    try {
      await fetch("/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [],
          favorites: useFavoriteStore.getState().favorites,
        }),
      });
    } catch {
      console.log("Kullanıcı sepeti MongoDB üzerinde temizlenemedi.");
    }
  };

  const handleConfirmOrder = async () => {
    setMessage("");

    if (cart.length === 0) {
      setMessage(lang === "tr" ? "Sepetiniz boş." : "Your cart is empty.");
      return;
    }

    if (!form.customerName || !form.phone || !form.email || !form.address) {
      setMessage(
        lang === "tr"
          ? "Lütfen tüm teslimat bilgilerini doldurun."
          : "Please fill in all delivery fields.",
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          products: cart,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Sipariş oluşturulamadı.");
        return;
      }

      clearCart();
      localStorage.removeItem("veritas-cart");

      await syncEmptyCart();

      router.push(`/order-success?code=${data.orderCode}`);
    } catch {
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
    <main className="min-h-screen bg-[#080808] text-white">
      <PageHero
        image="/hero.jpg"
        eyebrow={lang === "tr" ? "Ödeme" : "Checkout"}
        title={lang === "tr" ? "Siparişi Tamamla" : "Complete Order"}
        description={
          lang === "tr"
            ? "Teslimat bilgilerinizi girerek siparişinizi tamamlayın."
            : "Enter your delivery information to complete your order."
        }
      />

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <form className="border-t border-[#c8a45d]/20 pt-10">
            <div className="grid gap-8 md:grid-cols-2">
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder={lang === "tr" ? "Ad Soyad" : "Full Name"}
                className="border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder={lang === "tr" ? "Telefon" : "Phone"}
                className="border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
              />
            </div>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={lang === "tr" ? "E-posta" : "Email"}
              className="mt-8 w-full border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            />

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="5"
              placeholder={
                lang === "tr" ? "Teslimat Adresi" : "Delivery Address"
              }
              className="mt-8 w-full resize-none border-0 border-b border-[#c8a45d]/20 bg-transparent py-5 text-white outline-none placeholder:text-[#7d766b] focus:border-[#c8a45d]"
            />

            {message && (
              <p className="mt-8 border border-[#c8a45d]/20 bg-white/[0.03] px-5 py-4 text-sm text-[#c8a45d]">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={loading || cart.length === 0}
              className="mt-10 border border-[#c8a45d] px-10 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? lang === "tr"
                  ? "Sipariş oluşturuluyor..."
                  : "Creating order..."
                : lang === "tr"
                  ? "Siparişi Onayla"
                  : "Confirm Order"}
            </button>
          </form>

          <aside className="border border-[#c8a45d]/15 bg-white/[0.03] p-8 backdrop-blur-xl">
            <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#c8a45d]">
              {lang === "tr" ? "Sipariş Özeti" : "Order Summary"}
            </p>

            {cart.length === 0 ? (
              <div>
                <p className="text-[#b8b0a1]">
                  {lang === "tr" ? "Sepetiniz boş." : "Your cart is empty."}
                </p>

                <Link
                  href="/products"
                  className="mt-8 inline-block border border-[#c8a45d] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
                >
                  {lang === "tr" ? "Ürünlere Git" : "Go to Products"}
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-6 border-b border-[#c8a45d]/10 pb-5"
                    >
                      <div>
                        <p className="text-white">{item.name}</p>

                        <p className="mt-2 text-sm text-[#8f887b]">
                          {lang === "tr" ? "Adet" : "Qty"}: {item.quantity}
                        </p>
                      </div>

                      <p className="text-[#c8a45d]">{item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-between border-t border-[#c8a45d]/20 pt-6">
                  <p className="text-[#b8b0a1]">
                    {lang === "tr" ? "Toplam" : "Total"}
                  </p>

                  <p className="text-2xl font-light text-[#c8a45d]">
                    ₺{total.toLocaleString("tr-TR")}
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
