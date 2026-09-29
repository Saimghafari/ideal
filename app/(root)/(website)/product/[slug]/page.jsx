import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import AutoRetryOnce from "@/components/Application/Website/AutoRetryOnce";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { generateProductMetadata } from "@/lib/metadata";
import { getProductDetailsBySlug } from "@/lib/getProductDetailsBySlug";
import { OG_IMAGE } from "@/lib/siteMeta";
import { buildProductJsonLd } from "@/lib/productJsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLdBuilders";
import { collectionPathForCategory, SHOP_PATH } from "@/lib/seoPages";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const FALLBACK_IMAGE = OG_IMAGE;

const missingMeta = {
  title: { absolute: "Item not found | Super Ideal" },
  robots: { index: false, follow: true },
};

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const { size } = await searchParams;

  try {
    const getProduct = await getProductDetailsBySlug(slug, size);

    if (getProduct.success && getProduct?.data?.product) {
      const product = getProduct.data.product;
      const variant = getProduct.data.variant;

      return generateProductMetadata({
        name: product?.name,
        description:
          product?.description ||
          `${product?.name} — sweets by Super Ideal.`,
        price: variant?.sellingPrice || product?.sellingPrice || 0,
        image:
          variant?.media?.[0]?.secure_url ||
          product?.media?.[0]?.secure_url ||
          FALLBACK_IMAGE,
        slug: product?.slug,
        category: product?.category?.name || "Clothing",
        brand: product?.brand || "Super Ideal",
        inStock: true,
      });
    }

    if (getProduct?.notFound) {
      return missingMeta;
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    ...missingMeta,
    title: { absolute: "Product unavailable | Super Ideal" },
  };
}

function ProductLoadError({ slug }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--si-deep-brown)] px-6 py-24 text-center">
      <AutoRetryOnce storageKey={`product:${slug}`} />
      <div className="nn-hairline-gold mb-8 w-12" />
      <p className="nn-label mb-4 tracking-[0.34em] text-[var(--si-burnt-orange)]">
        Please wait
      </p>
      <h1 className="nn-display text-3xl font-light text-[var(--si-cream)] sm:text-4xl">
        Loading this{" "}
        <span className="nn-display-italic text-[var(--si-burnt-orange)]">item</span>
      </h1>
      <p className="mt-5 max-w-sm text-sm font-light text-[var(--si-cream)]/50">
        Connecting to the shop. This page will refresh automatically once.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/product/${encodeURIComponent(slug)}`}
          className="nn-btn-ghost"
        >
          Try again
        </Link>
        <Link
          href={WEBSITE_SHOP}
          className="text-[0.6rem] tracking-[0.24em] uppercase text-[var(--si-cream)]/45 hover:text-[var(--si-burnt-orange)]"
        >
          Shop sweets
        </Link>
      </div>
    </div>
  );
}

const ProductPage = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { size } = await searchParams;

  const getProduct = await getProductDetailsBySlug(slug, size);

  if (getProduct?.error) {
    return <ProductLoadError slug={slug} />;
  }

  if (
    !getProduct?.success ||
    !getProduct?.data?.product ||
    getProduct?.notFound
  ) {
    notFound();
  }

  const product = getProduct.data.product;
  const variant = getProduct.data.variant;
  const reviewCount = getProduct.data.reviewCount || 0;
  const reviewSchema = getProduct.data.reviewSchema;
  const images = [
    ...(variant?.media || []).map((m) => m?.secure_url),
    ...(product?.media || []).map((m) => m?.secure_url),
  ].filter(Boolean);

  const collectionHref = collectionPathForCategory(
    product?.category?.slug || product?.category?.name
  );

  const productJsonLd = buildProductJsonLd({
    name: product.name,
    description: product.description,
    slug: product.slug,
    image: images.length ? images : OG_IMAGE,
    price: variant?.sellingPrice || product?.sellingPrice || 0,
    brand: product.brand || "Super Ideal",
    sku: variant?.sku || product.slug,
    category: product?.category?.name || "Embroidered Wall Art",
    inStock: true,
    priceValidFrom: product.createdAt || product.updatedAt,
    reviewCount: reviewSchema?.reviewCount || reviewCount,
    ratingValue: reviewSchema?.ratingValue,
    reviews: reviewSchema?.reviews || [],
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Embroidered Wall Art", url: SHOP_PATH },
    ...(product?.category?.name
      ? [{ name: product.category.name, url: collectionHref }]
      : []),
    { name: product.name, url: `/product/${product.slug}` },
  ]);

  return (
    <>
      <SeoJsonLd data={productJsonLd} />
      <SeoJsonLd data={breadcrumbJsonLd} />
      <ProductDetails
        product={product}
        variant={variant}
        colors={getProduct.data.colors}
        sizes={getProduct.data.sizes}
        reviewCount={reviewCount}
        relatedProducts={getProduct.data.relatedProducts || []}
        collectionHref={collectionHref}
      />
    </>
  );
};

export default ProductPage;
