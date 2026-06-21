export default function OrdersLoading() {
  return (
    <main className="min-h-screen bg-[#080808] px-6 pt-40 text-white md:px-12">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.45em] text-[#c8a45d]">
          VERITAS
        </p>

        <div className="mt-12 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="h-96 animate-pulse border border-[#c8a45d]/10 bg-white/[0.04]" />
          <div className="h-96 animate-pulse border border-[#c8a45d]/10 bg-white/[0.04]" />
        </div>
      </section>
    </main>
  );
}
