import React from "react";

const stats = [
  { value: "500+", label: "Pieces Created" },
  { value: "3", label: "Design Studios" },
  { value: "100%", label: "Finely Finished" },
  { value: "∞", label: "Timeless Style" },
];

const StatsBanner = () => {
  return (
    <section className="bg-[var(--si-cream)] px-6 sm:px-10 lg:px-28 xl:px-36 py-20 sm:py-24">
      <div className="nn-hairline-gold mb-0" />
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`py-14 sm:py-16 text-center
              ${i < 3 ? "lg:border-r border-[var(--si-fog)]/50" : ""}
              ${i % 2 === 0 ? "max-lg:border-r border-[var(--si-fog)]/40" : ""}
              ${i < 2 ? "max-lg:border-b border-[var(--si-fog)]/40" : ""}
            `}
          >
            <p className="nn-display text-5xl sm:text-6xl font-light text-[var(--si-burnt-orange)] mb-3">
              {s.value}
            </p>
            <p className="nn-label text-[var(--si-muted)] text-[0.58rem]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
      <div className="nn-hairline-gold mt-0" />
    </section>
  );
};

export default StatsBanner;
