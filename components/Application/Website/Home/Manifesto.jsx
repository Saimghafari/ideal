import React from "react";

const Manifesto = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--si-cream)] px-6 py-32 sm:px-10 sm:py-44 lg:px-28 xl:px-36">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 75% 50% at 18% 15%, rgb(217 188 122 / 0.2), transparent 58%),
            radial-gradient(ellipse 60% 55% at 85% 80%, rgb(228 87 0 / 0.1), transparent 55%),
            radial-gradient(ellipse 45% 40% at 55% 55%, rgb(255 253 248 / 0.65), transparent 70%),
            linear-gradient(160deg, #FFFDF8 0%, #F8F4EC 40%, #F2EDE3 100%)
          `,
        }}
      />

      {/* Soft vertical gold rules */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-[12%] bottom-[12%] w-px bg-gradient-to-b from-transparent via-[var(--si-burnt-orange)]/25 to-transparent hidden lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[12%] bottom-[12%] w-px bg-gradient-to-b from-transparent via-[var(--si-burnt-orange)]/25 to-transparent hidden lg:block"
      />

      {/* Drifting light */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-[var(--si-burnt-orange)]/15 blur-3xl nn-manifesto-drift-a"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-[var(--si-cream)]/20 blur-3xl nn-manifesto-drift-b"
      />

      <div className="nn-grain pointer-events-none absolute inset-0 z-[1] opacity-40" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="nn-animate-fade-up mb-10 flex items-center gap-4">
          <span className="h-px w-8 bg-[var(--si-burnt-orange)]/55 nn-draw-line" />
          <p className="nn-label text-[var(--si-deep-brown)]">
            The Super Ideal Belief
          </p>
          <span className="h-px w-8 bg-[var(--si-burnt-orange)]/55 nn-draw-line [transform-origin:right_center]" />
        </div>

        <blockquote className="relative">
          <span
            aria-hidden
            className="nn-display nn-animate-fade-up pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none text-[7rem] leading-none text-[var(--si-burnt-orange)]/20 sm:-top-14 sm:text-[9rem]"
          >
            &ldquo;
          </span>

          <p className="nn-display-italic nn-animate-fade-up-delay-1 relative text-[2rem] font-light leading-[1.25] tracking-wide text-[var(--si-deep-brown)] sm:text-4xl lg:text-5xl xl:text-[3.35rem]">
            &ldquo;More than sweets.
            <br className="hidden sm:block" /> A counter that feels
            <br className="hidden sm:block" />{" "}
            <span className="nn-gold-text">like home.&rdquo;</span>
          </p>
        </blockquote>

        <div className="nn-animate-fade-up-delay-2 mt-14 flex flex-col items-center gap-3">
          <span className="text-[0.55rem] tracking-[0.35em] text-[var(--si-burnt-orange)]/50">
            ✦
          </span>
          <div className="nn-hairline-gold w-16" />
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
