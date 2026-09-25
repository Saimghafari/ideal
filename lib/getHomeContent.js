import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import {
  STATIC_COLLECTIONS,
  getStaticProducts,
} from "@/lib/staticCatalog";

function productImage(product) {
  return product?.media?.[0]?.secure_url || "";
}

function productAlt(product) {
  return product?.media?.[0]?.alt || product?.name || "Velora garment";
}

function mapPiece(product) {
  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    size: product.category?.name || "Ready to wear",
    category: product.category?.name || "Ready to wear",
    categorySlug: product.category?.slug || "",
    featured: Boolean(product.featured),
    price: product.sellingPrice,
    pricePkr: product.sellingPricePkr,
    mrp: product.mrp,
    mrpPkr: product.mrpPkr,
    sellingPrice: product.sellingPrice,
    sellingPricePkr: product.sellingPricePkr,
    src: productImage(product),
    alt: productAlt(product),
    images: (product.media || [])
      .filter((item) => item?.secure_url)
      .map((item) => ({
        src: item.secure_url,
        alt: item.alt || product.name || "Velora garment",
      })),
    href: WEBSITE_PRODUCT_DETAILS(product.slug),
    product,
  };
}

export async function getHomeContent() {
  const catalog = getStaticProducts();
  const featured = catalog.filter((product) => product.featured);
  const featuredPieces = catalog.map(mapPiece);

  const galleryImages = getStaticProducts()
    .slice(0, 5)
    .map((product) => ({
      src: productImage(product),
      alt: productAlt(product),
      label: product.name,
      href: WEBSITE_PRODUCT_DETAILS(product.slug),
    }));

  const bySlug = (slug) => catalog.find((product) => product.slug === slug);

  const genderCollections = [
    {
      id: "men",
      title: "Men's Collections",
      href: `${WEBSITE_SHOP}?category=men`,
      featured: {
        src: "https://engine.com.pk/cdn/shop/files/men_main_tile_f60326b8-9ed2-4c35-a29f-f1dd9963568d.jpg?v=1789459385&width=1400",
        alt: "Velora men's collection",
      },
      items: [
        {
          id: "men-tops",
          title: "Tops",
          href: `${WEBSITE_SHOP}?category=men&q=polo`,
          src: "https://engine.com.pk/cdn/shop/collections/sale_front_tap.png?v=1782905134&width=900",
          alt: "Men's tops",
        },
        {
          id: "men-shirts",
          title: "Casual Shirts",
          href: `${WEBSITE_SHOP}?category=men&q=shirt`,
          src: "https://engine.com.pk/cdn/shop/collections/casual_shirt.png?v=1782905156&width=900",
          alt: "Men's casual shirts",
        },
        {
          id: "men-trousers",
          title: "Trousers",
          href: `${WEBSITE_SHOP}?category=men&q=trousers`,
          src: "https://engine.com.pk/cdn/shop/collections/truser.png?v=1782905224&width=900",
          alt: "Men's trousers",
        },
        {
          id: "men-suits",
          title: "Suits",
          href: `${WEBSITE_SHOP}?category=men&q=suit`,
          src: "https://engine.com.pk/cdn/shop/collections/co-ord_set_0f364284-d815-453e-be27-e710ad1fe777.png?v=1782905178&width=900",
          alt: "Men's suits",
        },
        {
          id: "men-tees",
          title: "T-Shirts",
          href: `${WEBSITE_SHOP}?category=men&q=t-shirt`,
          src: "https://engine.com.pk/cdn/shop/collections/T-_shirt.png?v=1782905208&width=900",
          alt: "Men's t-shirts",
        },
      ],
    },
    {
      id: "women",
      title: "Women's Collections",
      href: `${WEBSITE_SHOP}?category=women`,
      featured: {
        src: productImage(bySlug("wool-tailored-coat")),
        alt: "Velora women's collection",
      },
      items: [
        {
          id: "women-tops",
          title: "Tops",
          href: `${WEBSITE_SHOP}?category=women&q=shirt`,
          src: productImage(bySlug("cotton-poplin-shirt")),
          alt: "Women's tops",
        },
        {
          id: "women-dresses",
          title: "Dresses",
          href: `${WEBSITE_SHOP}?category=women&q=dress`,
          src: productImage(bySlug("silk-slip-dress")),
          alt: "Women's dresses",
        },
        {
          id: "women-trousers",
          title: "Trousers",
          href: `${WEBSITE_SHOP}?category=women&q=trousers`,
          src: productImage(bySlug("linen-wide-trousers")),
          alt: "Women's trousers",
        },
        {
          id: "women-outerwear",
          title: "Outerwear",
          href: `${WEBSITE_SHOP}?category=women&q=coat`,
          src: productImage(bySlug("wool-tailored-coat")),
          alt: "Women's outerwear",
        },
        {
          id: "women-knits",
          title: "Knits",
          href: `${WEBSITE_SHOP}?category=women&q=cashmere`,
          src: productImage(bySlug("cashmere-crew")),
          alt: "Women's knits",
        },
      ],
    },
  ];

  const reelVideos = [
    "https://assets.mixkit.co/videos/805/805-720.mp4",
    "https://assets.mixkit.co/videos/49381/49381-720.mp4",
    "https://assets.mixkit.co/videos/50641/50641-720.mp4",
    "https://assets.mixkit.co/videos/23327/23327-720.mp4",
    "https://assets.mixkit.co/videos/42581/42581-720.mp4",
    "https://assets.mixkit.co/videos/35987/35987-720.mp4",
    "https://assets.mixkit.co/videos/44556/44556-720.mp4",
    "https://assets.mixkit.co/videos/34567/34567-720.mp4",
  ];

  const mapReels = (products, prefix) =>
    products.map((product, index) => ({
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
      video: reelVideos[index % reelVideos.length],
    }));

  const homeReels = mapReels(catalog.slice(0, 8), "reel");
  const womenReels = mapReels(
    catalog.filter((product) => product.category?.slug === "women"),
    "reel-women"
  );

  return {
    featuredProducts: featured,
    featuredPieces,
    collections: STATIC_COLLECTIONS,
    genderCollections,
    homeReels,
    womenReels,
    galleryImages,
  };
}
