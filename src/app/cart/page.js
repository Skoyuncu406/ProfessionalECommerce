"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCartStore } from "@/store/cartStore";
import PageHero from "@/components/PageHero";

export default function CartPage() {
  const { lang } = useLanguage();

  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <PageHero
        image="/hero.jpg"
        eyebrow={lang === "tr" ? "Sepet" : "Cart"}
        title={lang === "tr" ? "Alışveriş Sepeti" : "Shopping Cart"}
        description={
          lang === "tr"
            ? "Seçtiğiniz premium parçaları gözden geçirin."
            : "Review the premium pieces you have selected."
        }
      />

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          {cart.length === 0 ? (
            <div className="border-t border-[#c8a45d]/20 pt-10">
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
            <div className="space-y-8">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-6 border-t border-[#c8a45d]/20 pt-8 md:grid-cols-[120px_1fr_auto]"
                >
                  <Link
                    href={`/products/${item.id}`}
                    className="h-36 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${item.image || "/hero.jpg"}')`,
                    }}
                  />

                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#c8a45d]">
                      {item.category}
                    </p>

                    <Link href={`/products/${item.id}`}>
                      <h2 className="mt-3 text-3xl font-light transition-all duration-500 hover:text-[#c8a45d]">
                        {item.name}
                      </h2>
                    </Link>

                    <div className="mt-5 flex items-center gap-4 text-[#b8b0a1]">
                      <span>{lang === "tr" ? "Adet" : "Quantity"}:</span>

                      <div className="flex items-center border border-[#c8a45d]/20">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-4 py-2 text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
                        >
                          -
                        </button>

                        <span className="px-5 py-2 text-white">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="px-4 py-2 text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <p className="text-[#c8a45d]">{item.price}</p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#b8b0a1] transition-all duration-500 hover:text-[#c8a45d]"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-4 border-t border-[#c8a45d]/20 pt-10 sm:flex-row">
                <Link
                  href="/checkout"
                  className="border border-[#c8a45d] px-10 py-4 text-center text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
                >
                  {lang === "tr" ? "Satın Almaya Geç" : "Checkout"}
                </Link>

                <button
                  onClick={clearCart}
                  className="px-10 py-4 text-xs uppercase tracking-[0.3em] text-white transition-all duration-500 hover:text-[#c8a45d]"
                >
                  {lang === "tr" ? "Sepeti Temizle" : "Clear Cart"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
