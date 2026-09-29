import React from "react";
import BrandLogo from "@/components/Application/Website/BrandLogo";

/**
 * Luxury page / overlay loader.
 * @param {"page"|"overlay"|"inline"} [variant="page"]
 * @param {string} [label="Preparing"]
 */
const Loading = ({ variant = "page", label = "Preparing" }) => {
  const spinner = (
    <div className="relative flex flex-col items-center" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>

      <div className="relative h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]">
        <span
          className="nn-loader-ring absolute inset-0 rounded-full border border-[var(--si-burnt-orange)]/20"
          aria-hidden
        />
        <span
          className="nn-loader-spin absolute inset-0 rounded-full border border-transparent border-t-[var(--si-burnt-orange)] border-r-[var(--si-burnt-orange)]/40"
          aria-hidden
        />
        <span
          className="nn-loader-spin-reverse absolute inset-[7px] rounded-full border border-transparent border-b-[var(--si-deep-brown)]/50 border-l-[var(--si-deep-brown)]/25"
          aria-hidden
        />
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <span className="nn-loader-dot h-1.5 w-1.5 rotate-45 border border-[var(--si-burnt-orange)]/70" />
        </span>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <div className="nn-hairline-gold w-10 mb-5" />
        <p className="nn-label text-[0.52rem] text-[var(--si-deep-brown)] mb-4">
          {label}
        </p>
        <BrandLogo size="loading" link={false} />
        <p className="mt-3 text-[0.52rem] font-medium tracking-[0.22em] uppercase text-[var(--si-burnt-orange)] leading-none">
          Sweets &amp; Bakers
        </p>
      </div>
    </div>
  );

  if (variant === "inline") {
    return (
      <div className="flex w-full items-center justify-center py-16 sm:py-20">
        {spinner}
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--si-cream)]/80 backdrop-blur-[6px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% 40%, rgb(228 87 0 / 10%), transparent 60%)",
          }}
        />
        <div className="relative z-10">{spinner}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex min-h-dvh w-full items-center justify-center nn-cream-bg">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgb(228 87 0 / 12%), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 80%, rgb(75 46 30 / 5%), transparent 50%)",
        }}
      />
      <div className="nn-grain absolute inset-0 opacity-40" aria-hidden />
      <div className="relative z-10 px-6">{spinner}</div>
    </div>
  );
};

export default Loading;
