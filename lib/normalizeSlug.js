import slugify from "slugify";

/**
 * URL-safe slug: lowercase, hyphens only, no spaces or special chars.
 * "Nature 2" / "nature  2" / "nature%202" → "nature-2"
 */
export function normalizeSlug(value) {
  let raw = String(value ?? "").trim();
  try {
    raw = decodeURIComponent(raw);
  } catch {
    // keep raw if already decoded
  }

  raw = raw.replace(/\+/g, " ").replace(/\s+/g, " ").trim();

  return slugify(raw, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/** Candidate slug strings for flexible DB lookup (legacy spaced slugs). */
export function slugLookupCandidates(value) {
  let decoded = String(value ?? "").trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // ignore
  }

  decoded = decoded.replace(/\+/g, " ").trim().toLowerCase();
  const normalized = normalizeSlug(decoded);
  const withSpaces = decoded.replace(/-/g, " ").replace(/\s+/g, " ").trim();
  const withHyphens = decoded.replace(/\s+/g, "-");

  return [...new Set([normalized, decoded, withSpaces, withHyphens].filter(Boolean))];
}
