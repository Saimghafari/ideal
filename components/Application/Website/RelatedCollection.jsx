"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { normalizeSlug } from "@/lib/normalizeSlug";
import { productImageAlt } from "@/lib/productImageAlt";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";

const RelatedCard = ({ product, layout = "grid" }) => {
  const { formatPrice, resolvePrices } = useCurrency();
  const prices = resolvePrices(product);
  const imageSrc = product?.media?.[0]?.secure_url || imgPlaceholder.src;
  const [src, setSrc] = useState(imageSrc);
  const hasDiscount = Number(prices.discountPercentage) > 0;
  const href = WEBSITE_PRODUCT_DETAILS(
    normalizeSlug(product?.slug || product?.name || "") || product?.slug
  );

  return (
    <article
      className={`group ${
        layout === "row"
          ? "w-[calc(50vw-2.25rem)] shrink-0 sm:w-[calc(50vw-3rem)] lg:w-[250px]"
          : "w-full"
      }`}
    >
      <Link href={href} prefetch className="block">
        <div className="relative mb-5 aspect-[3/4] overflow-hidden bg-[var(--si-mist)]">
          <Image
            src={src}
            alt={productImageAlt(product?.media?.[0], product?.name)}
            title={product?.media?.[0]?.title || product?.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={() => setSrc(imgPlaceholder.src)}
          />
          {hasDiscount && (
            <span className="absolute left-3 top-3 bg-[var(--si-deep-brown)]/80 px-2 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--si-cream)]">
              −{prices.discountPercentage}%
            </span>
          )}
        </div>

        <div className="border-t border-[var(--si-mist)] pt-4">
          {product?.category?.name && (
            <p className="mb-2 text-[0.48rem] uppercase tracking-[0.22em] text-[var(--si-burnt-orange)]">
              {product.category.name}
            </p>
          )}
          <h3 className="nn-display line-clamp-2 text-[1.15rem] font-light leading-snug text-[var(--si-deep-brown)] sm:text-[1.28rem]">
            {product?.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
            <span className="text-sm font-light tracking-[0.04em] text-[var(--si-deep-brown)]">
              {formatPrice(prices.sellingPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs font-light text-[var(--si-fog)] line-through">
                {formatPrice(prices.mrp)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

const RelatedCollection = ({
  products = [],
  categoryName,
  collectionHref,
}) => {
  if (!products.length) return null;

  const scrollOnSmall = products.length > 2;
  const scrollOnLarge = products.length > 4;

  const grid = (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-16">
      {products.map((product, index) => (
        <div
          key={product._id || product.slug || index}
          className={index % 2 === 1 ? "mt-10 lg:mt-12" : ""}
        >
          <RelatedCard product={product} />
        </div>
      ))}
    </div>
  );

  const row = (label) => (
    <div className="overflow-x-hidden">
      <div className="pd-row-scroll flex w-max gap-4 sm:gap-8 lg:gap-10">
        {[0, 1].map((copy) => (
          <div key={`${label}-${copy}`} className="flex items-start gap-4 sm:gap-8 lg:gap-10" aria-hidden={copy === 1}>
            {products.map((product, index) => (
              <div
                key={`${product._id || product.slug || index}-${copy}`}
                className={index % 2 === 1 ? "max-lg:mt-10" : ""}
              >
                <RelatedCard product={product} layout="row" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-x-hidden bg-[var(--si-cream)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--si-mist)]" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mb-12 flex flex-col gap-8 sm:mb-16 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-6 h-px w-14 bg-[var(--si-burnt-orange)]" />
            <p className="mb-4 text-[0.5rem] uppercase tracking-[0.32em] text-[var(--si-burnt-orange)]">
              {categoryName ? `From ${categoryName}` : "The collection"}
            </p>
            <h2 className="nn-display text-3xl font-light leading-[1.05] text-[var(--si-deep-brown)] sm:text-4xl lg:text-[2.85rem]">
              More from this
              <br />
              <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                collection
              </span>
            </h2>
          </div>
          <div className="max-w-xs lg:text-right">
            <p className="text-sm font-light leading-relaxed text-[var(--si-muted)]">
              Pieces from the same house, finished with the same hand.
            </p>
            <Link
              href={collectionHref}
              className="mt-5 inline-block text-[0.62rem] uppercase tracking-[0.2em] text-[var(--si-deep-brown)] underline decoration-[var(--si-burnt-orange)] underline-offset-[6px]"
            >
              View full collection
            </Link>
          </div>
        </div>

        {!scrollOnSmall && grid}

        {scrollOnSmall && !scrollOnLarge && (
          <>
            <div className="lg:hidden">{row("small")}</div>
            <div className="hidden lg:block">{grid}</div>
          </>
        )}

        {scrollOnLarge && row("large")}
      </div>
    </section>
  );
};

export default RelatedCollection;
