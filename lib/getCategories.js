import {
  getStaticCategories,
  getStaticCategoryBySlug,
} from "@/lib/staticCatalog";

export async function getActiveCategories({ limit } = {}) {
  const categories = getStaticCategories();
  return typeof limit === "number" ? categories.slice(0, limit) : categories;
}

export async function getCategoryBySlug(slug) {
  return getStaticCategoryBySlug(slug);
}
