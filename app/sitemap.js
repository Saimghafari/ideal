import { connectDB } from "@/lib/databaseConnection";
import { absoluteUrl, getCanonicalSiteUrl } from "@/lib/siteMeta";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import { SEO_CONTENT_UPDATED, getProductKeyword } from "@/lib/seoPages";
import { BRAND_NAME } from "@/lib/siteMeta";

void MediaModel;

const baseUrl = getCanonicalSiteUrl();

function toLastMod(date) {
  if (!date) return new Date(SEO_CONTENT_UPDATED);
  const d = date instanceof Date ? date : new Date(date);
  return Number.isNaN(d.getTime()) ? new Date(SEO_CONTENT_UPDATED) : d;
}

function entry(path, { lastModified, changeFrequency, priority, images } = {}) {
  const url = path.startsWith("http")
    ? path
    : absoluteUrl(path.startsWith("/") ? path : `/${path}`);

  const item = {
    url,
    lastModified: toLastMod(lastModified),
    changeFrequency: changeFrequency || "monthly",
    priority: priority ?? 0.5,
  };

  if (images?.length) {
    item.images = images.filter(Boolean);
  }

  return item;
}

async function fetchProducts() {
  try {
    await connectDB();
    return (
      (await ProductModel.find({ deletedAt: null })
        .select("slug name updatedAt media featured")
        .populate("media", "secure_url alt title")
        .sort({ updatedAt: -1 })
        .lean()) || []
    );
  } catch (error) {
    console.error("Sitemap products error:", error);
    return [];
  }
}

const STATIC_PAGES = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/cakes", changeFrequency: "weekly", priority: 0.85 },
  { path: "/catering", changeFrequency: "weekly", priority: 0.85 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/locations", changeFrequency: "monthly", priority: 0.8 },
  { path: "/commissions", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/care-guide", changeFrequency: "monthly", priority: 0.5 },
  { path: "/shipping-delivery", changeFrequency: "monthly", priority: 0.5 },
  { path: "/returns-refunds", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap() {
  const contentUpdated = new Date(SEO_CONTENT_UPDATED);
  const products = await fetchProducts();

  const staticPages = STATIC_PAGES.map((page) =>
    entry(page.path, {
      lastModified: contentUpdated,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  );

  const productPages = products
    .filter((product) => product?.slug)
    .map((product) => {
      const keyword = getProductKeyword(product.name);
      const images = (product.media || [])
        .filter((m) => m?.secure_url)
        .slice(0, 5)
        .map((m, index) => ({
          url: m.secure_url,
          title:
            m.title?.trim() ||
            `${product.name} – ${keyword} | ${BRAND_NAME}`,
          caption:
            m.alt?.trim() ||
            `${product.name} — ${keyword} by ${BRAND_NAME}${
              index > 0 ? ` (view ${index + 1})` : ""
            }`,
        }));

      return entry(`/product/${encodeURIComponent(product.slug)}`, {
        lastModified: product.updatedAt || contentUpdated,
        changeFrequency: "weekly",
        priority: product.featured ? 0.9 : 0.8,
        images,
      });
    });

  const urls = [...staticPages, ...productPages];

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[sitemap] ${urls.length} URLs for ${baseUrl} (${productPages.length} products)`
    );
  }

  return urls;
}
