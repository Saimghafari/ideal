"use client";

import { WEBSITE_CART, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import ProductReveiw from "@/components/Application/Website/ProductReveiw";
import ProductGallery from "@/components/Application/Website/ProductGallery";
import RelatedCollection from "@/components/Application/Website/RelatedCollection";
import { marked } from "marked";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";

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

const StoryColumn = ({ copy }) => (
  <div className="flex h-full min-h-0 flex-col bg-[var(--si-cream)] px-8 py-10 xl:px-10">
    <div className="shrink-0">
      <p className="text-[11px] text-[var(--si-muted)]">Framework No. 01</p>
      <h2 className="mt-10 font-sans text-[2.65rem] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-black xl:text-[3.25rem]">
        Cut once.
        <br />
        Worn for
        <br />
        years.
      </h2>
    </div>
    <div className="nn-scrollbar mt-8 max-h-36 min-h-0 flex-1 overflow-y-auto pr-2 lg:max-h-none">
      <p className="max-w-[15.5rem] text-[13px] leading-[1.7] text-[var(--si-muted)]">
        {copy}
      </p>
    </div>
    <p className="max-w-[15.5rem] shrink-0 pt-8 text-[11px] leading-[1.65] text-[var(--si-muted)]">
      Scroll to Fit. One garment, one cut — there was nothing left to fix.
    </p>
  </div>
);

const BuyPanel = ({
  product,
  categoryName,
  shopCategoryHref,
  formatPrice,
  displayPrices,
  hasDiscount,
  sizes,
  selectedSize,
  onSizeSelect,
  qty,
  onQty,
  isAddedIntoCart,
  onAddToCart,
}) => (
  <div className="flex h-full flex-col justify-center bg-[var(--si-cream)] px-8 py-10 xl:px-12">
    <div className="w-full max-w-[20rem]">
      <h1 className="font-sans text-[22px] font-medium leading-[1.2] tracking-[-0.02em] text-black">
        {product.name}
      </h1>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[var(--si-muted)]">
        {categoryName && (
          <Link href={shopCategoryHref} className="hover:text-black">
            {categoryName}
          </Link>
        )}
        {hasDiscount && <span>Sale</span>}
      </div>

      <p className="mt-7 text-[28px] font-medium leading-none tracking-[-0.03em] text-black">
        {formatPrice(displayPrices.sellingPrice)}
      </p>

      <div className="mt-8">
        <p className="mb-3 text-[13px] font-medium text-black">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((sizeValue) => {
            const active = selectedSize === sizeValue;
            return (
              <button
                key={sizeValue}
                type="button"
                onClick={() => onSizeSelect(sizeValue)}
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-[13px] font-medium ${
                  active
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[var(--si-cream)] text-black/80 hover:bg-[#e8e8e8]"
                }`}
              >
                {sizeValue}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        <p className="mb-3 text-[13px] font-medium text-black">Quantity</p>
        <div className="inline-flex h-10 items-center rounded-[10px] border border-[#e6e6e6] bg-[var(--si-cream)] px-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="flex h-8 w-8 items-center justify-center text-[18px] leading-none text-black/70"
            onClick={() => onQty("desc")}
          >
            −
          </button>
          <input
            type="text"
            value={qty}
            readOnly
            aria-label="Quantity"
            className="w-8 bg-transparent text-center text-[14px] outline-none"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            className="flex h-8 w-8 items-center justify-center text-[18px] leading-none text-black/70"
            onClick={() => onQty("inc")}
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-8">
        {!isAddedIntoCart ? (
          <button
            type="button"
            onClick={onAddToCart}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#1a1a1a] text-[14px] font-medium text-white hover:bg-black"
          >
            Add to cart
          </button>
        ) : (
          <Link
            href={WEBSITE_CART}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] text-[14px] font-medium text-white hover:bg-black"
          >
            Go to cart
          </Link>
        )}
      </div>
    </div>
  </div>
);

const ProductDetails = ({
  product,
  variant,
  colors: _colors,
  sizes: _sizes,
  reviewCount: _reviewCount,
  relatedProducts = [],
  collectionHref,
}) => {
  const dispatch = useDispatch();
  const cartStore = useSelector((store) => store.cartStore);
  const { formatPrice, resolvePrices, currency } = useCurrency();
  const sizes = _sizes?.length ? _sizes : ["XS", "S", "M", "L", "XL"];

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    sizes.includes("M") ? "M" : sizes[0] || ""
  );
  const [isAddedIntoCart, setIsAddedIntoCart] = useState(false);

  useEffect(() => {
    document.body.classList.add("pd-page");
    return () => document.body.classList.remove("pd-page");
  }, []);

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
      discountPercentage:
        variant?.discountPercentage ?? product.discountPercentage,
      media: variant?.media?.length ? variant.media : product.media || [],
      isProductFallback: !variant || variant.isProductFallback,
    };
  }, [variant, product]);

  const displayPrices = useMemo(
    () => resolvePrices(activeVariant),
    [activeVariant, resolvePrices]
  );

  const galleryMedia =
    activeVariant?.media?.length > 0
      ? activeVariant.media
      : product?.media || [];

  const descriptionHtml = useMemo(() => {
    try {
      return marked(product?.description || "");
    } catch {
      return product?.description || "";
    }
  }, [product?.description]);

  const storyCopy = useMemo(() => {
    const fromProduct = toPlainText(descriptionHtml);
    if (fromProduct) return fromProduct;
    return "We start with reused cotton canvases from a business and that have run the same house since 1985. Every seam is last-tacked at the stress points, every button is cotton-twill, not plastic.";
  }, [descriptionHtml]);

  useEffect(() => {
    if (!product?._id || !activeVariant?._id) return;

    const existingProduct = cartStore.products.findIndex(
      (cartProduct) =>
        cartProduct?.productId === product._id &&
        cartProduct?.variantId === activeVariant._id &&
        cartProduct?.size === (selectedSize || null)
    );

    setIsAddedIntoCart(existingProduct >= 0);
  }, [activeVariant, cartStore.products, product?._id, selectedSize]);

  const handleQty = (actionType) => {
    if (actionType === "inc") setQty((prev) => prev + 1);
    else if (qty !== 1) setQty((prev) => prev - 1);
  };

  const buildCartProduct = () => ({
    productId: product._id,
    variantId: activeVariant._id,
    name: product.name,
    url: product.slug,
    size: selectedSize || null,
    color: null,
    mrp: displayPrices.mrp,
    sellingPrice: displayPrices.sellingPrice,
    currency: displayPrices.currency || currency,
    media:
      activeVariant?.media?.[0]?.secure_url ||
      product?.media?.[0]?.secure_url,
    qty: qty,
  });

  const handleAddToCart = () => {
    if (!product?._id || !activeVariant?._id) return;
    if (!selectedSize) {
      showToast("error", "Please select a size first.");
      return;
    }
    dispatch(addIntoCart(buildCartProduct()));
    setIsAddedIntoCart(true);
    showToast("success", "Product added into cart.");
  };

  const handleSizeSelect = (sizeValue) => {
    setSelectedSize(sizeValue);
    setIsAddedIntoCart(false);
  };

  const categoryName = product?.category?.name;
  const shopCategoryHref = collectionHref || WEBSITE_SHOP;
  const hasDiscount = Number(displayPrices?.discountPercentage) > 0;

  const buyProps = {
    product,
    categoryName,
    shopCategoryHref,
    formatPrice,
    displayPrices,
    hasDiscount,
    sizes,
    selectedSize,
    onSizeSelect: handleSizeSelect,
    qty,
    onQty: handleQty,
    isAddedIntoCart,
    onAddToCart: handleAddToCart,
  };

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--si-cream)] px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold text-black">Piece not found</h1>
      </div>
    );
  }

  return (
    <div className="bg-[var(--si-cream)] text-black">
      <section className="hidden lg:grid lg:grid-cols-[minmax(17rem,0.92fr)_minmax(0,1.25fr)_minmax(17rem,0.88fr)]">
        <div className="sticky top-[var(--pd-header)] h-[calc(100dvh-var(--pd-header))] border-r border-[#ececec]">
          <StoryColumn copy={storyCopy} />
        </div>
        <div className="-mt-[var(--pd-header)]">
          <ProductGallery
            media={galleryMedia}
            productName={product?.name || "Product"}
            layout="stack"
          />
        </div>
        <div className="sticky top-[var(--pd-header)] h-[calc(100dvh-var(--pd-header))] overflow-y-auto border-l border-[#ececec]">
          <BuyPanel {...buyProps} />
        </div>
      </section>

      <div className="lg:hidden">
        <div className="-mt-[var(--pd-header)]">
          <ProductGallery
            media={galleryMedia}
            productName={product?.name || "Product"}
            layout="stack"
          />
        </div>
        <div className="pd-after-gallery border-t border-[#ececec]">
          <BuyPanel {...buyProps} />
        </div>
        <div className="border-t border-[#ececec]">
          <StoryColumn copy={storyCopy} />
        </div>
      </div>

      <RelatedCollection
        products={relatedProducts}
        categoryName={categoryName}
        collectionHref={shopCategoryHref}
      />

      <section className="border-t border-[#ececec] bg-[var(--si-cream)] px-5 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-24">
        <div className="mx-auto max-w-7xl">
          <ProductReveiw productId={product._id} />
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
