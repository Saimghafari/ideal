import { BRAND_NAME, SITE_URL } from "@/lib/siteMeta";

/** Bump when editorial SEO copy on static pages changes (sitemap lastmod). */
export const SEO_CONTENT_UPDATED = "2026-09-29T00:00:00.000Z";

export const SHOP_PATH = "/shop";

export const HOME_SEO = {
  path: "/",
  title: "Super Ideal Sweets & Bakers",
  h1: "More than sweets, it's a feeling",
  description:
    "Fresh bakery, mithai, biscuits, cakes, and gift boxes from Super Ideal in Faisalabad.",
};

export const SHOP_SEO = {
  path: SHOP_PATH,
  title: "Sweets & Bakery | Super Ideal",
  h1: "Sweets & Bakery",
  description:
    "Shop Super Ideal sweets, biscuits, bakery, cakes, pizzas, and gift boxes. Freshly prepared in Faisalabad, with home delivery on selected products.",
};

export const COMMISSIONS_SEO = {
  path: "/commissions",
  title: "Custom Cakes & Catering | Super Ideal",
  h1: "Custom cakes and catering",
  description:
    "Ask Super Ideal about a celebration cake or catering tray. We reply with a timeline and an invoice in Pakistani rupees.",
};

/**
 * Indexable shop collections. Products are matched from catalogue tags.
 */
export const SEO_COLLECTIONS = [
  {
    id: "sweets",
    path: "/shop?category=sweets",
    keyword: "mithai and sweets",
    title: "Sweets | Super Ideal",
    h1: "Sweets",
    description: "Traditional sweets and mithai from Super Ideal, packed fresh.",
    categoryTokens: ["sweets", "mithai", "halwa"],
    productTokens: ["halwa", "mithai", "kunafa", "namak"],
  },
  {
    id: "bakery",
    path: "/shop?category=bakery",
    keyword: "fresh bakery",
    title: "Bakery | Super Ideal",
    h1: "Bakery",
    description: "Oven-fresh bakery, croissants, and pastries from Super Ideal.",
    categoryTokens: ["bakery", "pastry", "croissant"],
    productTokens: ["croissant", "pastry", "bakery"],
  },
  {
    id: "biscuits",
    path: "/shop?category=biscuits",
    keyword: "biscuits",
    title: "Biscuits | Super Ideal",
    h1: "Biscuits",
    description: "Butter, coconut, and atta biscuits baked in store.",
    categoryTokens: ["biscuits", "biscuit"],
    productTokens: ["biscuit", "butter", "coconut", "atta"],
  },
  {
    id: "cakes",
    path: "/shop?category=cakes",
    keyword: "celebration cakes",
    title: "Cakes | Super Ideal",
    h1: "Cakes",
    description: "Chocolate, fruit cream, and celebration cakes from the counter.",
    categoryTokens: ["cakes", "cake"],
    productTokens: ["cake", "fudge", "cream"],
  },
  {
    id: "gift-boxes",
    path: "/shop?category=gift-boxes",
    keyword: "gift boxes",
    title: "Gift Boxes | Super Ideal",
    h1: "Gift Boxes",
    description: "Dry fruit baskets and gift boxes for sharing.",
    categoryTokens: ["gift", "gifts", "hamper"],
    productTokens: ["gift", "basket", "dry fruit"],
  },
  {
    id: "catering",
    path: "/catering",
    keyword: "catering trays",
    title: "Catering | Super Ideal",
    h1: "Catering",
    description: "Party trays, savoury platters, and sweet boxes for celebrations.",
    categoryTokens: ["catering", "tray", "platter"],
    productTokens: ["tray", "platter", "catering"],
  },
];

export const PRODUCT_KEYWORD_RULES = [
  { test: /halwa|mithai|kunafa/i, keyword: "traditional sweets" },
  { test: /biscuit/i, keyword: "fresh biscuits" },
  { test: /cake/i, keyword: "celebration cake" },
  { test: /croissant|pastr/i, keyword: "fresh bakery" },
  { test: /pizza/i, keyword: "bakery pizza" },
  { test: /gift|basket|dry fruit/i, keyword: "gift box" },
  { test: /tray|platter|catering/i, keyword: "catering tray" },
];

export function titleCaseKeyword(keyword) {
  return String(keyword || "")
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function getProductKeyword(name = "") {
  const rule = PRODUCT_KEYWORD_RULES.find((item) => item.test.test(name));
  return rule?.keyword || "sweets and bakery";
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
