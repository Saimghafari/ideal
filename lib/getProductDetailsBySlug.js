import { cache } from "react";
import { fallbackVariantFromProduct } from "@/lib/staticProductHelpers";
import {
  getStaticProductBySlug,
  getStaticProductsByCategory,
} from "@/lib/staticCatalog";

export { fallbackVariantFromProduct } from "@/lib/staticProductHelpers";

export const getProductDetailsBySlug = cache(async (rawSlug) => {
  const product = getStaticProductBySlug(rawSlug);

  if (!product) {
    return {
      success: false,
      notFound: true,
      message: "Product not found.",
      data: null,
    };
  }

  const relatedProducts = getStaticProductsByCategory(product.category?.slug)
    .filter((item) => item._id !== product._id)
    .slice(0, 4)
    .map((item) => ({
      ...item,
      variants: [fallbackVariantFromProduct(item)],
    }));

  return {
    success: true,
    notFound: false,
    message: "Product data found.",
    data: {
      product,
      variant: fallbackVariantFromProduct(product),
      colors: [],
      sizes: product.sizes || [],
      reviewCount: 0,
      reviewSchema: null,
      relatedProducts,
    },
  };
});
