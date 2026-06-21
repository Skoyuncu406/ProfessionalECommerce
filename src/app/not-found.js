import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-white">
      <section className="max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-[#c8a45d]">
          VERITAS
        </p>

        <h1 className="mt-8 text-7xl font-light tracking-[-0.06em] md:text-9xl">
          404
        </h1>

        <h2 className="mt-8 text-4xl font-light tracking-[-0.04em]">
          Sayfa Bulunamadı
        </h2>

        <p className="mx-auto mt-6 max-w-lg leading-8 text-[#b8b0a1]">
          Aradığınız sayfa taşınmış, silinmiş veya hiç oluşturulmamış olabilir.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="border border-[#c8a45d] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c8a45d] transition-all duration-500 hover:bg-[#c8a45d] hover:text-black"
          >
            Ana Sayfa
          </Link>

          <Link
            href="/products"
            className="px-8 py-4 text-xs uppercase tracking-[0.3em] text-white transition-all duration-500 hover:text-[#c8a45d]"
          >
            Koleksiyonları İncele
          </Link>
        </div>
      </section>
    </main>
  );
}
