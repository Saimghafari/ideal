"use client";
import {
  WEBSITE_CHECKOUT,
  WEBSITE_HOME,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { HiMinus, HiPlus } from "react-icons/hi2";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/store/reducer/cartReducer";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";
import { STATIC_PRODUCTS } from "@/lib/staticCatalog";

const catalogById = Object.fromEntries(
  STATIC_PRODUCTS.map((product) => [product._id, product])
);

const withLivePrices = (product) => {
  const live = catalogById[product.productId];
  if (!live) return product;
  return {
    ...product,
    name: live.name || product.name,
    sellingPrice: live.sellingPrice,
    mrp: live.mrp,
    media: product.media || live.media?.[0]?.secure_url,
  };
};

const QtyControl = ({ product, dispatch }) => (
  <div className="inline-flex h-10 items-stretch border border-[var(--si-mist)] bg-white">
    <button
      type="button"
      aria-label="Decrease quantity"
      className="flex w-10 items-center justify-center hover:bg-[var(--si-cream)]"
      onClick={() =>
        dispatch(
          decreaseQuantity({
            productId: product.productId,
            variantId: product.variantId,
            size: product.size,
          })
        )
      }
    >
      <HiMinus size={14} />
    </button>
    <input
      type="text"
      value={product.qty}
      readOnly
      aria-label="Quantity"
      className="w-10 border-x border-[var(--si-mist)] bg-transparent text-center text-sm outline-none"
    />
    <button
      type="button"
      aria-label="Increase quantity"
      className="flex w-10 items-center justify-center hover:bg-[var(--si-cream)]"
      onClick={() =>
        dispatch(
          increaseQuantity({
            productId: product.productId,
            variantId: product.variantId,
            size: product.size,
          })
        )
      }
    >
      <HiPlus size={14} />
    </button>
  </div>
);

const SummaryBlock = ({
  itemCount,
  subtotal,
  discount,
  formatPrice,
  tone = "light",
}) => {
  const muted = tone === "dark" ? "text-white/50" : "text-[var(--si-muted)]";
  const label = tone === "dark" ? "text-[var(--si-cream)]" : "text-[var(--si-burnt-orange)]";
  const total = tone === "dark" ? "text-[var(--si-cream)]" : "text-[var(--si-deep-brown)]";
  const rule = tone === "dark" ? "border-white/15" : "border-[var(--si-mist)]";

  return (
    <dl className="space-y-4 text-sm font-light">
      <div className="flex justify-between gap-4">
        <dt className={muted}>
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </dt>
        <dd className={total}>{formatPrice(subtotal)}</dd>
      </div>
      {discount > 0 && (
        <div className="flex justify-between gap-4">
          <dt className={muted}>Discount</dt>
          <dd className={label}>−{formatPrice(discount)}</dd>
        </div>
      )}
      <div className={`border-t pt-4 ${rule}`}>
        <div className="flex items-baseline justify-between gap-4">
          <dt className={`nn-label text-[0.58rem] ${label}`}>Total</dt>
          <dd className={`nn-display text-3xl ${total}`}>
            {formatPrice(subtotal)}
          </dd>
        </div>
        <p className={`mt-2 text-xs font-light ${muted}`}>
          Pakistani rupees. Shipping is confirmed after you order.
        </p>
      </div>
    </dl>
  );
};

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  const { formatPrice } = useCurrency();

  const items = (cart.products || []).filter(Boolean).map(withLivePrices);
  const itemCount = items.reduce((sum, product) => sum + (product.qty || 0), 0);
  const subtotal = items.reduce(
    (sum, product) => sum + (product.sellingPrice || 0) * (product.qty || 0),
    0
  );
  const discount = items.reduce(
    (sum, product) =>
      sum +
      Math.max(0, (product.mrp || 0) - (product.sellingPrice || 0)) *
        (product.qty || 0),
    0
  );

  if (cart.count === 0) {
    return (
      <div className="min-h-[70vh] bg-[var(--si-cream)] text-[var(--si-deep-brown)] lg:grid lg:min-h-[calc(100vh-5.5rem)] lg:grid-cols-2">
        <header className="flex flex-col justify-end bg-[var(--si-deep-brown)] px-6 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
          <nav className="mb-8 flex items-center gap-2 text-[0.58rem] tracking-[0.22em] uppercase text-white/45">
            <Link href={WEBSITE_HOME} className="hover:text-white">
              Home
            </Link>
            <span className="text-[var(--si-cream)]/50">/</span>
            <span className="text-white">Bag</span>
          </nav>
          <p className="nn-label mb-4 text-[var(--si-cream)]">Velora</p>
          <h1 className="nn-display text-5xl font-light leading-[0.95] text-[var(--si-cream)] sm:text-6xl">
            Your bag
          </h1>
          <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-white/50">
            Add clothing to continue to checkout.
          </p>
        </header>
        <section className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 xl:px-20">
          <p className="nn-label mb-4 text-[var(--si-burnt-orange)]">Empty bag</p>
          <h2 className="nn-display mb-4 text-4xl font-light">
            Nothing here yet
          </h2>
          <p className="mb-10 max-w-sm text-sm font-light leading-relaxed text-[var(--si-muted)]">
            Browse the collection and add a size before you check out.
          </p>
          <div>
            <Link href={WEBSITE_SHOP} className="nn-btn-primary">
              Shop clothing
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[var(--si-cream)] text-[var(--si-deep-brown)] lg:grid lg:min-h-[calc(100vh-5.5rem)] lg:grid-cols-[minmax(0,1fr)_22.5rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
      <section className="px-6 pb-28 pt-10 sm:px-10 sm:pt-12 lg:px-14 lg:pb-16 xl:px-20">
        <nav className="mb-8 flex items-center gap-2 text-[0.58rem] tracking-[0.22em] uppercase text-[var(--si-muted)] lg:hidden">
          <Link href={WEBSITE_HOME} className="hover:text-[var(--si-deep-brown)]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--si-deep-brown)]">Bag</span>
        </nav>
        <header className="mb-10 lg:hidden">
          <p className="nn-label mb-2 text-[var(--si-burnt-orange)]">Velora</p>
          <h1 className="nn-display text-4xl font-light">Your bag</h1>
          <p className="mt-3 text-sm font-light text-[var(--si-muted)]">
            {itemCount} {itemCount === 1 ? "item" : "items"} · Pakistani rupees
          </p>
        </header>

        <ul className="max-w-3xl">
          {items.map((product, index) => (
            <li
              key={product.variantId || product.productId}
              className={`grid gap-6 py-8 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] ${
                index === 0 ? "pt-0" : "border-t border-[var(--si-mist)]"
              }`}
            >
              <Link
                href={WEBSITE_PRODUCT_DETAILS(product.url)}
                className="relative aspect-[3/4] overflow-hidden bg-[var(--si-mist)]"
              >
                <Image
                  src={product.media || imgPlaceholder.src}
                  fill
                  sizes="(min-width: 1280px) 240px, (min-width: 640px) 208px, 100vw"
                  alt={product.name || "Clothing"}
                  className="object-cover object-center"
                />
              </Link>

              <div className="flex min-w-0 flex-col justify-between gap-8">
                <div>
                  <Link
                    href={WEBSITE_PRODUCT_DETAILS(product.url)}
                    className="nn-display text-2xl font-light leading-snug hover:text-[var(--si-burnt-orange)] sm:text-[1.75rem]"
                  >
                    {product.name}
                  </Link>
                  {product.size && (
                    <p className="mt-2 text-xs tracking-[0.16em] uppercase text-[var(--si-muted)]">
                      Size {product.size}
                    </p>
                  )}
                  <div className="mt-4 flex items-baseline gap-3">
                    <p className="text-base font-light">
                      {formatPrice(product.sellingPrice * product.qty)}
                    </p>
                    {product.mrp > product.sellingPrice && (
                      <p className="text-xs font-light text-[var(--si-muted)] line-through">
                        {formatPrice(product.mrp * product.qty)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <QtyControl product={product} dispatch={dispatch} />
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: product.productId,
                          variantId: product.variantId,
                          size: product.size,
                        })
                      )
                    }
                    className="text-[0.62rem] tracking-[0.16em] uppercase text-[var(--si-muted)] hover:text-[var(--si-burnt-orange)]"
                  >
                    Remove
                  </button>
                  <Link
                    href={WEBSITE_PRODUCT_DETAILS(product.url)}
                    className="text-[0.62rem] tracking-[0.16em] uppercase text-[var(--si-muted)] hover:text-[var(--si-burnt-orange)]"
                  >
                    View piece
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="hidden bg-[var(--si-deep-brown)] text-[var(--si-cream)] lg:sticky lg:top-0 lg:flex lg:h-[calc(100vh-5.5rem)] lg:flex-col lg:justify-between lg:self-start lg:px-10 lg:py-12 xl:px-12">
        <div>
          <nav className="mb-10 flex items-center gap-2 text-[0.58rem] tracking-[0.22em] uppercase text-white/40">
            <Link href={WEBSITE_HOME} className="hover:text-white">
              Home
            </Link>
            <span className="text-[var(--si-cream)]/50">/</span>
            <span className="text-white">Bag</span>
          </nav>
          <p className="nn-label mb-3 text-[var(--si-cream)]">Velora</p>
          <h1 className="nn-display text-4xl font-light leading-[0.95] xl:text-5xl">
            Your bag
          </h1>
        </div>

        <div>
          <SummaryBlock
            itemCount={itemCount}
            subtotal={subtotal}
            discount={discount}
            formatPrice={formatPrice}
            tone="dark"
          />
          <Link
            href={WEBSITE_CHECKOUT}
            className="mt-8 inline-flex w-full items-center justify-center bg-[var(--si-cream)] px-8 py-[1.05rem] text-[0.63rem] font-medium uppercase tracking-[0.26em] text-[var(--si-deep-brown)] transition-colors hover:bg-white"
          >
            Checkout
          </Link>
          <p className="mt-5 text-center">
            <Link
              href={WEBSITE_SHOP}
              className="text-[0.62rem] tracking-[0.16em] uppercase text-white/45 hover:text-[var(--si-cream)]"
            >
              Continue shopping
            </Link>
          </p>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--si-mist)] bg-[var(--si-deep-brown)] px-6 py-4 text-[var(--si-cream)] lg:hidden">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="nn-label text-[0.52rem] text-[var(--si-cream)]">
              Total
            </p>
            <p className="nn-display text-2xl">{formatPrice(subtotal)}</p>
          </div>
          <Link
            href={WEBSITE_CHECKOUT}
            className="inline-flex items-center justify-center bg-[var(--si-cream)] px-8 py-3 text-[0.63rem] font-medium uppercase tracking-[0.26em] text-[var(--si-deep-brown)]"
          >
            Checkout
          </Link>
        </div>
        <p className="text-center">
          <Link
            href={WEBSITE_SHOP}
            className="text-[0.58rem] tracking-[0.16em] uppercase text-white/45"
          >
            Continue shopping
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CartPage;
