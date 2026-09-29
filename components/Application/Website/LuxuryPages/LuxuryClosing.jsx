import Link from "next/link";
import React from "react";

const LuxuryClosing = ({
  quote,
  quoteSub,
  ctaLabel = "Questions?",
  emailLabel = "Contact Super Ideal",
  phone = "",
  email = "/contact-us",
  children,
}) => {
  return (
    <section className="bg-[var(--si-deep-brown)] px-6 sm:px-10 lg:px-20 xl:px-28 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="nn-hairline-light mx-auto w-12 mb-10" />
        <p className="nn-display-italic text-xl sm:text-2xl lg:text-[1.75rem] font-light leading-[1.4] text-[var(--si-cream)]">
          {quote}
          {quoteSub && (
            <>
              <br />
              <span className="text-[var(--si-cream)]/55">{quoteSub}</span>
            </>
          )}
        </p>
        <div className="nn-hairline-light mx-auto w-12 mt-10 mb-10" />

        {children}

        <p className="nn-label text-[var(--si-cream)]/70 mb-6">{ctaLabel}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
          <Link href={email} className="nn-btn-ghost text-[0.6rem] px-8 py-4">
            {emailLabel}
          </Link>
          {phone ? (
            <Link
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="text-[0.6rem] tracking-[0.24em] uppercase text-[var(--si-cream)]/45 hover:text-[var(--si-cream)] transition-colors duration-500 border-b border-[var(--si-cream)]/15 pb-0.5 hover:border-[var(--si-burnt-orange)]/50"
            >
              {phone}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default LuxuryClosing;
