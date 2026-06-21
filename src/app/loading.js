export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
      <div className="text-center">
        <p className="text-2xl tracking-[0.45em] text-[#c8a45d]">VERITAS</p>

        <div className="mx-auto mt-8 h-px w-32 overflow-hidden bg-[#c8a45d]/20">
          <div className="h-full w-16 animate-pulse bg-[#c8a45d]" />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[#8f887b]">
          Yükleniyor
        </p>
      </div>
    </main>
  );
}
