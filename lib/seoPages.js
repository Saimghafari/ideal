import { SITE_URL, BRAND_NAME } from "@/lib/siteMeta";

/** Bump when editorial SEO copy on static pages changes (sitemap lastmod). */
export const SEO_CONTENT_UPDATED = "2026-09-11T00:00:00.000Z";

export const SHOP_PATH = "/shop";

export const HOME_SEO = {
  path: "/",
  title: "Velora — Quiet Luxury Clothing",
  h1: "Quiet luxury clothing for modern wardrobes",
  description:
    "Shop Velora clothing — silk, cashmere, and wool pieces cut with ease. A simple, classy ready-to-wear collection.",
};

export const SHOP_SEO = {
  path: SHOP_PATH,
  title: "Shop Clothing | Velora",
  h1: "The Collection",
  description:
    "Shop women’s, men’s, and accessory pieces from Velora. Silk dresses, wool coats, merino knits, and leather goods.",
};

export const COMMISSIONS_SEO = {
  path: "/commissions",
  title: "Custom Sizing & Special Orders | Velora",
  h1: "Custom sizing and special orders",
  description:
    "Ask Velora about a custom size or fabric. We reply with a timeline and an invoice in Pakistani rupees.",
};

/**
 * Indexable collection landings. Products are matched from live categories
 * and product names — never from invented catalogue data.
 */
export const SEO_COLLECTIONS = [
  {
    id: "women",
    path: "/shop?category=women",
    keyword: "women's clothing",
    title: "Women’s Clothing | Velora",
    h1: "Women",
    description:
      "Women’s clothing from Velora — silk, cashmere, linen, and wool.",
    categoryTokens: ["women", "woman", "womens"],
    productTokens: ["dress", "silk", "cashmere", "coat", "linen"],
  },
  {
    id: "men",
    path: "/shop?category=men",
    keyword: "men's clothing",
    title: "Men’s Clothing | Velora",
    h1: "Men",
    description:
      "Men’s clothing from Velora — merino knits, oxfords, and coats.",
    categoryTokens: ["men", "man", "mens"],
    productTokens: ["polo", "oxford", "overcoat", "trousers"],
  },
  {
    id: "accessories",
    path: "/shop?category=accessories",
    keyword: "fashion accessories",
    title: "Accessories | Velora",
    h1: "Accessories",
    description:
      "Leather totes, silk scarves, and belts from Velora.",
    categoryTokens: ["accessories", "accessory", "bags"],
    productTokens: ["tote", "scarf", "belt", "leather"],
  },
  {
    id: "botanical",
    path: "/shop?category=women",
    keyword: "women's clothing",
    title: "Women’s Clothing | Velora",
    h1: "Women",
    description:
      "Women’s clothing from Velora — silk, cashmere, linen, and wool.",
    categoryTokens: ["floral", "botanical", "bloom", "garden", "flower"],
    productTokens: [
      "floral",
      "bloom",
      "garden",
      "botanical",
      "rose",
      "flower",
    ],
  },
  {
    id: "wildlife",
    path: "/shop?category=men",
    keyword: "men's clothing",
    title: "Men’s Clothing | Velora",
    h1: "Men",
    description:
      "Men’s clothing from Velora — merino knits, oxfords, and coats.",
    categoryTokens: [
      "wildlife",
      "bird",
      "animal",
      "fauna",
      "peacock",
      "crane",
    ],
    productTokens: [
      "crane",
      "hummingbird",
      "koi",
      "butterfly",
      "peacock",
      "equestrian",
      "polo",
      "bird",
    ],
  },
  {
    id: "modern",
    path: "/shop?category=accessories",
    keyword: "fashion accessories",
    title: "Accessories | Velora",
    h1: "Accessories",
    description:
      "Leather totes, silk scarves, and belts from Velora.",
    categoryTokens: [
      "modern",
      "abstract",
      "geometry",
      "heritage",
      "contemporary",
    ],
    productTokens: [
      "whisper",
      "freedom",
      "abstract",
      "alpine",
      "coastal",
      "landscape",
    ],
  },
];

/** Product-specific keywords. Title stays unique via the product name. */
export const PRODUCT_KEYWORD_RULES = [
  { test: /coastal harmony/i, keyword: "coastal embroidered wall art" },
  { test: /floral muse/i, keyword: "floral embroidered wall art" },
  { test: /whispers of freedom/i, keyword: "abstract embroidered wall art" },
  { test: /koi serenity/i, keyword: "koi fish embroidered wall art" },
  { test: /hummingbird bloom/i, keyword: "hummingbird embroidered wall art" },
  { test: /equestrian polo/i, keyword: "equestrian embroidered wall art" },
  { test: /ethereal butterfly/i, keyword: "butterfly embroidered wall art" },
  { test: /elegant crane/i, keyword: "crane embroidered wall art" },
  { test: /alpine reflection/i, keyword: "embroidered landscape wall art" },
  { test: /graceful crane/i, keyword: "crane embroidered wall art" },
  { test: /royal peacock|peacock/i, keyword: "peacock embroidered wall art" },
];

export function titleCaseKeyword(keyword) {
  return String(keyword || "")
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function getProductKeyword(name = "") {
  const rule = PRODUCT_KEYWORD_RULES.find((item) => item.test.test(name));
  return rule?.keyword || "clothing";
}

export function getProductSeoTitle(name = "") {
  const keyword = titleCaseKeyword(getProductKeyword(name));
  const clean = String(name).replace(/\s+/g, " ").trim();
  return `${clean} – ${keyword} | ${BRAND_NAME}`;
}

export function matchesTokens(value, tokens) {
  const hay = String(value || "").toLowerCase();
  if (!hay) return false;
  return tokens.some((token) => hay.includes(token));
}

export function resolveCollectionFromCategory(slugOrName) {
  const value = String(slugOrName || "")
    .toLowerCase()
    .replace(/[-_]+/g, " ");
  return (
    SEO_COLLECTIONS.find((collection) =>
      matchesTokens(value, collection.categoryTokens)
    ) || null
  );
}

export function collectionPathForCategory(slugOrName) {
  return resolveCollectionFromCategory(slugOrName)?.path || SHOP_PATH;
}

export function isUtilityQuery(searchParams = {}) {
  const keys = ["search", "q", "sort", "minPrice", "maxPrice", "size", "color"];
  return keys.some((key) => {
    const value = searchParams[key];
    return value != null && String(value).trim() !== "";
  });
}

export function absoluteSeoUrl(path = "/") {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
