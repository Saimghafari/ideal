import Link from "next/link";
import ShopMasthead from "@/components/Application/Website/ShopMasthead";
import ProductBox from "@/components/Application/Website/ProductBox";
import DirectAnswer from "@/components/Application/Website/DirectAnswer";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import {
  buildBreadcrumbJsonLd,
  buildCollectionJsonLd,
} from "@/lib/jsonLdBuilders";
import { SHOP_PATH, absoluteSeoUrl } from "@/lib/seoPages";
import { WEBSITE_COMMISSIONS } from "@/routes/WebsiteRoute";

export default function CollectionLanding({
  collection,
  products = [],
  question,
  answer,
}) {
  const pageUrl = absoluteSeoUrl(collection.path);
  const collectionJsonLd = buildCollectionJsonLd({
    name: collection.h1,
    description: collection.description,
    url: pageUrl,
    products,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Embroidered Wall Art", url: SHOP_PATH },
    { name: collection.h1, url: collection.path },
  ]);

  return (
    <div className="nn-cream-bg min-h-[70vh]">
      <SeoJsonLd data={collectionJsonLd} />
      <SeoJsonLd data={breadcrumbJsonLd} />
      <ShopMasthead
        eyebrow="Collection"
        h1={collection.h1}
        intro={collection.description}
        breadcrumb={collection.h1}
      />

      <section className="px-6 pb-8 pt-12 sm:px-10 sm:pt-16 lg:px-28 xl:px-36">
        <p className="mx-auto max-w-2xl text-sm font-light leading-[1.95] text-[var(--si-muted)]">
          {collection.description}{" "}
          <Link href={SHOP_PATH} className="underline underline-offset-4">
            Browse all embroidered wall art
          </Link>{" "}
          or{" "}
          <Link href={WEBSITE_COMMISSIONS} className="underline underline-offset-4">
            enquire about a custom embroidered wall art commission
          </Link>
          .
        </p>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-28 xl:px-36">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-16">
            {products.map((product, index) => (
              <ProductBox key={product._id || product.slug} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h2 className="nn-display text-2xl font-light text-[var(--si-deep-brown)]">
              Pieces are being prepared
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm font-light text-[var(--si-muted)]">
              This collection will list matching works from the atelier as they
              are published.
            </p>
            <Link href={SHOP_PATH} className="nn-btn-outline mt-8 inline-flex">
              Shop embroidered wall art
            </Link>
          </div>
        )}
      </section>

      {question && answer ? (
        <DirectAnswer
          question={question}
          answer={answer}
          href={WEBSITE_COMMISSIONS}
          linkLabel="Ask about a custom panel"
        />
      ) : null}
    </div>
  );
}
