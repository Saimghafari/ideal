import Image from "next/image";
import Link from "next/link";
import React from "react";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { HERO_IMAGE } from "@/lib/staticCatalog";

const Hero = () => {
  return (
    <section
      aria-label="Velora autumn collection"
      className="relative isolate bg-[#d6d2cd] text-[var(--si-deep-brown)] -mt-[calc(3.85rem+1.75rem+1px+env(safe-area-inset-top,0px))] sm:-mt-[calc(4.5rem+1.75rem+1px+env(safe-area-inset-top,0px))] xl:-mt-[176px]"
    >
      <div className="w-full bg-[#d6d2cd] pt-[calc(3.85rem+1.75rem+env(safe-area-inset-top,0px))] sm:pt-0">
        <Image
          src={HERO_IMAGE}
          alt="Velora autumn atelier — women and men in quiet luxury clothing"
          width={1024}
          height={576}
          priority
          sizes="100vw"
          className="block h-auto w-full max-w-none"
        />
      </div>

      <div className="border-t border-black/10 bg-[var(--si-cream)] px-4 py-6 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:px-8 sm:py-8 md:px-10 lg:px-16 lg:py-10 xl:px-24">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <div>
            <p className="mb-2.5 flex items-center gap-3 text-[0.6rem] tracking-[0.24em] uppercase text-[var(--si-muted)] sm:mb-3 sm:text-[0.62rem] sm:tracking-[0.28em]">
              <span className="h-px w-7 bg-[var(--si-muted)] sm:w-9" />
              Autumn collection
            </p>
            <h1 className="nn-display text-[2.25rem] font-normal not-italic leading-[1.1] tracking-[0.01em] text-[var(--si-deep-brown)] sm:text-[2.75rem] lg:text-[3.25rem]">
              Quiet luxury in motion.
            </h1>
            <p className="mt-3 max-w-md text-[0.82rem] font-light leading-6 text-[var(--si-muted)] sm:mt-4 sm:text-sm sm:leading-7">
              Silk, wool, and cashmere cut with restraint — a wardrobe that feels
              considered, never loud. Priced in Pakistani rupees.
            </p>
          </div>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3">
              <Link
                href={WEBSITE_SHOP}
                className="inline-flex min-h-12 w-full items-center justify-center border border-[var(--si-deep-brown)] bg-[var(--si-deep-brown)] px-6 text-[0.62rem] font-medium tracking-[0.2em] uppercase text-[var(--si-cream)] transition-colors duration-300 hover:border-[var(--si-deep-brown)] hover:bg-[var(--si-cream)] hover:text-[var(--si-deep-brown)] sm:w-auto sm:tracking-[0.22em]"
              >
                Shop the collection
              </Link>
              <div className="flex items-center justify-center gap-6 sm:justify-start">
                <Link
                  href={`${WEBSITE_SHOP}?category=women`}
                  className="inline-flex min-h-11 items-center border-b border-black/15 text-[0.62rem] font-medium tracking-[0.2em] uppercase text-[var(--si-deep-brown)] transition-colors duration-300 hover:border-[var(--si-deep-brown)] hover:text-[var(--si-deep-brown)]"
                >
                  Women
                </Link>
                <Link
                  href={`${WEBSITE_SHOP}?category=men`}
                  className="inline-flex min-h-11 items-center border-b border-black/15 text-[0.62rem] font-medium tracking-[0.2em] uppercase text-[var(--si-deep-brown)] transition-colors duration-300 hover:border-[var(--si-deep-brown)] hover:text-[var(--si-deep-brown)]"
                >
                  Men
                </Link>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[0.55rem] tracking-[0.14em] uppercase text-[var(--si-muted)] sm:mt-5 sm:justify-start sm:gap-x-4 sm:text-[0.58rem] sm:tracking-[0.16em]">
              <span>Established atelier</span>
              <span className="inline-flex items-center gap-3 before:h-1 before:w-1 before:rounded-full before:bg-[var(--si-muted)] sm:gap-4">
                Complimentary delivery
              </span>
              <span className="inline-flex items-center gap-3 before:h-1 before:w-1 before:rounded-full before:bg-[var(--si-muted)] sm:gap-4">
                Worldwide returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
