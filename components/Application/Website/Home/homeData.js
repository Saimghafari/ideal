import { STATIC_COLLECTIONS, STATIC_PRODUCTS } from "@/lib/staticCatalog";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";

export const collections = STATIC_COLLECTIONS;

export const featuredPieces = STATIC_PRODUCTS.filter((item) => item.featured)
  .slice(0, 4)
  .map((product) => ({
    id: product._id,
    name: product.name,
    size: product.category?.name,
    price: product.sellingPrice,
    src: product.media[0]?.secure_url,
    href: WEBSITE_PRODUCT_DETAILS(product.slug),
  }));

export const promises = [
  "Free returns",
  "Thoughtful fabrics",
  "Secure delivery",
  "Made to last",
];
