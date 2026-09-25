import {
  SITE_URL,
  BRAND_NAME,
  OG_IMAGE,
  MERCHANT,
  absoluteUrl,
} from "@/lib/siteMeta";
import {
  buildMerchantReturnPolicy,
  toSchemaDate,
} from "@/lib/merchantSchema";

/**
 * Product JSON-LD for Google Search rich results + Merchant Center eligibility.
 * https://developers.google.com/search/docs/appearance/structured-data/product
 */
export function buildProductJsonLd({
  name,
  description,
  slug,
  image,
  price,
  currency = MERCHANT.currency,
  brand = BRAND_NAME,
  sku,
  category,
  inStock = true,
  ratingValue,
  reviewCount,
  reviews = [],
  priceValidFrom,
}) {
  const url = absoluteUrl(`/product/${slug}`);
  const images = (Array.isArray(image) ? image : [image])
    .filter(Boolean)
    .map((src) => (String(src).startsWith("http") ? src : absoluteUrl(src)));

  const offerPrice = Number(price) || 0;
  const validFrom =
    toSchemaDate(priceValidFrom) || toSchemaDate(new Date());

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description:
      typeof description === "string"
        ? description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 5000)
        : `${name} — premium embroidery wall art by ${BRAND_NAME}.`,
    image: images.length ? images : [OG_IMAGE],
    sku: sku || slug,
    mpn: sku || slug,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    category: category || "Home & Garden > Decor > Wall Art",
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price: offerPrice.toFixed(2),
      priceValidFrom: validFrom,
      priceValidUntil: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 180
      )
        .toISOString()
        .slice(0, 10),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
        url: SITE_URL,
      },
      hasMerchantReturnPolicy: buildMerchantReturnPolicy(),
      areaServed: {
        "@type": "Place",
        name: MERCHANT.shippingRegion || "Worldwide",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          name: MERCHANT.shippingRegion || "Worldwide",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: MERCHANT.handlingMinDays,
            maxValue: MERCHANT.handlingMaxDays,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: MERCHANT.transitMinDays,
            maxValue: MERCHANT.transitMaxDays,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  const count = Number(reviewCount) || 0;
  const avg = Number(ratingValue);

  if (count > 0 && avg > 0) {
    product.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: count,
      bestRating: "5",
      worstRating: "1",
    };
  }

  if (reviews.length > 0) {
    product.review = reviews.map((item) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: item.author || "Velora customer",
      },
      datePublished: toSchemaDate(item.datePublished),
      name: item.name,
      reviewBody: item.reviewBody,
      reviewRating: {
        "@type": "Rating",
        ratingValue: Number(item.ratingValue) || 5,
        bestRating: "5",
        worstRating: "1",
      },
    }));
  }

  return product;
}
