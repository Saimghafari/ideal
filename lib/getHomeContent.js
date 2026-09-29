import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import {
  STATIC_COLLECTIONS,
  getStaticProducts,
} from "@/lib/staticCatalog";

function productImage(product) {
  return product?.media?.[0]?.secure_url || "";
}

function productAlt(product) {
  return product?.media?.[0]?.alt || product?.name || "Super Ideal sweet";
}

function mapPiece(product) {
  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    size: product.category?.name || "Sweets",
    category: product.category?.name || "Sweets",
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
        alt: item.alt || product.name || "Super Ideal sweet",
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
      id: "sweets",
      title: "Sweets",
      href: `${WEBSITE_SHOP}?category=sweets`,
      featured: {
        src: productImage(bySlug("soan-halwa")) || "/assets/home/si-soan-halwa.png",
        alt: "Super Ideal sweets",
      },
      items: [
        {
          id: "halwa",
          title: "Halwa",
          href: `${WEBSITE_SHOP}?category=halwa`,
          src: productImage(bySlug("soan-halwa")) || "/assets/home/si-soan-halwa.png",
          alt: "Soan halwa",
        },
        {
          id: "namak",
          title: "Namak Pare",
          href: `${WEBSITE_SHOP}?category=namak`,
          src: productImage(bySlug("namak-pare")) || "/assets/home/si-namak-pare.png",
          alt: "Namak pare",
        },
        {
          id: "kunafa",
          title: "Kunafa",
          href: `${WEBSITE_SHOP}?category=kunafa-sub`,
          src: productImage(bySlug("kunafa")) || "/assets/home/si-kunafa.png",
          alt: "Kunafa",
        },
      ],
    },
    {
      id: "bakery",
      title: "Bakery",
      href: `${WEBSITE_SHOP}?category=bakery`,
      featured: {
        src: productImage(bySlug("butter-croissants")) || "/assets/home/si-croissants.png",
        alt: "Super Ideal bakery",
      },
      items: [
        {
          id: "croissants",
          title: "Croissants",
          href: `${WEBSITE_SHOP}?category=croissants`,
          src: productImage(bySlug("butter-croissants")) || "/assets/home/si-croissants.png",
          alt: "Butter croissants",
        },
        {
          id: "pastries",
          title: "Pastries",
          href: `${WEBSITE_SHOP}?category=pastries`,
          src: productImage(bySlug("assorted-pastries")) || "/assets/home/si-pastries.png",
          alt: "Assorted pastries",
        },
        {
          id: "biscuits",
          title: "Biscuits",
          href: `${WEBSITE_SHOP}?category=biscuits`,
          src: productImage(bySlug("butter-biscuits")) || "/assets/home/si-butter-biscuits.png",
          alt: "Butter biscuits",
        },
        {
          id: "cakes",
          title: "Cakes",
          href: `${WEBSITE_SHOP}?category=cakes`,
          src: productImage(bySlug("chocolate-fudge-cake")) || "/assets/home/si-fudge-cake.png",
          alt: "Chocolate fudge cake",
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
      size: product.sizes?.[0] || "500g",
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
    catalog.filter((product) => product.category?.slug === "bakery"),
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
