"use client";

import { useEffect, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminUsersPage() {
  const { lang } = useLanguage();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();

        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.log("Kullanıcılar alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value)
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
            {lang === "tr" ? "Kullanıcılar" : "Users"}
          </h1>
        </div>

        <div className="mt-10 flex items-center gap-4 border-b border-[#c8a45d]/15 pb-8">
          <Search size={18} className="text-[#c8a45d]" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              lang === "tr"
                ? "İsim, e-posta veya role göre ara..."
                : "Search by name, email or role..."
            }
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-[#7d766b]"
          />
        </div>

        <div className="mt-14">
          {loading ? (
            <p className="text-[#b8b0a1]">
              {lang === "tr"
                ? "Kullanıcılar yükleniyor..."
                : "Loading users..."}
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-[#b8b0a1]">
              {lang === "tr" ? "Kullanıcı bulunamadı." : "No users found."}
            </p>
          ) : (
            <div className="space-y-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="grid gap-6 border-t border-[#c8a45d]/15 pt-6 md:grid-cols-[60px_1fr_220px_160px]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c8a45d]/30 text-[#c8a45d]">
                    <UserRound size={22} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#c8a45d]">
                      {user.role === "admin" ? "ADMIN" : "USER"}
                    </p>

                    <h2 className="mt-3 text-2xl font-light">
                      {user.name || "-"}
                    </h2>

                    <p className="mt-2 text-sm text-[#8f887b]">{user.email}</p>
                  </div>

                  <p className="text-[#b8b0a1]">
                    {lang === "tr" ? "Favori" : "Favorites"}:{" "}
                    {user.favorites?.length || 0}
                  </p>

                  <p className="text-[#b8b0a1]">
                    {lang === "tr" ? "Sepet" : "Cart"}: {user.cart?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
