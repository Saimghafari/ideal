import { Suspense } from "react";
import ShopClient from "./ShopClient";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { buildPageMeta } from "@/lib/buildPageMeta";
import { generateBaseMetadata } from "@/lib/metadata";
import {
  SHOP_SEO,
  isUtilityQuery,
  absoluteSeoUrl,
} from "@/lib/seoPages";
import {
  buildBreadcrumbJsonLd,
  buildCollectionJsonLd,
} from "@/lib/jsonLdBuilders";
import { getPublishedProducts } from "@/lib/getPublishedProducts";

export async function generateMetadata({ searchParams }) {
  const resolved = await searchParams;

  if (resolved?.search || resolved?.q) {
    const term = resolved.search || resolved.q;
    return {
      ...generateBaseMetadata({
        title: `Search Results for "${term}"`,
        description: `Find sweets and bakery matching “${term}” at Super Ideal.`,
        url: SHOP_SEO.path,
      }),
      robots: { index: false, follow: true },
    };
  }

  if (isUtilityQuery(resolved) || resolved?.category) {
    return {
      ...buildPageMeta({
        title: "Sweets & Bakery",
        description: SHOP_SEO.description,
        path: SHOP_SEO.path,
      }),
      robots: { index: false, follow: true },
    };
  }

  return buildPageMeta({
    title: "Sweets & Bakery",
    description: SHOP_SEO.description,
    path: SHOP_SEO.path,
    keywords: "Super Ideal sweets, bakery, biscuits, cakes, gift boxes, Faisalabad",
  });
}

export default async function ShopPage() {
  const products = await getPublishedProducts({ limit: 24 });
  const collectionJsonLd = buildCollectionJsonLd({
    name: SHOP_SEO.h1,
    description: SHOP_SEO.description,
    url: absoluteSeoUrl(SHOP_SEO.path),
    products,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Products", url: SHOP_SEO.path },
  ]);

  return (
    <div className="min-h-[70vh] bg-[#FFF8F2]">
      <SeoJsonLd data={collectionJsonLd} />
      <SeoJsonLd data={breadcrumbJsonLd} />
      <Suspense fallback={null}>
        <ShopClient />
      </Suspense>
    </div>
  );
}
