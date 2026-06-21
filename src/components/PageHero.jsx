export default function PageHero({ image, eyebrow, title, description }) {
  return (
    <section className="relative h-[62vh] overflow-hidden bg-black">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
          filter: "brightness(1.05) contrast(1.08) saturate(1.05)",
        }}
      />

      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 pt-20 md:px-12">
          <p className="mb-5 text-xs uppercase tracking-[0.45em] text-[#c8a45d]">
            {eyebrow}
          </p>

          <h1 className="text-5xl font-light tracking-[-0.05em] text-white md:text-7xl">
            {title}
          </h1>

          <div className="mt-8 h-px w-28 bg-[#c8a45d]" />

          <p className="mt-8 max-w-2xl leading-8 text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}