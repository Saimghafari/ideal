import React from "react";

const LuxuryIntro = ({ label, children }) => {
  return (
    <section className="relative bg-[var(--si-cream)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[var(--si-burnt-orange)]/40 to-transparent" />

      <div className="px-6 sm:px-10 lg:px-20 xl:px-28 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-label text-[var(--si-deep-brown)] mb-8">{label}</p>
          <div className="nn-hairline-gold mx-auto w-14 mb-10" />
          <div className="space-y-6 text-[0.9rem] sm:text-[0.95rem] font-light leading-[2.05] text-[var(--si-muted)]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryIntro;
