/** Canonical production site config for SEO, social, and Merchant */

/** Canonical host matches Vercel primary (apex → www 308). Use www everywhere. */
export const SITE_URL = "https://www.dectorre.com";
export const SITE_HOST = "www.dectorre.com";

/** JPEG 1200×630 for WhatsApp / Facebook / iMessage (WebP often fails to unfurl). */
export const OG_IMAGE = `${SITE_URL}/assets/images/meta-image-og.jpg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = "image/jpeg";
export const SITE_LOGO = `${SITE_URL}/logo.png`;

export const BRAND_NAME = "Velora";
export const BRAND_TAGLINE = "Modern Clothing";
export const BRAND_LEGAL_NAME = "Velora";

/** Public studio inbox — shown in templates for questions / replies */
export const CONTACT_EMAIL = "dectorreofficial@gmail.com";
/** Transactional sender (orders, OTP). Do not use for conversations. */
export const NOREPLY_EMAIL = "no-reply@dectorre.com";
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
  "Velora clothing — silk, cashmere, wool, and leather pieces. Priced in Pakistani rupees.";

export const DEFAULT_KEYWORDS = [
  "Velora",
  "Velora clothing",
  "quiet luxury clothing",
  "women clothing Pakistan",
  "men clothing Pakistan",
  "silk dress",
  "wool coat",
  "cashmere knit",
];

/**
 * Primary pages Google may show as sitelinks under a brand search.
 * Keep labels short and unique — matches header/footer priority links.
 */
export const PRIMARY_NAV = [
  {
    name: "Shop",
    path: "/shop",
    description: "Browse women’s, men’s, and accessory clothing from Velora.",
  },
  {
    name: "Our Story",
    path: "/about-us",
    description: "The story of Velora — a clothing brand cut quietly.",
  },
  {
    name: "Contact",
    path: "/contact-us",
    description: "Get in touch with Velora for orders and sizing questions.",
  },
  {
    name: "FAQ",
    path: "/faq",
    description: "Answers about orders, sizes, shipping, and care.",
  },
  {
    name: "Shipping & Delivery",
    path: "/shipping-delivery",
    description: "Shipping timelines, delivery coverage, and what to expect after you order.",
  },
  {
    name: "Care Guide",
    path: "/care-guide",
    description: "How to care for Velora clothing.",
  },
  {
    name: "Returns & Refunds",
    path: "/returns-refunds",
    description: "Return window and refund policy for Velora clothing orders.",
  },
  {
    name: "Size Guide",
    path: "/wall-art-size-guide",
    description: "Clothing sizes from XS to XXL.",
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
  /** Schema shippingDestination — studio ships internationally on request */
  shippingRegion: "Worldwide",
  returnsUrl: `${SITE_URL}/returns-refunds`,
  shippingUrl: `${SITE_URL}/shipping-delivery`,
  privacyUrl: `${SITE_URL}/privacy-policy`,
  termsUrl: `${SITE_URL}/terms-and-conditions`,
};
