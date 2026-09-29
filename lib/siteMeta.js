/** Canonical production site config for SEO, social, and Merchant */

/** Canonical host. Apex should redirect to www. */
export const SITE_URL = "https://www.superideal.com";
export const SITE_HOST = "www.superideal.com";

/** JPEG 1200×630 for WhatsApp / Facebook / iMessage (WebP often fails to unfurl). */
export const OG_IMAGE = `${SITE_URL}/assets/images/meta-image-og.jpg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = "image/jpeg";
export const SITE_LOGO = `${SITE_URL}/logo.png`;

export const BRAND_NAME = "Super Ideal";
export const BRAND_TAGLINE = "Sweets & Bakers";
export const BRAND_LEGAL_NAME = "Super Ideal Sweets & Bakers";

/** Public shop inbox — shown in templates for questions / replies */
export const CONTACT_EMAIL = "info@superideal.com";
/** Transactional sender (orders, OTP). Do not use for conversations. */
export const NOREPLY_EMAIL = "no-reply@superideal.com";
export const SOCIAL_HANDLE = "";
export const SOCIAL_LINKS = {};

/** Always the production domain — never localhost (for sitemap / robots / canonicals) */
export function getCanonicalSiteUrl() {
  return SITE_URL.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const base = getCanonicalSiteUrl();
  if (!path || path === "/") return base;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const DEFAULT_DESCRIPTION =
  "Super Ideal Sweets & Bakers in Faisalabad — mithai, biscuits, bakery, cakes, pizzas, and gift boxes.";

export const DEFAULT_KEYWORDS = [
  "Super Ideal",
  "Super Ideal Sweets",
  "Faisalabad bakery",
  "mithai",
  "biscuits",
  "cakes",
  "gift boxes",
  "sweets shop",
];

/**
 * Primary pages Google may show as sitelinks under a brand search.
 * Keep labels short and unique — matches header/footer priority links.
 */
export const PRIMARY_NAV = [
  {
    name: "Shop",
    path: "/shop",
    description: "Shop Super Ideal sweets, biscuits, bakery, cakes, and gift boxes.",
  },
  {
    name: "Cakes",
    path: "/cakes",
    description: "Celebration cakes from Super Ideal Sweets & Bakers.",
  },
  {
    name: "Catering",
    path: "/catering",
    description: "Party trays and sweet boxes for celebrations in Faisalabad.",
  },
  {
    name: "Locations",
    path: "/locations",
    description: "Super Ideal branches in Faisalabad.",
  },
  {
    name: "Our Story",
    path: "/about-us",
    description: "The story of Super Ideal Sweets & Bakers in Faisalabad.",
  },
  {
    name: "Contact",
    path: "/contact-us",
    description: "Get in touch with Super Ideal about orders, cakes, and catering.",
  },
  {
    name: "FAQ",
    path: "/faq",
    description: "Answers about orders, freshness, shipping, and returns.",
  },
  {
    name: "Shipping & Delivery",
    path: "/shipping-delivery",
    description: "How Super Ideal packs and delivers sweets and bakery.",
  },
  {
    name: "Care Guide",
    path: "/care-guide",
    description: "How to store Super Ideal sweets, biscuits, and cakes.",
  },
  {
    name: "Returns & Refunds",
    path: "/returns-refunds",
    description: "Return window and refund policy for Super Ideal orders.",
  },
];

/**
 * robots.txt blocks only URLs crawlers should not fetch.
 * Utility storefront pages stay crawlable so Google can see noindex,follow.
 */
export const ROBOTS_DISALLOW = ["/admin/", "/api/"];

/** Merchant / shipping defaults used in Organization + Product schema */
export const MERCHANT = {
  currency: "PKR",
  priceRange: "$$",
  paymentAccepted: "Invoice",
  shippingCountry: "PK",
  /** Typical handling time after payment confirmation */
  handlingMinDays: 2,
  handlingMaxDays: 4,
  /** Typical transit after dispatch */
  transitMinDays: 3,
  transitMaxDays: 14,
  /** Customer must report transit damage (48 hours) */
  returnWindowDays: 2,
  /** Schema shippingDestination — shop delivers across Pakistan */
  shippingRegion: "Pakistan",
  returnsUrl: `${SITE_URL}/returns-refunds`,
  shippingUrl: `${SITE_URL}/shipping-delivery`,
  privacyUrl: `${SITE_URL}/privacy-policy`,
  termsUrl: `${SITE_URL}/terms-and-conditions`,
};
