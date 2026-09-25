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
    key: "men",
    title: "Men's Collections",
    href: `${WEBSITE_SHOP}?category=men`,
    featuredUrl:
      "https://engine.com.pk/cdn/shop/files/men_main_tile_f60326b8-9ed2-4c35-a29f-f1dd9963568d.jpg?v=1789459385&width=1400",
    featuredAlt: "Velora men's collection",
    items: [
      {
        key: "men-tops",
        title: "Tops",
        href: `${WEBSITE_SHOP}?category=men&q=polo`,
        url: "https://engine.com.pk/cdn/shop/collections/sale_front_tap.png?v=1782905134&width=900",
        alt: "Men's tops",
      },
      {
        key: "men-shirts",
        title: "Casual Shirts",
        href: `${WEBSITE_SHOP}?category=men&q=shirt`,
        url: "https://engine.com.pk/cdn/shop/collections/casual_shirt.png?v=1782905156&width=900",
        alt: "Men's casual shirts",
      },
      {
        key: "men-trousers",
        title: "Trousers",
        href: `${WEBSITE_SHOP}?category=men&q=trousers`,
        url: "https://engine.com.pk/cdn/shop/collections/truser.png?v=1782905224&width=900",
        alt: "Men's trousers",
      },
      {
        key: "men-suits",
        title: "Suits",
        href: `${WEBSITE_SHOP}?category=men&q=suit`,
        url: "https://engine.com.pk/cdn/shop/collections/co-ord_set_0f364284-d815-453e-be27-e710ad1fe777.png?v=1782905178&width=900",
        alt: "Men's suits",
      },
      {
        key: "men-tees",
        title: "T-Shirts",
        href: `${WEBSITE_SHOP}?category=men&q=t-shirt`,
        url: "https://engine.com.pk/cdn/shop/collections/T-_shirt.png?v=1782905208&width=900",
        alt: "Men's t-shirts",
      },
    ],
  },
  {
    key: "women",
    title: "Women's Collections",
    href: `${WEBSITE_SHOP}?category=women`,
    featuredUrl: "",
    featuredAlt: "Velora women's collection",
    featuredProductSlug: "wool-tailored-coat",
    items: [
      {
        key: "women-tops",
        title: "Tops",
        href: `${WEBSITE_SHOP}?category=women&q=shirt`,
        alt: "Women's tops",
        productSlug: "cotton-poplin-shirt",
      },
      {
        key: "women-dresses",
        title: "Dresses",
        href: `${WEBSITE_SHOP}?category=women&q=dress`,
        alt: "Women's dresses",
        productSlug: "silk-slip-dress",
      },
      {
        key: "women-trousers",
        title: "Trousers",
        href: `${WEBSITE_SHOP}?category=women&q=trousers`,
        alt: "Women's trousers",
        productSlug: "linen-wide-trousers",
      },
      {
        key: "women-outerwear",
        title: "Outerwear",
        href: `${WEBSITE_SHOP}?category=women&q=coat`,
        alt: "Women's outerwear",
        productSlug: "wool-tailored-coat",
      },
      {
        key: "women-knits",
        title: "Knits",
        href: `${WEBSITE_SHOP}?category=women&q=cashmere`,
        alt: "Women's knits",
        productSlug: "cashmere-crew",
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
    size: product.sizes?.[1] || product.sizes?.[0] || "M",
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
