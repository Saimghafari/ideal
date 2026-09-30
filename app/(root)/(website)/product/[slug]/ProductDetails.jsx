"use client";

import {
  WEBSITE_CART,
  WEBSITE_HOME,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import ProductReveiw from "@/components/Application/Website/ProductReveiw";
import { marked } from "marked";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { productImageAlt } from "@/lib/productImageAlt";
import { normalizeSlug } from "@/lib/normalizeSlug";
import { getStaticProducts } from "@/lib/staticCatalog";
import { nutritionRowsFromProduct } from "@/lib/nutritionRows";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

const RECENT_KEY = "si-recent-products";
const isBakeryImage = (item) =>
  String(item?.media?.[0]?.secure_url || "").startsWith("/assets/home/");
const PRODUCT_ROW_COUNT = 6;
const productRowClass = "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-4";

const toPlainText = (html) =>
  String(html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const money = (formatPrice, value) =>
  String(formatPrice(value) || "")
    .replace(/^Rs\s*/i, "Rs. ")
    .trim();

const FEATURES = [
  { label: "Freshly\nPrepared", icon: "leaf" },
  { label: "Premium\nIngredients", icon: "grain" },
  { label: "Hygienically\nPacked", icon: "shield" },
  { label: "Longer\nShelf Life", icon: "clock" },
];

const LOVE = [
  "Crispy & crunchy texture",
  "Made with premium ingredients",
  "Perfect for snacks & tea time",
  "Hygienically prepared & packed",
  "Suitable for all age groups",
];

const PROMISES = [
  { title: "Freshly\nBaked Daily", text: "Always fresh, always delicious", icon: "heart" },
  { title: "Premium\nIngredients", text: "Only the finest quality", icon: "wheat" },
  { title: "Hygienically\nPrepared", text: "Clean & safe for your family", icon: "safe" },
  { title: "Wide\nVariety", text: "Something for every occasion", icon: "badge" },
];

const OCCASIONS = [
  { label: "Tea Time", icon: "cup" },
  { label: "Family Gatherings", icon: "people" },
  { label: "Travel Snacks", icon: "bag" },
  { label: "Everyday Munching", icon: "cookie" },
];

function PromiseIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-[22px] w-[22px]",
    "aria-hidden": true,
  };
  if (name === "heart") {
    return (
      <svg {...common}>
        <path d="M12 19s-6.2-3.8-6.2-8A3.4 3.4 0 0 1 12 8.2 3.4 3.4 0 0 1 18.2 11c0 4.2-6.2 8-6.2 8Z" />
      </svg>
    );
  }
  if (name === "wheat") {
    return (
      <svg {...common}>
        <path d="M12 21V8" />
        <path d="M12 12c-2.6-.6-4.2-2.4-4.4-5.2 2.8.4 4.2 2 4.4 5.2Z" />
        <path d="M12 15c2.6-.6 4.2-2.4 4.4-5.2-2.8.4-4.2 2-4.4 5.2Z" />
        <path d="M12 9c-2.2-.4-3.5-1.8-3.6-4 2.2.3 3.4 1.5 3.6 4Z" />
        <path d="M12 9c2.2-.4 3.5-1.8 3.6-4-2.2.3-3.4 1.5-3.6 4Z" />
      </svg>
    );
  }
  if (name === "safe") {
    return (
      <svg {...common}>
        <path d="M12 3.5 6 6v5.2c0 3.6 2.4 6.2 6 7.8 3.6-1.6 6-4.2 6-7.8V6l-6-2.5Z" />
        <path d="m9.2 11.6 1.8 1.8 3.6-3.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3.2 14.2 5l2.6-.4 1.2 2.3 2.4.8-.4 2.6L22 12l-2 2.7.4 2.6-2.4.8-1.2 2.3-2.6-.4L12 20.8 9.8 19l-2.6.4-1.2-2.3-2.4-.8.4-2.6L2 12l2-2.7-.4-2.6 2.4-.8L5.2 4.6 7.8 5 12 3.2Z" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

function LineIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-[22px] w-[22px]",
    "aria-hidden": true,
  };

  if (name === "leaf") {
    return (
      <svg {...common}>
        <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z" />
        <path d="M8 16c2-3 5-6 9-8" />
      </svg>
    );
  }
  if (name === "grain") {
    return (
      <svg {...common}>
        <path d="M12 21V9" />
        <path d="M12 13c-3-1-5-3.5-5-7 4 .2 6 2.4 6 7" />
        <path d="M12 15c3-1 5-3.5 5-7-4 .2-6 2.4-6 7" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3 5 6v6c0 4.2 2.8 7.2 7 9 4.2-1.8 7-4.8 7-9V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.5l3 2" />
      </svg>
    );
  }
  if (name === "cup") {
    return (
      <svg {...common}>
        <path d="M6 8h10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8Z" />
        <path d="M16 9h2a2 2 0 0 1 0 4h-2" />
        <path d="M8 20h8" />
      </svg>
    );
  }
  if (name === "people") {
    return (
      <svg {...common}>
        <circle cx="9" cy="9" r="2.2" />
        <circle cx="16" cy="10" r="1.8" />
        <path d="M4.5 18c.6-2.4 2.4-3.6 4.5-3.6S13 15.6 13.6 18" />
        <path d="M13.5 18c.3-1.6 1.4-2.6 3-2.6 1.4 0 2.4.8 2.8 2.6" />
      </svg>
    );
  }
  if (name === "bag") {
    return (
      <svg {...common}>
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <path d="M8 7V6a4 4 0 0 1 8 0v1" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="13" r="5" />
      <path d="M12 8V6" />
      <path d="M9.5 5h5" />
    </svg>
  );
}

function Stars({ rating = 4.8 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#F5A623]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => {
        const fill = rating - index;
        if (fill >= 0.75) return <IoStar key={index} className="h-[15px] w-[15px]" />;
        if (fill >= 0.25) return <IoStarHalf key={index} className="h-[15px] w-[15px]" />;
        return <IoStarOutline key={index} className="h-[15px] w-[15px]" />;
      })}
    </span>
  );
}

function QtyStepper({ qty, onDec, onInc, compact = false }) {
  const btn = compact
    ? "flex h-7 w-7 items-center justify-center rounded-full border border-[#eadfd3] bg-white text-[16px] leading-none text-[#4B2E1E]"
    : "flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd3] bg-white text-[18px] leading-none text-[#4B2E1E] shadow-[0_1px_0_rgba(75,46,30,0.04)]";
  return (
    <div className="inline-flex items-center gap-2.5">
      <button type="button" aria-label="Decrease quantity" className={btn} onClick={onDec}>
        −
      </button>
      <span className={`min-w-[1.1rem] text-center font-semibold text-[#4B2E1E] ${compact ? "text-[13px]" : "text-[15px]"}`}>
        {qty}
      </span>
      <button type="button" aria-label="Increase quantity" className={btn} onClick={onInc}>
        +
      </button>
  </div>
);
}

function SnackCard({ product, formatPrice, onAdd, available = true }) {
  const [qty, setQty] = useState(1);
  const [src, setSrc] = useState(product?.media?.[0]?.secure_url || imgPlaceholder.src);
  const href = WEBSITE_PRODUCT_DETAILS(
    normalizeSlug(product?.slug || product?.name || "") || product?.slug
  );
  const price = money(formatPrice, product?.sellingPricePkr || product?.sellingPrice || 0);

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_8px_22px_rgba(75,46,30,0.07)]">
      <Link href={href} className="relative block aspect-[5/4] bg-[#f4ebe3]">
        <span
          className={`absolute left-2 top-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-full px-2 py-[3px] text-[10px] font-semibold leading-none sm:left-2.5 sm:top-2.5 sm:text-[11px] ${
            available ? "bg-[#E5F6EA] text-[#1B8A42]" : "bg-[#FDECEC] text-[#D14343]"
          }`}
        >
          {available ? "Deliverable" : "Not Deliverable"}
        </span>
        <Image
          src={src}
          alt={productImageAlt(product?.media?.[0], product?.name)}
          fill
          sizes="(max-width: 640px) 46vw, 18vw"
          className="object-cover object-center"
          onError={() => setSrc(imgPlaceholder.src)}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col px-2.5 pb-2.5 pt-2.5 sm:px-3">
        <Link href={href}>
          <h3 className="line-clamp-1 text-[13px] font-bold leading-tight text-[#3d2415] sm:text-[15px]">
            {product?.name}
          </h3>
        </Link>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#b08974] sm:text-[12px]">
          {product?.category?.name || "Premium Blend"}
        </p>
        <p className="mt-1.5 text-[13px] font-bold text-[#3d2415] sm:text-[15px]">
          {price}
          <span className="text-[12px] font-bold sm:text-[13px]">/kg</span>
        </p>
        {available ? (
          <div className="mt-auto flex flex-col gap-2 pt-3">
            <QtyStepper
              compact
              qty={qty}
              onDec={() => setQty((value) => Math.max(1, value - 1))}
              onInc={() => setQty((value) => value + 1)}
            />
            <button
              type="button"
              onClick={() => onAdd(product, qty)}
              className="inline-flex h-8 w-full items-center justify-center rounded-full bg-[#E45700] px-2 text-[12px] font-semibold text-white hover:bg-[#cf4e00]"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <p className="mt-auto pt-3 text-center text-[12px] font-medium leading-snug text-[#c4a394] sm:text-left sm:text-[13px]">
            Not Available Online
          </p>
        )}
      </div>
    </article>
  );
}

const ProductDetails = ({
  product,
  variant,
  colors: _colors,
  sizes: _sizes,
  reviewCount = 0,
  relatedProducts = [],
  collectionHref,
}) => {
  const dispatch = useDispatch();
  const cartStore = useSelector((store) => store.cartStore);
  const { formatPrice, resolvePrices, currency } = useCurrency();

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [tab, setTab] = useState("description");
  const [isAddedIntoCart, setIsAddedIntoCart] = useState(false);
  const [recent, setRecent] = useState([]);
  const featureScrollRef = useRef(null);

  useEffect(() => {
    const node = featureScrollRef.current;
    if (!node) return undefined;
    const query = window.matchMedia("(max-width: 639px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation;

    const sync = () => {
      animation?.cancel();
      animation = undefined;
      node.style.transform = "";
      if (!query.matches || motion.matches) return;
      const distance = node.scrollWidth - node.parentElement.clientWidth;
      if (distance <= 8) return;
      animation = node.animate(
        [
          { transform: "translateX(0)" },
          { transform: `translateX(-${distance}px)` },
          { transform: "translateX(0)" },
        ],
        { duration: 9000, iterations: Infinity, easing: "ease-in-out" }
      );
    };

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      animation?.cancel();
    };
  }, [product?._id]);

  const activeVariant = useMemo(() => {
    if (variant && !variant.isProductFallback) return variant;
    if (!product) return null;
    return {
      _id: variant?._id || product._id,
      size: null,
      color: null,
      mrp: variant?.mrp ?? product.mrp,
      sellingPrice: variant?.sellingPrice ?? product.sellingPrice,
      mrpPkr: variant?.mrpPkr ?? product.mrpPkr ?? 0,
      sellingPricePkr: variant?.sellingPricePkr ?? product.sellingPricePkr ?? 0,
      discountPercentage: variant?.discountPercentage ?? product.discountPercentage,
      media: variant?.media?.length ? variant.media : product.media || [],
      isProductFallback: !variant || variant.isProductFallback,
    };
  }, [variant, product]);

  const displayPrices = useMemo(
    () => resolvePrices(activeVariant),
    [activeVariant, resolvePrices]
  );

  const galleryMedia =
    activeVariant?.media?.length > 0 ? activeVariant.media : product?.media || [];

  const slides = galleryMedia.length
    ? galleryMedia
    : [{ _id: "placeholder", secure_url: imgPlaceholder.src }];

  const descriptionHtml = useMemo(() => {
    try {
      return marked(product?.description || "");
    } catch {
      return product?.description || "";
    }
  }, [product?.description]);

  const descriptionText = useMemo(() => toPlainText(descriptionHtml).trim(), [descriptionHtml]);

  const ingredientItems = useMemo(
    () => (Array.isArray(product?.ingredients) ? product.ingredients : []).map((item) => String(item).trim()).filter(Boolean),
    [product?.ingredients]
  );
  const ingredientsNote = String(product?.ingredientsNote || "").trim();
  const nutritionRows = useMemo(
    () => nutritionRowsFromProduct(product?.nutrition).map((row) => [row.label, row.value]),
    [product?.nutrition]
  );

  useEffect(() => {
    if (!product?._id || !activeVariant?._id) return;
    const existingProduct = cartStore.products.findIndex(
      (cartProduct) =>
        cartProduct?.productId === product._id &&
        cartProduct?.variantId === activeVariant._id
    );
    setIsAddedIntoCart(existingProduct >= 0);
  }, [activeVariant, cartStore.products, product?._id]);

  useEffect(() => {
    if (!product?._id) return;
    const snapshot = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      sellingPrice: displayPrices.sellingPrice,
      sellingPricePkr: displayPrices.sellingPrice,
      media: (product.media || []).slice(0, 1),
      category: product.category ? { name: product.category.name, slug: product.category.slug } : null,
      deliverable: product.deliverable !== false,
    };
    try {
      const prev = JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]").filter(isBakeryImage);
      const next = [snapshot, ...prev.filter((item) => item?.slug !== product.slug)].slice(0, 8);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecent(next.filter((item) => item.slug !== product.slug).slice(0, PRODUCT_ROW_COUNT));
    } catch {
      setRecent([]);
    }
  }, [product, displayPrices.sellingPrice]);

  const buildCartProduct = (item, amount, variantId) => ({
    productId: item._id,
    variantId: variantId || item._id,
    name: item.name,
    url: item.slug,
    size: null,
    color: null,
    mrp: item.mrp ?? item.sellingPrice,
    sellingPrice: item.sellingPricePkr || item.sellingPrice,
    currency,
    media: item?.media?.[0]?.secure_url,
    qty: amount,
  });

  const handleAddToCart = () => {
    if (!product?._id || !activeVariant?._id) return;
    dispatch(
      addIntoCart({
        ...buildCartProduct(product, qty, activeVariant._id),
        mrp: displayPrices.mrp,
        sellingPrice: displayPrices.sellingPrice,
        currency: displayPrices.currency || currency,
        media:
          activeVariant?.media?.[0]?.secure_url || product?.media?.[0]?.secure_url,
      })
    );
    setIsAddedIntoCart(true);
    showToast("success", "Product added into cart.");
  };

  const handleRelatedAdd = (item, amount) => {
    if (!item?._id) return;
    dispatch(addIntoCart(buildCartProduct(item, amount, item._id)));
    showToast("success", "Product added into cart.");
  };

  const catalog = useMemo(() => getStaticProducts().filter(isBakeryImage), []);

  const fillRow = (preferred, fallback) => {
    const rows = [];
    const seen = new Set();
    for (const item of [...preferred, ...fallback]) {
      if (!item?.slug || seen.has(item.slug)) continue;
      seen.add(item.slug);
      rows.push(item);
      if (rows.length === PRODUCT_ROW_COUNT) break;
    }
    return rows;
  };

  const relatedRow = useMemo(() => {
    const current = product?.slug;
    const others = catalog.filter((item) => item.slug !== current);
    const base = (relatedProducts || []).filter(
      (item) => item?.slug && item.slug !== current && isBakeryImage(item)
    );
    return fillRow(
      [...base, ...others.filter((item) => item.deliverable !== false)],
      others
    );
  }, [catalog, product?.slug, relatedProducts]);

  const recentRow = useMemo(() => {
    const current = product?.slug;
    const seen = recent.filter((item) => item?.slug && item.slug !== current && isBakeryImage(item));
    const others = catalog.filter((item) => item.slug !== current);
    const offline = others.filter((item) => item.deliverable === false);
    return fillRow([...seen, ...offline], others);
  }, [catalog, product?.slug, recent]);

  const categoryName = product?.category?.name;
  const shopCategoryHref = collectionHref || WEBSITE_SHOP;
  const priceLabel = money(formatPrice, displayPrices.sellingPrice);
  const currentSlide = slides[Math.min(activeImage, slides.length - 1)];
  const reviewLabel = reviewCount > 0 ? reviewCount : 124;

  const tabs = [
    descriptionText ? { id: "description", label: "Description" } : null,
    ingredientsNote || ingredientItems.length ? { id: "ingredients", label: "Ingredients" } : null,
    nutritionRows.length ? { id: "nutrition", label: "Nutritional Information" } : null,
    { id: "reviews", label: `Reviews (${reviewLabel})` },
    { id: "delivery", label: "Delivery & Returns" },
  ].filter(Boolean);

  useEffect(() => {
    if (tabs.length && !tabs.some((item) => item.id === tab)) {
      setTab(tabs[0].id);
    }
  }, [tab, tabs]);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FFF6EE] px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold text-[#4B2E1E]">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF6EE] font-sans text-[#4B2E1E]">
      <div className="mx-auto w-full max-w-[1680px] px-4 pb-16 pt-5 sm:px-6 sm:pt-7 xl:px-10 lg:pb-20">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#b08974] sm:mb-6">
          <Link href={WEBSITE_HOME} className="hover:text-[#E45700]">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href={WEBSITE_SHOP} className="hover:text-[#E45700]">Products</Link>
          <span aria-hidden="true">›</span>
          {categoryName ? (
            <>
              <Link href={shopCategoryHref} className="hover:text-[#E45700]">{categoryName}</Link>
              <span aria-hidden="true">›</span>
            </>
          ) : null}
          <span className="font-medium text-[#8d624c]">{product.name}</span>
        </nav>

        <section className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex w-[62px] shrink-0 flex-col gap-2.5 sm:w-[74px] sm:gap-3">
              {slides.map((slide, index) => {
                const active = index === Math.min(activeImage, slides.length - 1);
                return (
                  <button
                    key={slide._id || slide.secure_url || index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`relative aspect-square overflow-hidden rounded-xl bg-[#f3e6d8] ring-2 ring-offset-2 ring-offset-[#FFF6EE] ${
                      active ? "ring-[#E45700]" : "ring-transparent"
                    }`}
                  >
                    <Image
                      src={slide?.secure_url || imgPlaceholder.src}
                      alt={productImageAlt(slide, product.name)}
                      fill
                      sizes="74px"
                      className="object-cover"
                    />
                    {index === Math.min(1, slides.length - 1) && slides.length > 1 && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[11px] text-[#4B2E1E]">
                          ▶
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[240px] flex-1 overflow-hidden rounded-[22px] bg-[#f6eee4] sm:min-h-[340px] lg:min-h-[430px]">
              <Image
                src={currentSlide?.secure_url || imgPlaceholder.src}
                alt={productImageAlt(currentSlide, product.name)}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 520px"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#E7F6EC] px-3 py-1.5 text-[12px] font-semibold text-[#1C8A43] shadow-sm sm:left-4 sm:top-4 sm:text-[13px]">
                <span className="text-[14px]">✓</span>
                Available for Online Delivery
              </span>
              <button
                type="button"
                aria-label="Zoom image"
                onClick={() => setZoomed(true)}
                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4B2E1E] shadow-md sm:bottom-4 sm:right-4"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="min-w-0 pt-1">
            <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-[#4B2E1E] sm:text-[40px]">
              {product.name}
            </h1>
            <p className="mt-2 text-[15px] text-[#c4895a] sm:text-[16px]">
              Premium Quality <span className="px-1 text-[#e0c2a4]">|</span> Crispy &amp; Delicious
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-[#8d6b58]">
              <Stars />
              <span className="font-semibold text-[#4B2E1E]">4.8</span>
              <span>({reviewLabel} reviews)</span>
            </div>
            <p className="mt-4 text-[28px] font-bold leading-none tracking-[-0.03em] text-[#4B2E1E] sm:text-[32px]">
              {priceLabel}
              <span className="text-[22px] font-bold sm:text-[24px]"> / kg</span>
            </p>
            <p className="mt-4 max-w-[34rem] text-[14.5px] leading-[1.65] text-[#7d5c4a]">
              Our signature {product.name} is a perfect blend of crispy rice, peanuts, sev, and traditional spices, prepared with premium ingredients to give you an authentic taste.
            </p>

            <div className="mt-6 min-w-0 overflow-hidden sm:hidden" aria-label="Product highlights">
              <div ref={featureScrollRef} className="flex w-max">
                {FEATURES.map((feature) => (
                  <div key={feature.label} className="flex w-[104px] shrink-0 flex-col items-center px-1 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff] text-[#E45700] shadow-[0_6px_16px_rgba(75,46,30,0.05)] ring-1 ring-[#f3e4d6]">
                      <LineIcon name={feature.icon} />
                    </span>
                    <span className="mt-2 whitespace-pre-line text-[12px] font-medium leading-[1.25] text-[#6d4c3a]">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 hidden grid-cols-4 gap-2 sm:grid">
              {FEATURES.map((feature) => (
                <div key={feature.label} className="flex flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff] text-[#E45700] shadow-[0_6px_16px_rgba(75,46,30,0.05)] ring-1 ring-[#f3e4d6]">
                    <LineIcon name={feature.icon} />
                  </span>
                  <span className="mt-2 whitespace-pre-line text-[12px] font-medium leading-[1.25] text-[#6d4c3a]">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-4 sm:gap-5">
              <div>
                <p className="mb-2 text-[13px] text-[#8a6754]">Quantity (g)</p>
                <QtyStepper
                  qty={qty}
                  onDec={() => setQty((value) => Math.max(1, value - 1))}
                  onInc={() => setQty((value) => value + 1)}
          />
        </div>
              {!isAddedIntoCart ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#E45700] px-7 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(228,87,0,0.28)] hover:bg-[#cf4e00]"
                >
                  Add to Cart
                </button>
              ) : (
                <Link
                  href={WEBSITE_CART}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#E45700] px-7 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(228,87,0,0.28)] hover:bg-[#cf4e00]"
                >
                  Go to Cart
                </Link>
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-[#E9F7EE] px-4 py-3.5 sm:px-5">
              <p className="flex items-center gap-2 text-[14px] font-bold text-[#1C8A43]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1C8A43] text-[11px] text-white">✓</span>
                Available for Online Delivery
              </p>
              <p className="mt-1 pl-7 text-[13px] leading-relaxed text-[#3e8a5c]">
                This product can be ordered online and delivered to your doorstep anywhere in Pakistan.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 text-[11px] leading-tight text-[#7a5846] sm:text-[13px]">
              {[
                ["Secure Payment", "lock"],
                ["Fresh Packing", "box"],
                ["Nationwide Delivery", "pin"],
              ].map(([label, icon], index) => (
                <div
                  key={label}
                  className={`flex flex-col items-center justify-center gap-1 px-1 py-1 text-center sm:flex-row sm:gap-2 ${
                    index > 0 ? "sm:border-l sm:border-[#f0e0d2]" : ""
                  }`}
                >
                  <span className="text-[#E45700]">
                    {icon === "lock" && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <rect x="6" y="10" width="12" height="9" rx="2" />
                        <path d="M9 10V8a3 3 0 0 1 6 0v2" />
                      </svg>
                    )}
                    {icon === "box" && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M4 8h16v10H4z" />
                        <path d="M4 8l8-4 8 4" />
                        <path d="M12 12v6" />
                      </svg>
                    )}
                    {icon === "pin" && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
                        <circle cx="12" cy="11" r="1.6" />
                      </svg>
                    )}
                  </span>
                  {label}
                </div>
              ))}
            </div>
        </div>
      </section>

        <div className="mt-8 border-b border-[#f0e2d4] sm:mt-10">
          <div role="tablist" aria-label="Product information" className="flex gap-5 overflow-x-auto pb-0 sm:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={`shrink-0 border-b-2 pb-3 text-[14px] sm:text-[15px] ${
                    active
                      ? "border-[#E45700] font-semibold text-[#4B2E1E]"
                      : "border-transparent font-medium text-[#b08974] hover:text-[#4B2E1E]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 sm:pt-8">
          {tab === "description" && (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.72fr)] lg:gap-16">
              <div>
                <h2 className="text-[22px] font-bold text-[#4B2E1E] sm:text-[26px]">Product Description</h2>
                <p className="mt-3 max-w-[40rem] text-[15px] leading-[1.75] text-[#7c5b49]">{descriptionText}</p>
              </div>
              <div>
                <h2 className="text-[22px] font-bold text-[#4B2E1E] sm:text-[26px]">Why You&apos;ll Love It</h2>
                <ul className="mt-4 space-y-3">
                  {LOVE.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-[#6d4e3c]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E45700] text-[11px] text-white">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "ingredients" && (
            <div className="max-w-3xl">
              <h2 className="text-[22px] font-bold text-[#4B2E1E] sm:text-[26px]">Ingredients</h2>
              {ingredientsNote ? (
                <p className="mt-3 text-[15px] leading-[1.75] text-[#7c5b49]">{ingredientsNote}</p>
              ) : null}
              {ingredientItems.length > 0 && (
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {ingredientItems.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[15px] text-[#6d4e3c]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E45700]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "nutrition" && (
            <div className="max-w-xl">
              <h2 className="text-[22px] font-bold text-[#4B2E1E] sm:text-[26px]">Nutritional Information</h2>
              <p className="mt-2 text-[13px] text-[#a18472]">Typical values per 100g</p>
              <dl className="mt-4 overflow-hidden rounded-2xl border border-[#f0e2d4] bg-white">
                {nutritionRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-[#f6ebdf] px-4 py-3 text-[14px] last:border-0">
                    <dt className="text-[#7c5b49]">{label}</dt>
                    <dd className="font-semibold text-[#4B2E1E]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {tab === "reviews" && (
            <div className="rounded-[20px] bg-white px-4 py-6 sm:px-8 sm:py-8">
              <ProductReveiw productId={product._id} />
            </div>
          )}

          {tab === "delivery" && (
            <div className="max-w-3xl">
              <h2 className="text-[22px] font-bold text-[#4B2E1E] sm:text-[26px]">Delivery &amp; Returns</h2>
              <p className="mt-3 text-[15px] leading-[1.75] text-[#7c5b49]">
                This product can be ordered online and delivered to your doorstep anywhere in Pakistan. Orders are freshly packed and dispatched with secure payment. If a pack arrives damaged, contact us and we will replace it.
              </p>
              <ul className="mt-5 space-y-2 text-[15px] text-[#6d4e3c]">
                <li>Nationwide delivery across Pakistan</li>
                <li>Fresh packing on every order</li>
                <li>Secure payment at checkout</li>
              </ul>
            </div>
          )}
        </div>

        <section className="relative mt-8 overflow-hidden rounded-[28px] bg-[#F8E7D4] sm:mt-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
              <h2 className="text-[26px] font-bold tracking-[-0.03em] text-[#4B2E1E] sm:text-[32px]">
                Perfect for Every Occasion
              </h2>
              <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-3">
                {OCCASIONS.map((item) => (
                  <div key={item.label} className="flex flex-col items-center text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-[#E45700] ring-1 ring-white">
                      <LineIcon name={item.icon} />
                    </span>
                    <span className="mt-2 max-w-[7.5rem] text-[13px] font-medium leading-tight text-[#6d4e3c]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[190px] sm:min-h-[230px] lg:min-h-full">
              <Image
                src={slides[Math.min(1, slides.length - 1)]?.secure_url || imgPlaceholder.src}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 sm:mt-12">
          <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
            <h2 className="text-[22px] font-bold tracking-[-0.03em] text-[#3d2415] sm:text-[26px]">Related Products</h2>
            <Link href={shopCategoryHref} className="shrink-0 text-[14px] font-semibold text-[#E45700] hover:underline">
              View All Snacks
            </Link>
          </div>
          <div className={productRowClass}>
            {relatedRow.map((item) => (
              <SnackCard
                key={item._id || item.slug}
                product={item}
                formatPrice={formatPrice}
                onAdd={handleRelatedAdd}
                available={item.deliverable !== false}
              />
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className="mb-4 text-[22px] font-bold tracking-[-0.03em] text-[#3d2415] sm:mb-5 sm:text-[26px]">
            Recently Viewed
          </h2>
          <div className={productRowClass}>
            {recentRow.map((item) => (
              <SnackCard
                key={`recent-${item._id || item.slug}`}
                product={item}
                formatPrice={formatPrice}
                onAdd={handleRelatedAdd}
                available={item.deliverable !== false}
              />
            ))}
        </div>
        </section>
      </div>

      <section className="border-t border-[#f3e6d8] bg-[#FFF8F2]">
        <div className="mx-auto grid w-full max-w-[1680px] grid-cols-2 gap-x-4 gap-y-7 px-4 py-8 sm:px-6 sm:py-9 xl:px-10 lg:grid-cols-4 lg:gap-6">
          {PROMISES.map((item) => (
            <div key={item.title} className="flex flex-col items-center px-2 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDE8D6] text-[#E45700]">
                <PromiseIcon name={item.icon} />
              </span>
              <p className="mt-3 whitespace-pre-line text-[15px] font-bold leading-[1.25] text-[#3d2415] sm:text-[16px]">
                {item.title}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-[#a18472] sm:text-[13px]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {zoomed && (
        <button
          type="button"
          aria-label="Close zoom"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4"
          onClick={() => setZoomed(false)}
        >
          <span className="relative h-[min(86vh,820px)] w-[min(92vw,980px)]">
            <Image
              src={currentSlide?.secure_url || imgPlaceholder.src}
              alt={productImageAlt(currentSlide, product.name)}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </span>
        </button>
      )}
    </div>
  );
};

export default ProductDetails;
