import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";

export const DEFAULT_REEL_VIDEOS = [
  "https://assets.mixkit.co/videos/805/805-720.mp4",
  "https://assets.mixkit.co/videos/49381/49381-720.mp4",
  "https://assets.mixkit.co/videos/50641/50641-720.mp4",
  "https://assets.mixkit.co/videos/23327/23327-720.mp4",
  "https://assets.mixkit.co/videos/42581/42581-720.mp4",
  "https://assets.mixkit.co/videos/35987/35987-720.mp4",
  "https://assets.mixkit.co/videos/44556/44556-720.mp4",
  "https://assets.mixkit.co/videos/34567/34567-720.mp4",
];

export const DEFAULT_GENDER_COLLECTIONS = [
  {
    key: "sweets",
    title: "Sweets",
    href: `${WEBSITE_SHOP}?category=sweets`,
    featuredUrl: "/assets/home/si-cat-sweets.png",
    featuredAlt: "Super Ideal sweets",
    items: [
      {
        key: "halwa",
        title: "Halwa",
        href: `${WEBSITE_SHOP}?category=halwa`,
        url: "/assets/home/si-soan-halwa.png",
        alt: "Soan halwa",
      },
      {
        key: "namak",
        title: "Namak Pare",
        href: `${WEBSITE_SHOP}?category=namak`,
        url: "/assets/home/si-namak-pare.png",
        alt: "Namak pare",
      },
      {
        key: "kunafa",
        title: "Kunafa",
        href: `${WEBSITE_SHOP}?category=kunafa-sub`,
        url: "/assets/home/si-kunafa.png",
        alt: "Kunafa",
      },
    ],
  },
  {
    key: "bakery",
    title: "Bakery",
    href: `${WEBSITE_SHOP}?category=bakery`,
    featuredUrl: "/assets/home/si-cat-bakery.png",
    featuredAlt: "Super Ideal bakery",
    items: [
      {
        key: "croissants",
        title: "Croissants",
        href: `${WEBSITE_SHOP}?category=croissants`,
        url: "/assets/home/si-croissants.png",
        alt: "Butter croissants",
      },
      {
        key: "pastries",
        title: "Pastries",
        href: `${WEBSITE_SHOP}?category=pastries`,
        url: "/assets/home/si-pastries.png",
        alt: "Assorted pastries",
      },
      {
        key: "biscuits",
        title: "Biscuits",
        href: `${WEBSITE_SHOP}?category=biscuits`,
        url: "/assets/home/si-butter-biscuits.png",
        alt: "Butter biscuits",
      },
      {
        key: "cakes",
        title: "Cakes",
        href: `${WEBSITE_SHOP}?category=cakes`,
        url: "/assets/home/si-fudge-cake.png",
        alt: "Chocolate fudge cake",
      },
    ],
  },
];

export function productImage(product) {
  return product?.media?.[0]?.secure_url || "";
}

export function mapStaticReels(products, prefix) {
  return products.map((product, index) => ({
    id: `${prefix}-${product._id}`,
    productId: product._id,
    variantId: product._id,
    name: product.name,
    slug: product.slug,
    href: WEBSITE_PRODUCT_DETAILS(product.slug),
    size: product.sizes?.[0] || "500g",
    sellingPrice: product.sellingPrice,
    sellingPricePkr: product.sellingPricePkr,
    mrp: product.mrp,
    mrpPkr: product.mrpPkr,
    discountPercentage: product.discountPercentage,
    poster: productImage(product),
    thumb: productImage(product),
    video: DEFAULT_REEL_VIDEOS[index % DEFAULT_REEL_VIDEOS.length],
  }));
}

export function defaultReelSeed(products) {
  return products.map((product, index) => ({
    productSlug: product.slug,
    videoUrl: DEFAULT_REEL_VIDEOS[index % DEFAULT_REEL_VIDEOS.length],
    posterUrl: productImage(product),
    isActive: true,
  }));
}
