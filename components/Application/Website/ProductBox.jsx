"use client";

import Image from "next/image";
import React, { useState } from "react";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import { normalizeSlug } from "@/lib/normalizeSlug";
import { productImageAlt } from "@/lib/productImageAlt";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";
import { useDispatch } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";

const money = (formatPrice, value) =>
  String(formatPrice(value) || "")
    .replace(/^Rs\s*/i, "Rs. ")
    .trim();

const ProductBox = ({ product }) => {
  const { formatPrice, resolvePrices, currency } = useCurrency();
  const prices = resolvePrices(product);
  const dispatch = useDispatch();

  const imageSrc = product?.media?.[0]?.secure_url || imgPlaceholder.src;
  const [src, setSrc] = useState(imageSrc);
  const imageAlt = productImageAlt(product?.media?.[0], product?.name);
  const hasDiscount = Number(prices.discountPercentage) > 0;
  const productHref = WEBSITE_PRODUCT_DETAILS(
    normalizeSlug(product?.slug || product?.name || "") || product?.slug
  );
  const online = product?.deliverable !== false;

  const handleAdd = () => {
    dispatch(
      addIntoCart({
        productId: product._id,
        variantId: product._id,
        name: product.name,
        url: product.slug,
        size: null,
        color: null,
        mrp: prices.mrp,
        sellingPrice: prices.sellingPrice,
        currency: prices.currency || currency,
        media: product?.media?.[0]?.secure_url,
        qty: 1,
      })
    );
    showToast("success", "Added to cart.");
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#f1e3d4] bg-white shadow-[0_6px_18px_rgba(75,46,30,0.05)]">
      <Link href={productHref} className="relative block aspect-square bg-[#f7efe6]">
        <Image
          src={src}
          alt={imageAlt}
          title={product?.media?.[0]?.title || product?.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover"
          onError={() => setSrc(imgPlaceholder.src)}
        />
        {product?.todayOnly ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#E45700] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
            Only Today
          </span>
        ) : hasDiscount ? (
          <span className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#E45700] text-[11px] font-extrabold text-white">
            -{prices.discountPercentage}%
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2.5 sm:px-3">
        {product?.category?.name ? (
          <p className="text-[11px] text-[#9a8170]">{product.category.name}</p>
        ) : null}
        <Link href={productHref}>
          <h3 className="mt-0.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-[#3a2416] sm:text-[14.5px]">
            {product?.name}
          </h3>
        </Link>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[13.5px] font-extrabold text-[#E45700]">
            {money(formatPrice, prices.sellingPrice)}
          </span>
          {hasDiscount ? (
            <span className="text-[11.5px] text-[#b7a498] line-through">
              {money(formatPrice, prices.mrp)}
            </span>
          ) : null}
        </p>
        {online ? (
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2.5 inline-flex h-8 items-center justify-center rounded-full border border-[#E45700] text-[12px] font-bold text-[#E45700] hover:bg-[#E45700] hover:text-white"
          >
            Add to Cart
          </button>
        ) : (
          <div className="mt-2.5">
            <p className="flex h-8 items-center justify-center rounded-full border border-[#efc4c4] bg-[#fff8f8] px-1 text-center text-[10.5px] font-bold text-[#d32f2f] sm:text-[11.5px]">
              Not Available Online
            </p>
            <p className="mt-1 text-center text-[11px] text-[#9a8170]">Available in Store</p>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductBox;
