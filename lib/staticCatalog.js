const unsplash = (id, { w = 1200, q = 80 } = {}) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

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
  {
    _id: "cat-sweets",
    name: "Sweets",
    slug: "sweets",
    shortDescription: "Traditional sweets, packed fresh.",
  },
  {
    _id: "cat-biscuits",
    name: "Biscuits",
    slug: "biscuits",
    shortDescription: "Crisp biscuits baked in store.",
  },
  {
    _id: "cat-bakery",
    name: "Bakery",
    slug: "bakery",
    shortDescription: "Oven-fresh bakery.",
  },
  {
    _id: "cat-gifts",
    name: "Gift Boxes",
    slug: "gift-boxes",
    shortDescription: "Boxes for sharing and gifting.",
  },
  {
    _id: "cat-cakes",
    name: "Cakes",
    slug: "cakes",
    shortDescription: "Celebration cakes from the counter.",
  },
  {
    _id: "cat-pizza",
    name: "Pizza",
    slug: "pizza",
    shortDescription: "Fresh pizza from the shop.",
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

function localMedia(file, alt) {
  return {
    _id: `media-${file}`,
    secure_url: `/assets/home/${file}`,
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
  sizes = [],
  deliverable = true,
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
    deliverable,
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  };
}

export const STATIC_PRODUCTS = [
  product({
    id: "p-namak-pare",
    name: "Namak Pare",
    slug: "namak-pare",
    categoryId: "cat-sweets",
    featured: true,
    sellingPrice: 450,
    mrp: 560,
    description:
      "Crisp namak pare, fried fresh and lightly salted. A tea-time snack with the Super Ideal crunch.",
    images: [localMedia("si-namak-pare.png", "Namak pare"), localMedia("si-soan-halwa.png", "Soan halwa")],
  }),
  product({
    id: "p-butter-biscuits",
    name: "Butter Biscuits",
    slug: "butter-biscuits",
    categoryId: "cat-biscuits",
    featured: true,
    sellingPrice: 380,
    mrp: 480,
    description:
      "Melting butter biscuits baked in small batches. Rich, short, and perfect with chai.",
    images: [localMedia("si-butter-biscuits.png", "Butter biscuits"), localMedia("si-coconut-biscuits.png", "Coconut biscuits")],
  }),
  product({
    id: "p-dry-fruit-basket",
    name: "Dry Fruit Basket",
    slug: "dry-fruit-basket",
    categoryId: "cat-gifts",
    featured: true,
    sellingPrice: 2450,
    mrp: 2890,
    description:
      "A gift basket of premium dry fruit, packed for visits, weddings, and thank-you boxes.",
    images: [localMedia("si-dry-fruit.png", "Dry fruit basket"), localMedia("si-gift-box.png", "Gift box")],
  }),
  product({
    id: "p-soan-halwa",
    name: "Soan Halwa",
    slug: "soan-halwa",
    categoryId: "cat-sweets",
    featured: true,
    sellingPrice: 650,
    mrp: 780,
    description:
      "Classic soan halwa, flaky and fragrant, made with premium ingredients and packed fresh.",
    images: [localMedia("si-soan-halwa.png", "Soan halwa"), localMedia("si-namak-pare.png", "Namak pare")],
  }),
  product({
    id: "p-atta-biscuits",
    name: "Atta Biscuits",
    slug: "atta-biscuits",
    categoryId: "cat-bakery",
    sellingPrice: 320,
    mrp: 400,
    description:
      "Wholewheat atta biscuits with a clean, toasty bite. Baked daily for the snack tin.",
    images: [localMedia("si-atta-biscuits.png", "Atta biscuits"), localMedia("si-butter-biscuits.png", "Butter biscuits")],
  }),
  product({
    id: "p-coconut-biscuits",
    name: "Coconut Biscuits",
    slug: "coconut-biscuits",
    categoryId: "cat-biscuits",
    sellingPrice: 290,
    mrp: 360,
    description:
      "Coconut biscuits with a light sweetness and a crisp edge. Packed for tea time and travel.",
    images: [localMedia("si-coconut-biscuits.png", "Coconut biscuits"), localMedia("si-atta-biscuits.png", "Atta biscuits")],
  }),
  product({
    id: "p-kunafa",
    name: "Kunafa",
    slug: "kunafa",
    categoryId: "cat-sweets",
    sellingPrice: 1200,
    mrp: 1200,
    deliverable: false,
    description:
      "Warm kunafa finished in store. Best the same day, so it is available at the counter only.",
    images: [localMedia("si-kunafa.png", "Kunafa"), localMedia("si-pastries.png", "Pastries")],
  }),
  product({
    id: "p-fudge-cake",
    name: "Chocolate Fudge Cake",
    slug: "chocolate-fudge-cake",
    categoryId: "cat-cakes",
    sellingPrice: 2800,
    mrp: 2800,
    deliverable: false,
    description:
      "A dense chocolate fudge cake finished in the bakery. Order at the shop for same-day collection.",
    images: [localMedia("si-fudge-cake.png", "Chocolate fudge cake"), localMedia("si-fruit-cake.png", "Fruit cream cake")],
  }),
  product({
    id: "p-croissants",
    name: "Butter Croissants",
    slug: "butter-croissants",
    categoryId: "cat-bakery",
    sellingPrice: 180,
    mrp: 180,
    deliverable: false,
    description:
      "Flaky butter croissants baked in the morning. Sold fresh in store.",
    images: [localMedia("si-croissants.png", "Butter croissants"), localMedia("si-pastries.png", "Assorted pastries")],
  }),
  product({
    id: "p-special-pizza",
    name: "Special Pizza",
    slug: "special-pizza",
    categoryId: "cat-pizza",
    sellingPrice: 1450,
    mrp: 1450,
    deliverable: false,
    description:
      "Super Ideal special pizza, baked to order. Available in store, not for online delivery.",
    images: [localMedia("si-pizza.png", "Special pizza"), localMedia("si-croissants.png", "Bakery")],
  }),
  product({
    id: "p-pastries",
    name: "Assorted Pastries",
    slug: "assorted-pastries",
    categoryId: "cat-bakery",
    sellingPrice: 950,
    mrp: 950,
    deliverable: false,
    description:
      "A tray of assorted pastries from the fresh counter. Pick them up in store.",
    images: [localMedia("si-pastries.png", "Assorted pastries"), localMedia("si-croissants.png", "Butter croissants")],
  }),
  product({
    id: "p-fruit-cake",
    name: "Fruit Cream Cake",
    slug: "fruit-cream-cake",
    categoryId: "cat-cakes",
    sellingPrice: 2200,
    mrp: 2200,
    deliverable: false,
    description:
      "Fresh cream cake with seasonal fruit. Kept chilled and sold at the counter.",
    images: [localMedia("si-fruit-cake.png", "Fruit cream cake"), localMedia("si-fudge-cake.png", "Chocolate fudge cake")],
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
