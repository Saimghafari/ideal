import Link from "next/link";
import React from "react";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

const LuxuryPageHero = ({
  breadcrumb,
  label,
  meta,
  title,
  titleItalic,
  subtitle,
}) => {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--si-deep-brown)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--si-deep-brown)] via-[var(--si-deep-brown)] to-[var(--si-deep-brown)]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgb(184_147_61/0.12)_0%,_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgb(85_17_15/0.35)_0%,_transparent_50%)]" />
      <div className="nn-grain absolute inset-0 z-[1]" />

      <div
        className="pointer-events-none absolute inset-5 sm:inset-7 lg:inset-10 z-[2] border border-[var(--si-burnt-orange)]/20"
        aria-hidden
      >
        <span className="absolute -top-px -left-px h-6 w-6 sm:h-8 sm:w-8 border-t border-l border-[var(--si-burnt-orange)]/60" />
        <span className="absolute -top-px -right-px h-6 w-6 sm:h-8 sm:w-8 border-t border-r border-[var(--si-burnt-orange)]/60" />
        <span className="absolute -bottom-px -left-px h-6 w-6 sm:h-8 sm:w-8 border-b border-l border-[var(--si-burnt-orange)]/60" />
        <span className="absolute -bottom-px -right-px h-6 w-6 sm:h-8 sm:w-8 border-b border-r border-[var(--si-burnt-orange)]/60" />
      </div>

      <div className="relative z-10 px-6 sm:px-10 lg:px-20 xl:px-28 py-20 sm:py-24 lg:py-28">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[0.6rem] tracking-[0.22em] uppercase text-[var(--si-cream)]/40 mb-10 sm:mb-12"
        >
          <Link
            href={WEBSITE_HOME}
            className="hover:text-[var(--si-cream)] transition-colors duration-400"
          >
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--si-cream)]/70">{breadcrumb}</span>
        </nav>

        <div className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4 mb-8">
            <span className="nn-label text-[var(--si-burnt-orange)]">{label}</span>
            {meta && (
              <>
                <span className="h-px w-10 bg-[var(--si-burnt-orange)]/45" />
                <span className="nn-label text-[var(--si-cream)]/35">{meta}</span>
              </>
            )}
          </div>

          <h1>
            <span className="nn-display block text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] font-light leading-[1.05] text-[var(--si-cream)]">
              {title}
            </span>
            {titleItalic && (
              <span className="nn-display-italic block text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] font-light leading-[1.05] text-[var(--si-cream)] mt-1">
                {titleItalic}
              </span>
            )}
          </h1>

          {subtitle && (
            <p className="mt-8 max-w-lg mx-auto sm:mx-0 text-sm sm:text-[0.95rem] font-light leading-[1.95] text-[var(--si-cream)]/60">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-[var(--si-burnt-orange)]/30 to-transparent" />
    </section>
  );
};

export default LuxuryPageHero;
