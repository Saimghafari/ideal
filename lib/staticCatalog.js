const unsplash = (id, { w = 1200, q = 80 } = {}) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const STATIC_CATEGORIES = [
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
    _id: "cat-catering",
    name: "Catering",
    slug: "catering",
    shortDescription: "Trays and spreads for celebrations.",
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

export const SHOP_PRICE_MIN = 0;
export const SHOP_PRICE_MAX = 3000;
export const SHOP_PRICE_STEP = 50;

export const SHOP_CATEGORIES = [
  {
    name: "Sweets",
    slug: "sweets",
    image: "/assets/home/si-cat-sweets.png",
    children: [
      { name: "Halwa", slug: "halwa" },
      { name: "Namak Pare", slug: "namak" },
    ],
  },
  {
    name: "Cakes",
    slug: "cakes",
    image: "/assets/home/si-fudge-cake.png",
    children: [
      { name: "Chocolate", slug: "chocolate-cakes" },
      { name: "Fruit Cream", slug: "fruit-cakes" },
    ],
  },
  {
    name: "Bakery",
    slug: "bakery",
    image: "/assets/home/si-cat-bakery.png",
    children: [
      { name: "Croissants", slug: "croissants" },
      { name: "Pastries", slug: "pastries" },
    ],
  },
  {
    name: "Pizzas",
    slug: "pizzas",
    image: "/assets/home/si-pizza.png",
    children: [{ name: "Special", slug: "special-pizza-sub" }],
  },
  {
    name: "Snacks",
    slug: "snacks",
    image: "/assets/home/si-namak-pare.png",
    children: [
      { name: "Namak Pare", slug: "namak" },
      { name: "Savoury", slug: "savoury" },
    ],
  },
  {
    name: "Biscuits",
    slug: "biscuits",
    image: "/assets/home/si-butter-biscuits.png",
    children: [
      { name: "Butter", slug: "butter-biscuits-sub" },
      { name: "Coconut", slug: "coconut-biscuits-sub" },
      { name: "Atta", slug: "atta-biscuits-sub" },
    ],
  },
  {
    name: "Gift Boxes",
    slug: "gift-boxes",
    image: "/assets/home/si-gift-box.png",
    children: [{ name: "Dry Fruit", slug: "dry-fruit" }],
  },
  {
    name: "Catering",
    slug: "catering",
    image: "/assets/home/si-cat-catering.png",
    children: [
      { name: "Party Trays", slug: "party-trays" },
      { name: "Savoury Platters", slug: "savoury-platters" },
      { name: "Sweet Boxes", slug: "sweet-boxes" },
    ],
  },
  {
    name: "Seasonal",
    slug: "seasonal",
    image: "/assets/home/si-kunafa.png",
    children: [{ name: "Kunafa", slug: "kunafa-sub" }],
  },
];

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
  todayOnly = false,
  tags = [],
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
    todayOnly,
    tags: tags.length ? tags : [category?.slug].filter(Boolean),
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
    tags: ["sweets", "snacks", "namak", "savoury"],
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
    tags: ["biscuits", "snacks", "butter-biscuits-sub"],
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
    tags: ["gift-boxes", "dry-fruit"],
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
    tags: ["sweets", "halwa"],
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
    tags: ["bakery", "biscuits", "snacks", "atta-biscuits-sub", "savoury"],
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
    tags: ["biscuits", "snacks", "coconut-biscuits-sub"],
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
    tags: ["sweets", "seasonal", "kunafa-sub"],
    sellingPrice: 1200,
    mrp: 1200,
    deliverable: false,
    todayOnly: true,
    description:
      "Warm kunafa finished in store. Best the same day, so it is available at the counter only.",
    images: [localMedia("si-kunafa.png", "Kunafa"), localMedia("si-pastries.png", "Pastries")],
  }),
  product({
    id: "p-fudge-cake",
    name: "Chocolate Fudge Cake",
    slug: "chocolate-fudge-cake",
    categoryId: "cat-cakes",
    tags: ["cakes", "chocolate-cakes"],
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
    tags: ["bakery", "croissants"],
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
    tags: ["pizzas", "pizza", "special-pizza-sub"],
    sellingPrice: 1450,
    mrp: 1450,
    deliverable: false,
    todayOnly: true,
    description:
      "Super Ideal special pizza, baked to order. Available in store, not for online delivery.",
    images: [localMedia("si-pizza.png", "Special pizza"), localMedia("si-croissants.png", "Bakery")],
  }),
  product({
    id: "p-pastries",
    name: "Assorted Pastries",
    slug: "assorted-pastries",
    categoryId: "cat-bakery",
    tags: ["bakery", "pastries"],
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
    tags: ["cakes", "fruit-cakes"],
    sellingPrice: 2200,
    mrp: 2200,
    deliverable: false,
    todayOnly: true,
    description:
      "Fresh cream cake with seasonal fruit. Kept chilled and sold at the counter.",
    images: [localMedia("si-fruit-cake.png", "Fruit cream cake"), localMedia("si-fudge-cake.png", "Chocolate fudge cake")],
  }),
  product({
    id: "p-celebration-party-tray",
    name: "Celebration Party Tray",
    slug: "celebration-party-tray",
    categoryId: "cat-catering",
    tags: ["catering", "party-trays"],
    sellingPrice: 2450,
    mrp: 2900,
    deliverable: false,
    description: "A mixed tray of savouries and sweets for a small gathering. Sample catering item.",
    images: [localMedia("si-cat-catering.png", "Celebration party tray")],
  }),
  product({
    id: "p-canape-tray",
    name: "Canapé Tray",
    slug: "canape-tray",
    categoryId: "cat-catering",
    tags: ["catering", "party-trays"],
    sellingPrice: 1800,
    mrp: 1800,
    deliverable: false,
    description: "Bite-size canapés arranged for a party table. Sample catering item.",
    images: [localMedia("si-pastries.png", "Canapé tray")],
  }),
  product({
    id: "p-mehndi-tray",
    name: "Mehndi Sharing Tray",
    slug: "mehndi-sharing-tray",
    categoryId: "cat-catering",
    tags: ["catering", "party-trays"],
    sellingPrice: 2600,
    mrp: 3000,
    deliverable: false,
    todayOnly: true,
    description: "A larger sharing tray finished for mehndi and family functions. Sample catering item.",
    images: [localMedia("si-hamper.png", "Mehndi sharing tray")],
  }),
  product({
    id: "p-chicken-savoury-platter",
    name: "Chicken Savoury Platter",
    slug: "chicken-savoury-platter",
    categoryId: "cat-catering",
    tags: ["catering", "savoury-platters"],
    sellingPrice: 2200,
    mrp: 2600,
    deliverable: false,
    description: "Warm savoury bites for a catering table. Sample catering item.",
    images: [localMedia("si-pizza.png", "Chicken savoury platter")],
  }),
  product({
    id: "p-namak-pare-platter",
    name: "Namak Pare Platter",
    slug: "namak-pare-platter",
    categoryId: "cat-catering",
    tags: ["catering", "savoury-platters"],
    sellingPrice: 1800,
    mrp: 1800,
    deliverable: false,
    description: "A catering platter of crisp namak pare. Sample catering item.",
    images: [localMedia("si-namak-pare.png", "Namak pare platter")],
  }),
  product({
    id: "p-mithai-sweet-box",
    name: "Mithai Sweet Box",
    slug: "mithai-sweet-box",
    categoryId: "cat-catering",
    tags: ["catering", "sweet-boxes"],
    sellingPrice: 2800,
    mrp: 3200,
    deliverable: true,
    description: "A boxed mithai selection for guests. Sample catering item.",
    images: [localMedia("si-soan-halwa.png", "Mithai sweet box")],
  }),
  product({
    id: "p-dry-fruit-sweet-box",
    name: "Dry Fruit Sweet Box",
    slug: "dry-fruit-sweet-box",
    categoryId: "cat-catering",
    tags: ["catering", "sweet-boxes"],
    sellingPrice: 2800,
    mrp: 3000,
    deliverable: true,
    description: "Dry fruit sweets packed for catering orders. Sample catering item.",
    images: [localMedia("si-dry-fruit.png", "Dry fruit sweet box")],
  }),
  product({
    id: "p-kunafa-catering-box",
    name: "Kunafa Catering Box",
    slug: "kunafa-catering-box",
    categoryId: "cat-catering",
    tags: ["catering", "sweet-boxes"],
    sellingPrice: 2400,
    mrp: 2400,
    deliverable: false,
    description: "Kunafa portions boxed for a catering dessert course. Sample catering item.",
    images: [localMedia("si-kunafa.png", "Kunafa catering box")],
  }),
];

export const STATIC_COLLECTIONS = [
  {
    id: "sweets",
    title: "Sweets",
    subtitle: "Mithai counter",
    description: "Halwa, namak pare, and sweets packed fresh.",
    href: "/shop?category=sweets",
    src: "/assets/home/si-cat-sweets.png",
    slug: "sweets",
  },
  {
    id: "bakery",
    title: "Bakery",
    subtitle: "From the oven",
    description: "Croissants, pastries, and biscuits baked in store.",
    href: "/shop?category=bakery",
    src: "/assets/home/si-cat-bakery.png",
    slug: "bakery",
  },
  {
    id: "cakes",
    title: "Cakes",
    subtitle: "Celebrations",
    description: "Chocolate, fruit cream, and celebration cakes.",
    href: "/shop?category=cakes",
    src: "/assets/home/si-fudge-cake.png",
    slug: "cakes",
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

function normalizeShopSlug(raw) {
  const value = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  if (value === "pizza") return "pizzas";
  if (value === "gifts" || value === "gift-box") return "gift-boxes";
  return value;
}

function productMatchesCategory(product, rawSlug) {
  const slug = normalizeShopSlug(rawSlug);
  const tags = new Set(
    [product.category?.slug, ...(product.tags || [])]
      .filter(Boolean)
      .map((item) => normalizeShopSlug(item))
  );
  if (slug === "pizzas") return tags.has("pizzas") || tags.has("pizza");
  return tags.has(slug);
}

export function queryStaticShop({
  page = 0,
  limit = 9,
  sort = "default_sorting",
  category,
  q,
  minPrice = SHOP_PRICE_MIN,
  maxPrice = SHOP_PRICE_MAX,
  size,
  availability,
} = {}) {
  let products = getStaticProducts();

  if (category) {
    const slugs = String(category)
      .split(",")
      .map((item) => normalizeShopSlug(item))
      .filter(Boolean);
    products = products.filter((product) =>
      slugs.some((slug) => productMatchesCategory(product, slug))
    );
  }

  if (availability === "online") {
    products = products.filter((product) => product.deliverable !== false);
  }
  if (availability === "store") {
    products = products.filter((product) => product.deliverable === false);
  }

  if (q) {
    const term = String(q).toLowerCase();
    products = products.filter((product) =>
      `${product.name} ${product.description} ${product.category?.name}`
        .toLowerCase()
        .includes(term)
    );
  }

  const floor = Number(minPrice) || SHOP_PRICE_MIN;
  const requestedMax = Number(maxPrice);
  const ceiling =
    !requestedMax || requestedMax >= 100000 ? SHOP_PRICE_MAX : requestedMax;
  products = products.filter(
    (product) => product.sellingPrice >= floor && product.sellingPrice <= ceiling
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
