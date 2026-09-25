import {
  getStaticProducts,
  getStaticProductsByCategory,
} from "@/lib/staticCatalog";
import { SEO_COLLECTIONS } from "@/lib/seoPages";

export async function getPublishedProducts({ limit = 48 } = {}) {
  return getStaticProducts({ limit });
}

export async function getCollectionProducts(collectionId, { limit = 48 } = {}) {
  const collection = SEO_COLLECTIONS.find((item) => item.id === collectionId);
  if (!collection) return [];
  return getStaticProductsByCategory(collection.id, { limit });
}
