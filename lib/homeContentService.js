import HomeGenderCollectionModel from "@/models/HomeGenderCollection.model";
import HomeReelSectionModel from "@/models/HomeReelSection.model";
import ProductModel from "@/models/Product.model";
import { getStaticProducts } from "@/lib/staticCatalog";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import {
  DEFAULT_GENDER_COLLECTIONS,
  DEFAULT_REEL_VIDEOS,
  defaultReelSeed,
  mapStaticReels,
  productImage,
} from "@/lib/homeContentDefaults";

function imageSrc(media, fallbackUrl) {
  return media?.secure_url || fallbackUrl || "";
}

export function mapGenderCollection(doc, catalog = []) {
  const bySlug = (slug) => catalog.find((product) => product.slug === slug);
  const featuredFallback =
    doc.featuredUrl ||
    productImage(bySlug(doc.featuredProductSlug)) ||
    "";

  return {
    id: doc.key,
    title: doc.title,
    href: doc.href,
    featured: {
      src: imageSrc(doc.featuredMedia, featuredFallback),
      alt: doc.featuredAlt || doc.title,
    },
    items: (doc.items || []).map((item, index) => ({
      id: item.key || `${doc.key}-${index}`,
      title: item.title,
      href: item.href,
      src:
        imageSrc(item.image, item.url) ||
        productImage(bySlug(item.productSlug)),
      alt: item.alt || item.title,
    })),
  };
}

export function mapReelItem(reel, catalog, prefix, index) {
  if (reel.isActive === false) return null;

  const staticProduct = catalog.find((product) => product.slug === reel.productSlug);
  const mongo = reel.product && typeof reel.product === "object" ? reel.product : null;
  const product = staticProduct || mongo;
  if (!reel.videoUrl && !product) return null;

  const id = product?._id || `${prefix}-${index}`;
  const media = Array.isArray(product?.media) ? product.media[0] : null;
  const poster =
    imageSrc(reel.poster, reel.posterUrl) ||
    media?.secure_url ||
    productImage(product);

  return {
    id: `${prefix}-${id}`,
    productId: product?._id || id,
    variantId: product?._id || id,
    name: product?.name || "Product",
    slug: product?.slug || "",
    href: product?.slug ? WEBSITE_PRODUCT_DETAILS(product.slug) : "/shop",
    size: product?.sizes?.[1] || product?.sizes?.[0] || "M",
    sellingPrice: product?.sellingPrice,
    sellingPricePkr: product?.sellingPricePkr ?? product?.sellingPrice,
    mrp: product?.mrp,
    mrpPkr: product?.mrpPkr ?? product?.mrp,
    discountPercentage: product?.discountPercentage || 0,
    poster,
    thumb: poster,
    video: reel.videoUrl || DEFAULT_REEL_VIDEOS[index % DEFAULT_REEL_VIDEOS.length],
  };
}

export async function seedHomeContentIfNeeded(catalog = []) {
  const [collectionCount, reelCount] = await Promise.all([
    HomeGenderCollectionModel.countDocuments(),
    HomeReelSectionModel.countDocuments(),
  ]);

  if (collectionCount === 0) {
    await HomeGenderCollectionModel.insertMany(
      DEFAULT_GENDER_COLLECTIONS.map((item) => ({
        key: item.key,
        title: item.title,
        href: item.href,
        featuredUrl: item.featuredUrl || productImage(catalog.find((p) => p.slug === item.featuredProductSlug)),
        featuredAlt: item.featuredAlt,
        items: item.items.map((card) => ({
          key: card.key,
          title: card.title,
          href: card.href,
          url: card.url || productImage(catalog.find((p) => p.slug === card.productSlug)),
          alt: card.alt,
        })),
      }))
    );
  }

  if (reelCount === 0) {
    const women = catalog.filter((product) => product.category?.slug === "women");
    await HomeReelSectionModel.insertMany([
      {
        placement: "after_men",
        reels: defaultReelSeed(catalog.slice(0, 8)),
      },
      {
        placement: "after_women",
        reels: defaultReelSeed(women.length ? women : catalog.slice(0, 5)),
      },
    ]);
  }
}

export async function loadHomeSectionsFromDb(catalog = []) {
  const [collections, reelSections] = await Promise.all([
    HomeGenderCollectionModel.find()
      .populate("featuredMedia", "secure_url alt title")
      .populate("items.image", "secure_url alt title")
      .lean(),
    HomeReelSectionModel.find()
      .populate({
        path: "reels.product",
        select: "name slug sellingPrice sellingPricePkr mrp mrpPkr discountPercentage media",
        populate: { path: "media", select: "secure_url alt" },
      })
      .populate("reels.poster", "secure_url alt title")
      .lean(),
  ]);

  const genderCollections = collections.length
    ? ["men", "women"]
        .map((key) => collections.find((item) => item.key === key))
        .filter(Boolean)
        .map((doc) => mapGenderCollection(doc, catalog))
    : null;

  const menSection = reelSections.find((item) => item.placement === "after_men");
  const womenSection = reelSections.find((item) => item.placement === "after_women");

  const homeReels = menSection
    ? menSection.reels
        .map((reel, index) => mapReelItem(reel, catalog, "reel", index))
        .filter(Boolean)
    : null;

  const womenReels = womenSection
    ? womenSection.reels
        .map((reel, index) => mapReelItem(reel, catalog, "reel-women", index))
        .filter(Boolean)
    : null;

  return { genderCollections, homeReels, womenReels };
}

export function fallbackGenderCollections(catalog) {
  return DEFAULT_GENDER_COLLECTIONS.map((item) => mapGenderCollection(item, catalog));
}

export function fallbackReels(catalog) {
  return {
    homeReels: mapStaticReels(catalog.slice(0, 8), "reel"),
    womenReels: mapStaticReels(
      catalog.filter((product) => product.category?.slug === "women"),
      "reel-women"
    ),
  };
}

export async function getProductOptions() {
  const staticProducts = getStaticProducts().map((product) => ({
    _id: String(product._id),
    slug: product.slug,
    name: product.name,
    source: "static",
  }));

  let mongo = [];
  try {
    mongo = await ProductModel.find({ deletedAt: null })
      .select("name slug")
      .sort({ name: 1 })
      .lean();
  } catch {
    mongo = [];
  }

  const seen = new Set(staticProducts.map((item) => item.slug));
  const extra = mongo
    .filter((product) => !seen.has(product.slug))
    .map((product) => ({
      _id: String(product._id),
      slug: product.slug,
      name: product.name,
      source: "catalog",
    }));

  return [...staticProducts, ...extra];
}
