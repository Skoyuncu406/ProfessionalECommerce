"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#080808]">
      <div className="text-center">
        <h1 className="text-4xl tracking-[0.5em] text-[#c8a45d] md:text-6xl">
          VERITAS
        </h1>

        <div className="mx-auto mt-6 h-px w-0 animate-[grow_1.5s_ease_forwards] bg-[#c8a45d]" />

        <p className="mt-6 text-xs uppercase tracking-[0.4em] text-white/70">
          Premium Menswear
        </p>
      </div>
    </div>
  );
}