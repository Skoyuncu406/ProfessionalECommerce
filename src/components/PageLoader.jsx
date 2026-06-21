"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#080808]">
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-[0.5em] text-[#c8a45d]">
          VERITAS
        </h1>

        <div className="mx-auto mt-10 h-px w-40 overflow-hidden bg-white/10">
          <div className="h-full w-full animate-[loading_1.5s_ease-in-out_infinite] bg-[#c8a45d]" />
        </div>
      </div>
    </div>
  );
}