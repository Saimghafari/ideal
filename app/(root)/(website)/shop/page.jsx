import { Suspense } from "react";
import ShopClient from "./ShopClient";
import ShopMasthead from "@/components/Application/Website/ShopMasthead";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { buildPageMeta } from "@/lib/buildPageMeta";
import { generateBaseMetadata } from "@/lib/metadata";
import {
  SHOP_SEO,
  SEO_COLLECTIONS,
  isUtilityQuery,
  absoluteSeoUrl,
} from "@/lib/seoPages";
import {
  buildBreadcrumbJsonLd,
  buildCollectionJsonLd,
} from "@/lib/jsonLdBuilders";
import { getPublishedProducts } from "@/lib/getPublishedProducts";
import Link from "next/link";

export async function generateMetadata({ searchParams }) {
  const resolved = await searchParams;

  if (resolved?.search || resolved?.q) {
    const term = resolved.search || resolved.q;
    return {
      ...generateBaseMetadata({
        title: `Search Results for "${term}"`,
        description: `Find clothing matching “${term}” at Velora.`,
        url: SHOP_SEO.path,
      }),
      robots: { index: false, follow: true },
    };
  }

  if (isUtilityQuery(resolved) || resolved?.category) {
    return {
      ...buildPageMeta({
        title: "Shop Clothing",
        description: SHOP_SEO.description,
        path: SHOP_SEO.path,
      }),
      robots: { index: false, follow: true },
    };
  }

  return buildPageMeta({
    title: "Shop Clothing",
    description: SHOP_SEO.description,
    path: SHOP_SEO.path,
    keywords: "Velora clothing, silk dress, wool coat, merino knit",
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
    { name: SHOP_SEO.h1, url: SHOP_SEO.path },
  ]);

  return (
    <div className="nn-cream-bg min-h-[70vh]">
      <SeoJsonLd data={collectionJsonLd} />
      <SeoJsonLd data={breadcrumbJsonLd} />
      <ShopMasthead
        h1={SHOP_SEO.h1}
        intro="Ready-to-wear pieces in silk, wool, and leather."
      />

      <Suspense fallback={null}>
        <ShopClient hideHeader />
      </Suspense>

      <section className="border-t border-[var(--si-mist)] px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
        <h2 className="nn-label mb-5 text-[var(--si-burnt-orange)]">Shop by category</h2>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {SEO_COLLECTIONS.filter((item) =>
            ["women", "men", "accessories"].includes(item.id)
          ).map((item) => (
            <li key={item.id}>
              <Link href={item.path} className="nn-link-quiet">
                {item.h1}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
