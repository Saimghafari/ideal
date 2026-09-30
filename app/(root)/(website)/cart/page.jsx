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
    categoryName: live.category?.name || "",
  };
};

const QtyControl = ({ product, dispatch }) => (
  <div className="inline-flex h-10 items-center rounded-full border border-[#f1e3d4] bg-[#FFF8F2] p-1">
    <button
      type="button"
      aria-label="Decrease quantity"
      disabled={product.qty <= 1}
      className="flex h-8 w-8 items-center justify-center rounded-full text-[#3a2416] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:text-[#cbb8aa]"
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
      className="w-8 bg-transparent text-center text-[14px] font-bold text-[#3a2416] outline-none"
    />
    <button
      type="button"
      aria-label="Increase quantity"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E45700] text-white transition-colors hover:bg-[#cf4c00]"
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

const SummaryBlock = ({ itemCount, subtotal, discount, formatPrice }) => (
  <dl className="space-y-3.5 text-[14.5px]">
    <div className="flex justify-between gap-4">
      <dt className="text-[#8a6754]">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </dt>
      <dd className="font-semibold text-[#3a2416]">{formatPrice(subtotal)}</dd>
    </div>
    {discount > 0 && (
      <div className="flex justify-between gap-4">
        <dt className="text-[#8a6754]">You save</dt>
        <dd className="font-semibold text-[#E45700]">−{formatPrice(discount)}</dd>
      </div>
    )}
    <div className="border-t border-[#f1e3d4] pt-4">
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#8a6754]">
          Total
        </dt>
          <dd className="font-display text-right text-[1.55rem] font-semibold leading-none tracking-[-0.03em] text-[#3a2416] min-[400px]:text-[1.85rem] sm:text-[2.1rem]">
          {formatPrice(subtotal)}
        </dd>
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[#9a8170]">
        Pakistani rupees. Shipping is confirmed after you place the order.
      </p>
    </div>
  </dl>
);

const Crumb = () => (
  <nav
    aria-label="Breadcrumb"
    className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[#8a6754]"
  >
    <Link href={WEBSITE_HOME} className="hover:text-[#E45700]">
      Home
    </Link>
    <span aria-hidden="true">›</span>
    <span className="font-medium text-[#3a2416]">Cart</span>
  </nav>
);

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
      <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
        <div className="mx-auto grid w-full max-w-[1680px] items-center gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:py-16 xl:px-10">
          <div className="relative order-2 aspect-[5/4] overflow-hidden rounded-[24px] bg-[#f7efe6] shadow-[0_12px_32px_rgba(75,46,30,0.08)] sm:aspect-[4/3] lg:order-1">
            <Image
              src="/assets/home/si-gift-box.png"
              alt="Packed sweets gift box from Super Ideal"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 max-w-xl lg:order-2">
            <Crumb />
            <p className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#E45700]">
              Super Ideal
            </p>
            <h1 className="font-display text-[2.15rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.4rem]">
              Your cart is empty
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#6b5142] sm:text-[16px]">
              Add sweets, bakery, biscuits, or a gift box. Fresh trays and packed
              boxes are ready when you are.
            </p>
            <Link
              href={WEBSITE_SHOP}
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#E45700] px-7 text-[14.5px] font-bold text-white shadow-[0_8px_16px_rgba(228,87,0,0.28)] transition-colors hover:bg-[#cf4c00]"
            >
              Shop sweets & bakery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
      <div className="mx-auto w-full max-w-[1680px] px-3 py-6 min-[400px]:px-4 sm:px-6 sm:py-8 lg:py-10 xl:px-10">
        <Crumb />
        <header className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#E45700]">
              Super Ideal
            </p>
            <h1 className="font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.85rem]">
              Your cart
            </h1>
          </div>
          <p className="text-[14px] text-[#8a6754]">
            {itemCount} {itemCount === 1 ? "item" : "items"} · Sweets & bakery
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <ul className="space-y-3 sm:space-y-4">
            {items.map((product) => {
              const lineTotal = (product.sellingPrice || 0) * (product.qty || 0);
              const lineMrp = (product.mrp || 0) * (product.qty || 0);
              const onSale = product.mrp > product.sellingPrice;

              return (
                <li
                  key={product.variantId || product.productId}
                  className="rounded-[20px] border border-[#f1e3d4] bg-white p-2.5 shadow-[0_6px_18px_rgba(75,46,30,0.05)] min-[400px]:p-3 sm:p-4"
                >
                  <div className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-x-2.5 gap-y-3 min-[400px]:grid-cols-[4.75rem_minmax(0,1fr)] min-[400px]:gap-x-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-5 lg:grid-cols-[9.5rem_minmax(0,1fr)]">
                    <Link
                      href={WEBSITE_PRODUCT_DETAILS(product.url)}
                      className="relative aspect-square overflow-hidden rounded-xl bg-[#f7efe6] sm:rounded-2xl"
                    >
                      <Image
                        src={product.media || imgPlaceholder.src}
                        fill
                        sizes="(min-width: 1024px) 152px, (min-width: 640px) 136px, 76px"
                        alt={product.name || "Sweet or bakery item"}
                        className="object-cover"
                      />
                    </Link>

                    <div className="min-w-0 self-center">
                      {product.categoryName ? (
                        <p className="text-[11px] font-semibold text-[#9a8170] sm:text-[11.5px]">
                          {product.categoryName}
                        </p>
                      ) : null}
                      <Link
                        href={WEBSITE_PRODUCT_DETAILS(product.url)}
                        className="mt-0.5 block font-display text-[1.02rem] font-semibold leading-snug tracking-[-0.02em] text-[#3a2416] hover:text-[#E45700] min-[400px]:text-[1.15rem] sm:text-[1.35rem]"
                      >
                        {product.name}
                      </Link>
                      {product.size ? (
                        <p className="mt-1 text-[12px] text-[#8a6754] sm:text-[12.5px]">
                          Pack {product.size}
                        </p>
                      ) : null}
                      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
                        <p className="text-[14px] font-extrabold text-[#E45700] min-[400px]:text-[15px]">
                          {formatPrice(lineTotal)}
                        </p>
                        {onSale ? (
                          <p className="text-[12px] text-[#b7a498] line-through min-[400px]:text-[12.5px]">
                            {formatPrice(lineMrp)}
                          </p>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-[#9a8170] sm:text-[12px]">
                        {formatPrice(product.sellingPrice)} each
                      </p>
                    </div>

                    <div className="col-span-2 flex items-center justify-between gap-2 border-t border-[#f6efe8] pt-2.5 sm:col-span-1 sm:col-start-2 sm:pt-1">
                      <QtyControl product={product} dispatch={dispatch} />
                      <div className="flex shrink-0 items-center gap-3">
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
                          className="text-[12.5px] font-bold text-[#9a8170] transition-colors hover:text-[#E45700] sm:text-[13px]"
                        >
                          Remove
                        </button>
                        <Link
                          href={WEBSITE_PRODUCT_DETAILS(product.url)}
                          className="text-[12.5px] font-bold text-[#9a8170] transition-colors hover:text-[#E45700] sm:text-[13px]"
                        >
                          View product
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="rounded-[24px] border border-[#f1e3d4] bg-white p-4 shadow-[0_10px_28px_rgba(75,46,30,0.06)] min-[400px]:p-5 sm:p-6 lg:sticky lg:top-[calc(76px+env(safe-area-inset-top,0px)+1.25rem)]">
            <h2 className="font-display text-[1.45rem] font-semibold tracking-[-0.02em] text-[#3a2416]">
              Order summary
            </h2>
            <p className="mt-1 mb-5 text-[13px] leading-relaxed text-[#8a6754]">
              Packed sweets, bakery, and gift boxes for your order.
            </p>
            <SummaryBlock
              itemCount={itemCount}
              subtotal={subtotal}
              discount={discount}
              formatPrice={formatPrice}
            />
            <Link
              href={WEBSITE_CHECKOUT}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#E45700] px-6 text-[14.5px] font-bold text-white shadow-[0_8px_16px_rgba(228,87,0,0.28)] transition-colors hover:bg-[#cf4c00]"
            >
              Checkout
            </Link>
            <Link
              href={WEBSITE_SHOP}
              className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border-2 border-[#E45700] bg-white text-[14.5px] font-bold text-[#E45700] transition-colors hover:bg-[#fff4ec]"
            >
              Continue shopping
            </Link>
            <ul className="mt-5 space-y-2 border-t border-[#f1e3d4] pt-4 text-[12.5px] text-[#8a6754]">
              <li>Freshly packed for delivery</li>
              <li>Premium ingredients, made with care</li>
              <li>Trusted bakery since 1969</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
