import Image from "next/image";
import Link from "next/link";
import React from "react";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const GalleryTile = ({ image, className = "", sizes }) => (
  <Link
    href={image.href || WEBSITE_SHOP}
    className={`group relative block overflow-hidden bg-[var(--si-deep-brown)] ring-1 ring-[var(--si-burnt-orange)]/15 ${className}`}
  >
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      className="object-cover object-center lg:object-contain transition-opacity duration-500 group-hover:opacity-90"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--si-deep-brown)]/55 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 translate-y-1 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
      <p className="nn-label text-[var(--si-cream)] text-[0.55rem] line-clamp-1">
        {image.label}
      </p>
    </div>
  </Link>
);

const GalleryGrid = ({ images = [] }) => {
  if (!images.length) return null;

  const tiles = [...images];
  while (tiles.length < 5 && images.length) {
    tiles.push(images[tiles.length % images.length]);
  }

  return (
    <section className="relative overflow-hidden bg-[var(--si-deep-brown)] px-6 sm:px-10 lg:px-28 xl:px-36 py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgb(42_36_28_/_0.55)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgb(184_147_61_/_0.06)_0%,_transparent_45%)]"
      />
      <div className="nn-grain absolute inset-0 z-[1]" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 sm:mb-20">
          <div className="max-w-xl">
            <div className="nn-hairline-gold w-20 mb-8" />
            <p className="nn-label text-[var(--si-burnt-orange)] mb-5">The Gallery</p>
            <h2 className="nn-display text-5xl sm:text-6xl lg:text-[4rem] font-light text-[var(--si-cream)] leading-[0.95]">
              Art for
              <br />
              <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                every wall
              </span>
            </h2>
          </div>
          <div className="max-w-xs lg:text-right">
            <p className="text-sm font-light leading-relaxed text-[var(--si-cream)]/50">
              A living archive of stitch, colour, and composition — embroidery
              artwork made to settle into the rooms it enters.
            </p>
            <Link
              href={WEBSITE_SHOP}
              className="nn-link-quiet mt-6 inline-block text-[var(--si-cream)]/70 border-[var(--si-cream)]/25 hover:text-[var(--si-burnt-orange)] hover:border-[var(--si-burnt-orange)]"
            >
              Browse All
            </Link>
          </div>
        </div>

        {/* Mobile / tablet: two balanced columns */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:hidden">
          <div className="flex flex-col gap-2.5 sm:gap-4">
            <GalleryTile
              image={tiles[1]}
              className="aspect-[3/4]"
              sizes="50vw"
            />
            <GalleryTile
              image={tiles[2]}
              className="aspect-[3/4]"
              sizes="50vw"
            />
            <GalleryTile
              image={tiles[3]}
              className="aspect-[3/4]"
              sizes="50vw"
            />
          </div>
          <div className="flex h-full min-h-0 flex-col gap-2.5 sm:gap-4">
            <GalleryTile
              image={tiles[0]}
              className="min-h-0 flex-[1.65]"
              sizes="50vw"
            />
            <GalleryTile
              image={tiles[4]}
              className="min-h-0 flex-1"
              sizes="50vw"
            />
          </div>
        </div>

        {/* Desktop: previous three-column layout */}
        <div className="hidden lg:grid grid-cols-3 gap-5 items-stretch">
          <div className="flex flex-col gap-5">
            <GalleryTile
              image={tiles[1]}
              className="aspect-[4/3]"
              sizes="33vw"
            />
            <GalleryTile
              image={tiles[2]}
              className="aspect-[4/3]"
              sizes="33vw"
            />
          </div>

          <GalleryTile
            image={tiles[0]}
            className="aspect-auto h-full min-h-[360px]"
            sizes="33vw"
          />

          <div className="flex flex-col gap-5">
            <GalleryTile
              image={tiles[3]}
              className="aspect-[4/3] flex-1"
              sizes="33vw"
            />
            <GalleryTile
              image={tiles[4]}
              className="aspect-[4/3] flex-1"
              sizes="33vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryGrid;
