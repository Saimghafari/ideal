import { connectDB } from "@/lib/databaseConnection";
import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import BranchModel from "@/models/Branch.model";
import { SHOP_CATEGORIES, queryStaticShop } from "@/lib/staticCatalog";
import { nutritionRowsFromProduct } from "@/lib/nutritionRows";

void MediaModel;
void BranchModel;

function demoCategories() {
  return SHOP_CATEGORIES.map((item) => ({
    name: item.name,
    slug: item.slug,
    image: item.image,
    children: item.children || [],
  }));
}

export async function getShopCategories() {
  try {
    await connectDB();
    const rows = await CategoryModel.find({ deletedAt: null })
      .populate({ path: "media", select: "secure_url" })
      .sort({ name: 1 })
      .lean();

    if (!rows.length) return demoCategories();

    const byId = new Map(rows.map((row) => [String(row._id), row]));
    const roots = rows.filter((row) => !row.parent || !byId.has(String(row.parent)));

    return roots.map((row) => ({
      name: row.name,
      slug: row.slug,
      image: row.media?.secure_url || "",
      children: rows
        .filter((child) => String(child.parent || "") === String(row._id))
        .map((child) => ({ name: child.name, slug: child.slug })),
    }));
  } catch {
    return demoCategories();
  }
}

export function mapProduct(product) {
  const category = product.category || {};
  return {
    _id: String(product._id),
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    category: category.name
      ? {
          name: category.name,
          slug: category.slug,
          parentSlug: category.parent?.slug || "",
          _id: String(category._id),
        }
      : null,
    media: (product.media || []).map((file) => ({
      _id: String(file._id),
      secure_url: file.secure_url,
      alt: file.alt || product.name,
      title: file.title || product.name,
    })),
    sellingPrice: Number(product.sellingPrice) || 0,
    mrp: Number(product.mrp) || 0,
    sellingPricePkr: Number(product.sellingPricePkr || product.sellingPrice) || 0,
    mrpPkr: Number(product.mrpPkr || product.mrp) || 0,
    discountPercentage: Number(product.discountPercentage) || 0,
    deliverable: product.deliverable !== false,
    todayOnly: product.todayOnly === true,
    featured: Boolean(product.featured),
    ingredientsNote: product.ingredientsNote || "",
    ingredients: Array.isArray(product.ingredients)
      ? product.ingredients.filter(Boolean)
      : [],
    nutrition: nutritionRowsFromProduct(product.nutrition),
    branches: (product.branches || []).map((branch) => ({
      _id: String(branch._id || branch),
      name: branch.name || "",
      slug: branch.slug || "",
    })),
    createdAt: product.createdAt,
  };
}

function productMatchesCategory(product, slugs) {
  const category = product.category;
  if (!category) return false;
  const own = String(category.slug || "").toLowerCase();
  const parent = String(category.parentSlug || "").toLowerCase();
  return slugs.some((slug) => slug === own || slug === parent);
}

export async function queryShopCatalog(params) {
  try {
    await connectDB();
    const total = await ProductModel.countDocuments({ deletedAt: null });
    if (!total) return queryStaticShop(params);

    let products = await ProductModel.find({ deletedAt: null })
      .populate({
        path: "category",
        select: "name slug parent",
        populate: { path: "parent", select: "name slug" },
      })
      .populate({ path: "media", select: "secure_url alt title" })
      .populate({ path: "branches", select: "name slug" })
      .lean();

    products = products.map(mapProduct);

    if (params.category) {
      const slugs = String(params.category)
        .split(",")
        .map((item) => item.trim().toLowerCase().replace(/\s+/g, "-"))
        .filter(Boolean);
      products = products.filter((product) => productMatchesCategory(product, slugs));
    }

    if (params.availability === "online") {
      products = products.filter((product) => product.deliverable && !product.todayOnly);
    }
    if (params.availability === "store") {
      products = products.filter((product) => !product.deliverable || product.todayOnly);
    }

    if (params.q) {
      const term = String(params.q).toLowerCase();
      products = products.filter((product) =>
        `${product.name} ${product.description} ${product.category?.name || ""}`
          .toLowerCase()
          .includes(term)
      );
    }

    const floor = Number(params.minPrice) || 0;
    const requestedMax = Number(params.maxPrice);
    if (requestedMax) {
      products = products.filter(
        (product) => product.sellingPrice >= floor && product.sellingPrice <= requestedMax
      );
    } else if (floor) {
      products = products.filter((product) => product.sellingPrice >= floor);
    }

    const sort = params.sort;
    if (sort === "asc") products.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "desc") products.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "price_low_high") products.sort((a, b) => a.sellingPrice - b.sellingPrice);
    if (sort === "price_high_low") products.sort((a, b) => b.sellingPrice - a.sellingPrice);

    const limit = Number(params.limit) || 9;
    const start = Number(params.page || 0) * limit;
    const pageItems = products.slice(start, start + limit + 1);
    let nextPage = null;
    if (pageItems.length > limit) {
      nextPage = Number(params.page || 0) + 1;
      pageItems.pop();
    }

    return { products: pageItems, nextPage };
  } catch {
    return queryStaticShop(params);
  }
}
