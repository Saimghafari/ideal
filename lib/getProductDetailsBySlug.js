import { cache } from "react";
import { decode } from "entities";
import { connectDB } from "@/lib/databaseConnection";
import { mapProduct } from "@/lib/liveCatalog";
import { normalizeSlug } from "@/lib/normalizeSlug";
import { fallbackVariantFromProduct } from "@/lib/staticProductHelpers";
import {
  getStaticProductBySlug,
  getStaticProductsByCategory,
} from "@/lib/staticCatalog";
import CategoryModel from "@/models/Category.model";
import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.model";
import BranchModel from "@/models/Branch.model";

void CategoryModel;
void MediaModel;
void BranchModel;

export { fallbackVariantFromProduct } from "@/lib/staticProductHelpers";

async function productFromDatabase(slug) {
  await connectDB();
  const total = await ProductModel.countDocuments({ deletedAt: null });
  if (!total) return null;

  const doc = await ProductModel.findOne({ deletedAt: null, slug })
    .populate({
      path: "category",
      select: "name slug parent",
      populate: { path: "parent", select: "name slug" },
    })
    .populate({ path: "media", select: "secure_url alt title" })
    .populate({ path: "branches", select: "name slug" })
    .lean();

  if (!doc) return { missing: true };

  const product = mapProduct(doc);
  product.description = decode(product.description || "");

  const relatedDocs = await ProductModel.find({
    deletedAt: null,
    _id: { $ne: doc._id },
    ...(doc.category?._id ? { category: doc.category._id } : {}),
  })
    .limit(4)
    .populate({
      path: "category",
      select: "name slug parent",
      populate: { path: "parent", select: "name slug" },
    })
    .populate({ path: "media", select: "secure_url alt title" })
    .lean();

  const relatedProducts = relatedDocs.map((item) => {
    const mapped = mapProduct(item);
    mapped.description = decode(mapped.description || "");
    return {
      ...mapped,
      variants: [fallbackVariantFromProduct(mapped)],
    };
  });

  return {
    missing: false,
    data: {
      product,
      variant: fallbackVariantFromProduct(product),
      colors: [],
      sizes: [],
      reviewCount: 0,
      reviewSchema: null,
      relatedProducts,
    },
  };
}

export const getProductDetailsBySlug = cache(async (rawSlug) => {
  const slug = normalizeSlug(rawSlug);
  try {
    const live = await productFromDatabase(slug);
    if (live?.missing) {
      return {
        success: false,
        notFound: true,
        message: "Product not found.",
        data: null,
      };
    }
    if (live?.data) {
      return {
        success: true,
        notFound: false,
        message: "Product data found.",
        data: live.data,
      };
    }
  } catch (error) {
    console.error("Live product lookup failed:", error);
  }

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
