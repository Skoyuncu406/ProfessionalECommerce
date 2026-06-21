"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Layers,
  ShoppingBag,
  Users,
  ArrowRight,
  LogOut,
  Wallet,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboardPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [statsData, setStatsData] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setStatsData({
            totalProducts: data.stats.totalProducts || 0,
            totalCategories: data.stats.totalCategories || 0,
            totalOrders: data.stats.totalOrders || 0,
            totalUsers: data.stats.totalUsers || 0,
            totalRevenue: data.stats.totalRevenue || 0,
            todayOrders: data.stats.todayOrders || 0,
            pendingOrders: data.stats.pendingOrders || 0,
            lowStockProducts: data.stats.lowStockProducts || 0,
          });
        }
      } catch {
        setStatsData({
          totalProducts: 0,
          totalCategories: 0,
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
          todayOrders: 0,
          pendingOrders: 0,
          lowStockProducts: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/admin/login");
  };

  const stats = [
    {
      title: lang === "tr" ? "Toplam Ürün" : "Total Products",
      value: statsData.totalProducts,
      icon: Package,
      desc: lang === "tr" ? "Yayındaki ürün sayısı" : "Published products",
    },
    {
      title: lang === "tr" ? "Toplam Kategori" : "Total Categories",
      value: statsData.totalCategories,
      icon: Layers,
      desc: lang === "tr" ? "Aktif koleksiyonlar" : "Active collections",
    },
    {
      title: lang === "tr" ? "Toplam Sipariş" : "Total Orders",
      value: statsData.totalOrders,
      icon: ShoppingBag,
      desc: lang === "tr" ? "Tüm siparişler" : "All orders",
    },
    {
      title: lang === "tr" ? "Toplam Kullanıcı" : "Total Users",
      value: statsData.totalUsers,
      icon: Users,
      desc: lang === "tr" ? "Kayıtlı üyeler" : "Registered members",
    },
    {
      title: lang === "tr" ? "Toplam Ciro" : "Total Revenue",
      value: `₺${Number(statsData.totalRevenue).toLocaleString("tr-TR")}`,
      icon: Wallet,
      desc:
        lang === "tr" ? "Tamamlanan siparişlerden" : "From completed orders",
    },
    {
      title: lang === "tr" ? "Bugünkü Sipariş" : "Today Orders",
      value: statsData.todayOrders,
      icon: TrendingUp,
      desc: lang === "tr" ? "Bugün gelen siparişler" : "Orders received today",
    },
    {
      title: lang === "tr" ? "Bekleyen Sipariş" : "Pending Orders",
      value: statsData.pendingOrders,
      icon: Clock,
      desc: lang === "tr" ? "İşlem bekleyenler" : "Waiting for action",
    },
    {
      title: lang === "tr" ? "Düşük Stok" : "Low Stock",
      value: statsData.lowStockProducts,
      icon: AlertTriangle,
      desc: lang === "tr" ? "Stoku azalan ürünler" : "Products running low",
    },
  ];

  const actions = [
    {
      title: lang === "tr" ? "Ürün Yönetimi" : "Product Management",
      desc:
        lang === "tr"
          ? "Ürün ekle, düzenle, stok ve görselleri yönet."
          : "Add, edit and manage product stock and images.",
      href: "/admin/products",
    },
    {
      title: lang === "tr" ? "Kategori Yönetimi" : "Category Management",
      desc:
        lang === "tr"
          ? "Koleksiyon kategorilerini oluştur ve düzenle."
          : "Create and edit collection categories.",
      href: "/admin/categories",
    },
    {
      title: lang === "tr" ? "Sipariş Yönetimi" : "Order Management",
      desc:
        lang === "tr"
          ? "Siparişleri, durumları ve takip kodlarını yönet."
          : "Manage orders, statuses and tracking codes.",
      href: "/admin/orders",
    },
    {
      title: lang === "tr" ? "Kullanıcılar" : "Users",
      desc:
        lang === "tr"
          ? "Üye hesaplarını ve müşteri listesini görüntüle."
          : "View member accounts and customer list.",
      href: "/admin/users",
    },
  ];

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="relative overflow-hidden px-6 pb-20 pt-40 md:px-12">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: "url('/hero.jpg')",
            filter: "brightness(0.8) contrast(1.1)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#080808]/90 to-[#080808]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
                VERITAS ADMIN
              </p>

              <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
                {lang === "tr" ? "Yönetim Paneli" : "Dashboard"}
              </h1>

              <p className="mt-8 max-w-2xl leading-8 text-[#b8b0a1]">
                {lang === "tr"
                  ? "Ürünleri, kategorileri, siparişleri, kullanıcıları ve satış performansını tek panelden takip edin."
                  : "Track products, categories, orders, users and sales performance from one panel."}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-3 border border-[#c8a45d] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
            >
              <LogOut size={16} />
              {lang === "tr" ? "Çıkış Yap" : "Logout"}
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group border border-[#c8a45d]/15 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-500 hover:border-[#c8a45d]/40"
                >
                  <div className="flex items-center justify-between gap-6">
                    <Icon
                      size={22}
                      className="text-[#c8a45d] transition-all duration-500 group-hover:scale-110"
                    />

                    <span className="h-px flex-1 bg-[#c8a45d]/10" />
                  </div>

                  <p className="mt-8 text-sm uppercase tracking-[0.25em] text-[#8f887b]">
                    {item.title}
                  </p>

                  <h2 className="mt-4 text-4xl font-light text-white md:text-5xl">
                    {loading ? "..." : item.value}
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-[#777064]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">
            {actions.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group border-t border-[#c8a45d]/20 pt-8"
              >
                <div className="flex items-start justify-between gap-8">
                  <div>
                    <h2 className="text-3xl font-light tracking-[-0.04em]">
                      {item.title}
                    </h2>

                    <p className="mt-5 leading-8 text-[#9b9588]">{item.desc}</p>
                  </div>

                  <ArrowRight className="text-[#c8a45d] transition-all duration-500 group-hover:translate-x-2" />
                </div>

                <div className="mt-10 h-px w-0 bg-[#c8a45d] transition-all duration-700 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
