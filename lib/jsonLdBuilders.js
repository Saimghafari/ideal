import { SITE_URL, BRAND_NAME, absoluteUrl } from "@/lib/siteMeta";

export function buildBreadcrumbJsonLd(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
    })),
  };
}

export function buildCollectionJsonLd({
  name,
  description,
  url,
  products = [],
}) {
  const pageUrl = url.startsWith("http") ? url : absoluteUrl(url);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: BRAND_NAME,
      url: `${SITE_URL}/`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/product/${product.slug}`),
        name: product.name,
      })),
    },
  };
}

export function buildServiceJsonLd({ name, description, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: url.startsWith("http") ? url : absoluteUrl(url),
    provider: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: `${SITE_URL}/`,
    },
    serviceType: "Custom embroidered wall art commission",
    areaServed: "Worldwide",
  };
}

export function buildFaqJsonLd(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function JsonLdScript(data) {
  return JSON.stringify(data);
}
