"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const FeaturedPieces = ({ pieces = [] }) => {
  const showcase = useMemo(() => {
    const featured = pieces.filter((piece) => piece.featured);
    const source = featured.length ? featured : pieces;

    return source
      .map((piece) => {
        const images = piece.images?.length
          ? piece.images
          : piece.src
            ? [{ src: piece.src, alt: piece.alt || piece.name }]
            : [];

        if (!images.length) return null;

        return {
          id: piece.id,
          name: piece.name,
          href: piece.href || WEBSITE_SHOP,
          hero: images[0],
          card: images[1] || images[0],
          thumb: images[0],
        };
      })
      .filter(Boolean);
  }, [pieces]);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = showcase[activeIndex] || showcase[0];

  if (!active) return null;

  return (
    <section
      aria-labelledby="featured-collections-heading"
      className="scroll-mt-24 overflow-x-hidden border-t border-[var(--si-mist)] bg-[var(--si-cream)]"
    >
      <div className="mx-auto grid w-full max-w-[88rem] grid-cols-1 items-center gap-10 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-2 lg:items-stretch lg:gap-8 lg:px-12 lg:py-16 xl:gap-14 xl:px-16">
        <div className="flex min-w-0 flex-col lg:h-full">
          <header className="lg:pl-2 xl:pl-6">
            <h2
              id="featured-collections-heading"
              className="text-[1.85rem] font-medium leading-[0.95] tracking-[-0.04em] text-[var(--si-deep-brown)] uppercase sm:text-[2.35rem] lg:text-[2.55rem] xl:text-[3.15rem]"
            >
              Featured Products
            </h2>
            <p className="mt-3 text-[0.95rem] font-normal text-[var(--si-muted)] sm:mt-4 sm:text-[1.05rem]">
              Average ends here
            </p>
          </header>

          <div className="mt-10 flex flex-1 items-center justify-center lg:mt-0">
            <Link
              href={active.href}
              aria-label={`View ${active.name}`}
              className="block w-[min(100%,17.5rem)] rounded-[1.25rem] border border-[var(--si-mist)] bg-[var(--si-cream)] p-[0.7rem] sm:w-[18.5rem] sm:rounded-[1.4rem] sm:p-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-[var(--si-mist)] sm:rounded-[1.05rem]">
                <Image
                  key={`${active.id}-card`}
                  src={active.card.src}
                  alt={active.card.alt || active.name}
                  fill
                  sizes="(min-width: 1024px) 296px, 80vw"
                  className="object-cover"
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="relative min-w-0 pr-[3.25rem] sm:pr-16 lg:pr-[3.75rem]">
          <Link
            href={active.href}
            aria-label={`View ${active.name}`}
            className="relative block aspect-[3/4] w-full overflow-hidden rounded-[1.4rem] bg-[var(--si-mist)] sm:rounded-[1.55rem]"
          >
            <Image
              key={`${active.id}-hero`}
              src={active.hero.src}
              alt={active.hero.alt || active.name}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
              priority={activeIndex === 0}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5.75rem] font-light leading-none text-[var(--si-cream)] drop-shadow-[0_2px_12px_rgba(75,46,30,0.22)] sm:text-[7.25rem] xl:text-[8.25rem]"
            >
              V
            </span>
          </Link>

          <div
            role="tablist"
            aria-label="Featured products"
            className="absolute top-1/2 right-0 z-10 flex max-h-[78%] -translate-y-1/2 flex-col items-center gap-3 overflow-y-auto overscroll-contain py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3.5 [&::-webkit-scrollbar]:hidden"
          >
            {showcase.map((piece, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={piece.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={piece.name}
                  onClick={() => setActiveIndex(index)}
                  className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[var(--si-mist)] shadow-[0_3px_10px_rgba(75,46,30,0.18)] ring-2 ring-[var(--si-cream)] transition-transform duration-300 sm:h-12 sm:w-12 ${
                    selected ? "scale-110" : "hover:scale-105"
                  }`}
                >
                  <Image
                    src={piece.thumb.src}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPieces;
