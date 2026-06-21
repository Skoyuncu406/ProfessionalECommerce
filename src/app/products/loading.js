export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-[#080808] px-6 pt-40 text-white md:px-12">
      <section className="mx-auto max-w-7xl">
        <p className="mb-8 text-xs uppercase tracking-[0.45em] text-[#c8a45d]">
          VERITAS
        </p>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item}>
              <div className="aspect-[3/4] animate-pulse bg-white/[0.05]" />
              <div className="mt-6 h-4 w-32 animate-pulse bg-white/[0.06]" />
              <div className="mt-4 h-8 w-52 animate-pulse bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
