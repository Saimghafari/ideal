import {
  SITE_URL,
  OG_IMAGE,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  BRAND_NAME,
} from "@/lib/siteMeta";
import {
  plainMetaDescription,
  brandTitle,
  buildOgImage,
  socialDescriptionFields,
} from "@/lib/ogMeta";
import { getProductSeoTitle, SHOP_PATH } from "@/lib/seoPages";

export function generateBaseMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  image = OG_IMAGE,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = BRAND_NAME,
  category,
  price,
  currency = "PKR",
  availability = "in stock",
  brand = BRAND_NAME,
}) {
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const pageTitle = brandTitle(title);
  const { description: metaDescription, otherDescription } =
    socialDescriptionFields(description || DEFAULT_DESCRIPTION);
  const allKeywords = [...DEFAULT_KEYWORDS, ...keywords];
  const ogImage = buildOgImage(
    image,
    title || `${BRAND_NAME} – Sweets & Bakers`
  );

  const metadata = {
    title: { absolute: pageTitle },
    description: metaDescription,
    keywords: allKeywords,
    authors: [{ name: author }],
    creator: author,
    publisher: BRAND_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url || "/",
    },
    openGraph: {
      type: type === "product" ? "website" : type,
      locale: "en_US",
      url: fullUrl,
      siteName: BRAND_NAME,
      title: pageTitle,
      description: metaDescription,
      images: [ogImage],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      site: BRAND_NAME,
      creator: BRAND_NAME,
      title: pageTitle,
      description: metaDescription,
      images: [
        {
          url: ogImage.url,
          alt: ogImage.alt,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      ...otherDescription,
    },
  };

  if (type === "product" && price) {
    metadata.other = {
      ...metadata.other,
      "product:price:amount": String(price),
      "product:price:currency": currency,
      "product:availability": availability,
      "product:brand": brand,
      ...(category && { "product:category": category }),
      "twitter:label1": "Price",
      "twitter:data1": `Rs ${price}`,
      "twitter:label2": "Availability",
      "twitter:data2": availability,
    };
  }

  return metadata;
}

export function generateProductMetadata(product) {
  const fallback = `Shop ${product.name} — sweets and bakery from ${BRAND_NAME} in Faisalabad.`;
  const cleaned = plainMetaDescription(product.description);
  const description =
    cleaned && cleaned.length >= 40 ? cleaned : plainMetaDescription(fallback);

  return generateBaseMetadata({
    title: getProductSeoTitle(product.name),
    description,
    keywords: [
      product.name,
      product.category,
      "sweets and bakery",
      "mithai",
      "fresh bakery",
    ],
    image: product.image,
    url: `/product/${product.slug}`,
    type: "product",
    category: product.category,
    price: product.price?.toString?.() || product.price || "0",
    currency: "PKR",
    availability: product.inStock ? "in stock" : "out of stock",
    brand: product.brand || BRAND_NAME,
  });
}

export function generateCategoryMetadata(category) {
  return generateBaseMetadata({
    title: `${category.name} Collection`,
    description:
      category.description ||
      `Explore the ${category.name} collection — sweets, bakery, and gift boxes from ${BRAND_NAME}.`,
    keywords: [
      category.name,
      "sweets",
      "bakery",
      "gift boxes",
    ],
    url: SHOP_PATH,
    type: "website",
  });
}

export function generatePageMetadata(page) {
  return generateBaseMetadata({
    title: page.title,
    description: page.description || DEFAULT_DESCRIPTION,
    keywords: page.keywords || [],
    url: `/${page.slug}`,
    type: "website",
  });
}
