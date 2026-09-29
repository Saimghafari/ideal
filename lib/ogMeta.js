import {
  SITE_URL,
  OG_IMAGE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  BRAND_NAME,
} from "@/lib/siteMeta";

/** Collapse markdown/HTML into a single-line meta description scrapers accept. */
export function plainMetaDescription(input, max = 200) {
  if (input == null) return "";
  let text = String(input);

  for (let i = 0; i < 4; i++) {
    text = text.replace(/&amp;/gi, "&");
  }
  text = text
    .replace(/&nbsp;|&#xa0;|&#160;/gi, " ")
    .replace(/&mdash;|&#x2014;|&#8212;/gi, "—")
    .replace(/&ndash;|&#x2013;|&#8211;/gi, "–")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x[0-9a-f]+;/gi, " ")
    .replace(/&#\d+;/g, " ");

  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`+/g, "")
    .replace(/^>\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "");

  text = text.replace(/\s+/g, " ").trim();
  if (!text) return "";
  // Prefer ASCII ellipsis — some scrapers mishandle U+2026 in meta content
  if (text.length <= max) return text;

  const sliced = text.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}...`;
}

/** Fields every page must set so crawlers always see a description. */
export function socialDescriptionFields(description) {
  const metaDescription =
    plainMetaDescription(description) ||
    plainMetaDescription(
      "Super Ideal Sweets & Bakers — mithai, biscuits, bakery, and gift boxes from Faisalabad."
    );

  return {
    description: metaDescription,
    openGraphDescription: metaDescription,
    twitterDescription: metaDescription,
    otherDescription: {
      // name="og:description" fallback for picky scrapers
      "og:description": metaDescription,
    },
  };
}

export function brandTitle(title) {
  if (!title) return `${BRAND_NAME} – Sweets & Bakers`;
  return title.includes(BRAND_NAME) ? title : `${title} | ${BRAND_NAME}`;
}

export function absoluteAssetUrl(pathOrUrl) {
  if (!pathOrUrl) return OG_IMAGE;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

/** Cloudinary JPG 1200×630 — WhatsApp/Facebook reliably show JPEG, not WebP/tall PNG. */
export function toSocialOgImage(url) {
  const absolute = absoluteAssetUrl(url);
  const marker = "/image/upload/";
  const idx = absolute.indexOf(marker);
  if (idx === -1 || !absolute.includes("res.cloudinary.com")) {
    return absolute;
  }

  const after = absolute.slice(idx + marker.length);
  const parts = after.split("/");
  let start = 0;
  if (
    parts[0] &&
    !/^v\d+$/i.test(parts[0]) &&
    (parts[0].includes(",") || parts[0].includes("_"))
  ) {
    start = 1;
  }
  const path = parts.slice(start).join("/");
  return `${absolute.slice(0, idx + marker.length)}f_jpg,q_auto:good,w_1200,h_630,c_fill,g_auto/${path}`;
}

export function ogImageMime(url) {
  const clean = String(url).split("?")[0].toLowerCase();
  if (clean.includes("f_jpg") || clean.endsWith(".jpg") || clean.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".webp")) return "image/webp";
  if (clean.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

export function buildOgImage(url, alt) {
  const isDefault = !url || absoluteAssetUrl(url) === OG_IMAGE || url === OG_IMAGE;
  const resolved = isDefault ? OG_IMAGE : toSocialOgImage(url);
  const width = isDefault ? OG_IMAGE_WIDTH : 1200;
  const height = isDefault ? OG_IMAGE_HEIGHT : 630;
  const type = isDefault ? OG_IMAGE_TYPE : ogImageMime(resolved);

  return {
    url: resolved,
    secureUrl: resolved,
    width,
    height,
    type,
    alt: alt || `${BRAND_NAME} – Embroidery Wall Art`,
  };
}
