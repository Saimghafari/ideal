import { BRAND_NAME } from "@/lib/siteMeta";

export function productImageAlt(media, name = "") {
  if (media?.alt) return media.alt;
  if (name) return `${name} — sweets by ${BRAND_NAME}`;
  return `${BRAND_NAME} sweets`;
}
