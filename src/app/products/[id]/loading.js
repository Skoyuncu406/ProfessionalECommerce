export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-[#080808] px-6 pt-32 text-white md:px-12">
      <section className="mx-auto grid min-h-screen max-w-7xl gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-center">
        <div className="h-[620px] max-h-[75vh] animate-pulse bg-white/[0.05]" />

        <div>
          <div className="h-4 w-40 animate-pulse bg-[#c8a45d]/20" />
          <div className="mt-8 h-20 w-full max-w-md animate-pulse bg-white/[0.06]" />
          <div className="mt-8 h-px w-28 bg-[#c8a45d]/30" />
          <div className="mt-8 h-8 w-32 animate-pulse bg-white/[0.06]" />
          <div className="mt-8 h-28 w-full max-w-xl animate-pulse bg-white/[0.06]" />
        </div>
      </section>
    </main>
  );
}
