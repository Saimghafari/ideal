"use client";

import Image from "next/image";
import React, { useState } from "react";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import { normalizeSlug } from "@/lib/normalizeSlug";
import { productImageAlt } from "@/lib/productImageAlt";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";

const ProductBox = ({ product }) => {
  const { formatPrice, resolvePrices } = useCurrency();
  const prices = resolvePrices(product);

  const imageSrc = product?.media?.[0]?.secure_url || imgPlaceholder.src;
  const [src, setSrc] = useState(imageSrc);
  const imageAlt = productImageAlt(product?.media?.[0], product?.name);
  const hasDiscount = Number(prices.discountPercentage) > 0;
  const productHref = WEBSITE_PRODUCT_DETAILS(
    normalizeSlug(product?.slug || product?.name || "") || product?.slug
  );

  return (
    <article className="group block">
      <Link href={productHref} prefetch={true} className="block">
        <div className="relative mb-5 aspect-[3/4] overflow-hidden bg-[var(--si-mist)]">
          <Image
            src={src}
            alt={imageAlt}
            title={product?.media?.[0]?.title || product?.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={() => setSrc(imgPlaceholder.src)}
          />
          {hasDiscount && (
            <span className="absolute left-3 top-3 text-[0.62rem] tracking-[0.16em] uppercase text-[var(--si-cream)] bg-[var(--si-deep-brown)]/80 px-2 py-1">
              −{prices.discountPercentage}%
            </span>
          )}
        </div>

        <div>
          {product?.category?.name && (
            <p className="nn-label mb-2 text-[0.48rem] text-[var(--si-burnt-orange)]">
              {product.category.name}
            </p>
          )}
          <h3 className="text-[0.95rem] font-light leading-snug text-[var(--si-deep-brown)] line-clamp-2 sm:text-[1.05rem]">
            {product?.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3">
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

export default ProductBox;
