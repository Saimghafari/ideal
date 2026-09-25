const unsplash = (id, { w = 1200, q = 80 } = {}) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL"];
const ACCESSORY_SIZES = ["One Size"];

export const STATIC_CATEGORIES = [
  {
    _id: "cat-women",
    name: "Women",
    slug: "women",
    shortDescription: "Quiet luxury for everyday dressing.",
  },
  {
    _id: "cat-men",
    name: "Men",
    slug: "men",
    shortDescription: "Tailored essentials with ease.",
  },
  {
    _id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    shortDescription: "Finishing pieces in leather and silk.",
  },
];

function media(id, alt, w = 1200) {
  return {
    _id: `media-${id}`,
    secure_url: unsplash(id, { w }),
    alt,
    title: alt,
  };
}

function product({
  id,
  name,
  slug,
  categoryId,
  description,
  images,
  sellingPrice,
  mrp,
  featured = false,
  sizes = CLOTHING_SIZES,
}) {
  const category = STATIC_CATEGORIES.find((item) => item._id === categoryId);
  const discountPercentage =
    mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  return {
    _id: id,
    name,
    slug,
    description,
    category,
    media: images,
    sellingPrice,
    mrp,
    sellingPricePkr: sellingPrice,
    mrpPkr: mrp,
    discountPercentage,
    featured,
    sizes,
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  };
}

export const STATIC_PRODUCTS = [
  product({
    id: "p-silk-slip-dress",
    name: "Silk Slip Dress",
    slug: "silk-slip-dress",
    categoryId: "cat-women",
    featured: true,
    sellingPrice: 18500,
    mrp: 22000,
    description:
      "A bias-cut silk slip with a quiet sheen. Wear it alone or layered under a coat — fluid, light, and made for evenings or unhurried days.",
    images: [
      media("photo-1496747611176-843222e1e57c", "Silk slip dress on model"),
      media("photo-1515886657613-9f3515b0c78f", "Silk dress editorial"),
    ],
  }),
  product({
    id: "p-cashmere-crew",
    name: "Cashmere Crew",
    slug: "cashmere-crew",
    categoryId: "cat-women",
    featured: true,
    sellingPrice: 24500,
    mrp: 29000,
    description:
      "Soft cashmere in a clean crew neck. Relaxed through the body with a refined rib at the cuff and hem.",
    images: [
      media("photo-1618354691373-d851c5c3a990", "Cashmere crew knit"),
      media("photo-1576566588028-4147f3842f27", "Knitwear detail"),
    ],
  }),
  product({
    id: "p-wool-coat",
    name: "Wool Tailored Coat",
    slug: "wool-tailored-coat",
    categoryId: "cat-women",
    featured: true,
    sellingPrice: 42000,
    mrp: 49000,
    description:
      "A long wool coat with a clean shoulder and a single-breasted front. Structured enough for the city, soft enough for every day.",
    images: [
      media("photo-1483985988355-763728e1935b", "Wool tailored coat"),
      media("photo-1490481651871-ab68de25d43d", "Coat street look"),
    ],
  }),
  product({
    id: "p-linen-trousers",
    name: "Linen Wide Trousers",
    slug: "linen-wide-trousers",
    categoryId: "cat-women",
    sellingPrice: 14500,
    mrp: 17500,
    description:
      "High-rise linen trousers with a wide, easy leg. Pressed crease, hidden hook, and a fluid drape.",
    images: [
      media("photo-1529139574466-a303027c1d8b", "Linen wide trousers"),
      media("photo-1469334031218-e382a71b716b", "Wide-leg trousers look"),
    ],
  }),
  product({
    id: "p-poplin-shirt",
    name: "Cotton Poplin Shirt",
    slug: "cotton-poplin-shirt",
    categoryId: "cat-women",
    sellingPrice: 9800,
    mrp: 12500,
    description:
      "Crisp cotton poplin with a concealed placket and mother-of-pearl buttons. Tuck it in or wear it open over a slip.",
    images: [
      media("photo-1487222477894-8943e31ef7b2", "Cotton poplin shirt"),
      media("photo-1483985988355-763728e1935b", "Shirt styling"),
    ],
  }),
  product({
    id: "p-merino-polo",
    name: "Merino Knit Polo",
    slug: "merino-knit-polo",
    categoryId: "cat-men",
    featured: true,
    sellingPrice: 16500,
    mrp: 19800,
    description:
      "Fine merino polo with a ribbed collar and a clean, close knit. Works under a coat or on its own.",
    images: [
      media("photo-1617127365659-c47fa864d8bc", "Merino knit polo"),
      media("photo-1507679799987-c73779587ccf", "Mens knit look"),
    ],
  }),
  product({
    id: "p-oxford-shirt",
    name: "Relaxed Oxford Shirt",
    slug: "relaxed-oxford-shirt",
    categoryId: "cat-men",
    sellingPrice: 12500,
    mrp: 15500,
    description:
      "An easy oxford in washed cotton. Relaxed through the chest with a button-down collar and a slightly longer back.",
    images: [
      media("photo-1562157873-818bc0726f68", "Relaxed oxford shirt"),
      media("photo-1617137968427-85924c800a22", "Oxford shirt styling"),
    ],
  }),
  product({
    id: "p-mens-overcoat",
    name: "Camel Overcoat",
    slug: "camel-overcoat",
    categoryId: "cat-men",
    featured: true,
    sellingPrice: 45000,
    mrp: 54000,
    description:
      "A camel wool overcoat with a notched lapel and a quiet, architectural line. Cut to sit cleanly over a knit or shirt.",
    images: [
      media("photo-1507679799987-c73779587ccf", "Camel overcoat"),
      media("photo-1617137968427-85924c800a22", "Mens overcoat look"),
    ],
  }),
  product({
    id: "p-tailored-trousers",
    name: "Wool Tailored Trousers",
    slug: "wool-tailored-trousers",
    categoryId: "cat-men",
    sellingPrice: 17500,
    mrp: 21000,
    description:
      "Tapered wool trousers with a mid rise and a pressed crease. Pair with the oxford or the merino polo.",
    images: [
      media("photo-1473966968600-fa801b869a1a", "Wool tailored trousers"),
      media("photo-1591047139829-d91aecb6caea", "Tailored mens look"),
    ],
  }),
  product({
    id: "p-leather-tote",
    name: "Leather Tote",
    slug: "leather-tote",
    categoryId: "cat-accessories",
    featured: true,
    sizes: ACCESSORY_SIZES,
    sellingPrice: 28000,
    mrp: 34000,
    description:
      "A structured leather tote with unlined simplicity. Wide handles, a hidden magnet, and room for a laptop.",
    images: [
      media("photo-1590874103328-eac38a683ce7", "Leather tote bag"),
      media("photo-1584917865442-de89df76afd3", "Leather bag detail"),
    ],
  }),
  product({
    id: "p-silk-scarf",
    name: "Silk Square Scarf",
    slug: "silk-square-scarf",
    categoryId: "cat-accessories",
    sizes: ACCESSORY_SIZES,
    sellingPrice: 6500,
    mrp: 8500,
    description:
      "A silk square with a muted print. Tie it at the neck, on a bag, or in the hair.",
    images: [
      media("photo-1601924994987-69e26d50dc26", "Silk square scarf"),
      media("photo-1558769132-cb1aea458c5e", "Silk scarf styling"),
    ],
  }),
  product({
    id: "p-leather-belt",
    name: "Leather Belt",
    slug: "leather-belt",
    categoryId: "cat-accessories",
    sizes: ["S", "M", "L"],
    sellingPrice: 5500,
    mrp: 7200,
    description:
      "Vegetable-tanned leather with a brushed buckle. Slim enough for tailoring, sturdy enough for denim.",
    images: [
      media("photo-1553062407-98eeb64c6a62", "Leather belt"),
      media("photo-1591047139829-d91aecb6caea", "Belt styling"),
    ],
  }),
];

export const STATIC_COLLECTIONS = [
  {
    id: "women",
    title: "Women",
    subtitle: "The new edit",
    description: "Silk, cashmere, and wool cut with ease.",
    href: "/shop?category=women",
    src: unsplash("photo-1515886657613-9f3515b0c78f", { w: 1400 }),
    slug: "women",
  },
  {
    id: "men",
    title: "Men",
    subtitle: "Quiet tailoring",
    description: "Knits, shirts, and coats for a considered wardrobe.",
    href: "/shop?category=men",
    src: unsplash("photo-1617137968427-85924c800a22", { w: 1400 }),
    slug: "men",
  },
  {
    id: "accessories",
    title: "Accessories",
    subtitle: "The finish",
    description: "Leather and silk pieces that complete the look.",
    href: "/shop?category=accessories",
    src: unsplash("photo-1590874103328-eac38a683ce7", { w: 1400 }),
    slug: "accessories",
  },
];

export function getStaticCategories() {
  return STATIC_CATEGORIES.map((category) => ({ ...category }));
}

export function getStaticCategoryBySlug(slug) {
  const normalized = String(slug || "")
    .trim()
    .toLowerCase()
    .split(",")[0];
  return STATIC_CATEGORIES.find((category) => category.slug === normalized) || null;
}

export function getStaticProducts({ limit } = {}) {
  const products = STATIC_PRODUCTS.map((item) => ({
    ...item,
    category: { ...item.category },
    media: item.media.map((file) => ({ ...file })),
  }));
  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export function getStaticProductBySlug(rawSlug) {
  const slug = String(rawSlug || "")
    .trim()
    .toLowerCase();
  return getStaticProducts().find((product) => product.slug === slug) || null;
}

export function getStaticProductsByCategory(slug, { limit } = {}) {
  const products = getStaticProducts().filter(
    (product) => product.category?.slug === slug
  );
  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export function queryStaticShop({
  page = 0,
  limit = 9,
  sort = "default_sorting",
  category,
  q,
  minPrice = 0,
  maxPrice = 100000,
  size,
} = {}) {
  let products = getStaticProducts();

  if (category) {
    const slugs = String(category)
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    products = products.filter((product) =>
      slugs.includes(product.category?.slug)
    );
  }

  if (q) {
    const term = String(q).toLowerCase();
    products = products.filter((product) =>
      `${product.name} ${product.description} ${product.category?.name}`
        .toLowerCase()
        .includes(term)
    );
  }

  products = products.filter(
    (product) =>
      product.sellingPrice >= Number(minPrice) &&
      product.sellingPrice <= Number(maxPrice)
  );

  if (size) {
    const sizes = String(size)
      .split(",")
      .map((item) => item.trim());
    products = products.filter((product) =>
      product.sizes?.some((value) => sizes.includes(value))
    );
  }

  const sorted = [...products];
  if (sort === "asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "desc") sorted.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "price_low_high")
    sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
  if (sort === "price_high_low")
    sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);

  const start = Number(page) * Number(limit);
  const pageItems = sorted.slice(start, start + Number(limit) + 1);
  let nextPage = null;
  if (pageItems.length > Number(limit)) {
    nextPage = Number(page) + 1;
    pageItems.pop();
  }

  return { products: pageItems, nextPage };
}

export const HERO_IMAGE = "/assets/images/hero-atelier.jpg";

export const LOOKBOOK_IMAGE = unsplash("photo-1469334031218-e382a71b716b", {
  w: 2000,
  q: 82,
});
