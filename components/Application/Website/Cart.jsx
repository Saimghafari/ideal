"use client";
import { BsCart2 } from "react-icons/bs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import imgPlaceholder from "../../../public/assets/images/img-placeholder.webp";
import { removeFromCart, sanitizeCart } from "../../../store/reducer/cartReducer";
import Link from "next/link";
import {
  WEBSITE_CART,
  WEBSITE_CHECKOUT,
  WEBSITE_SHOP,
} from "../../../routes/WebsiteRoute";
import { useEffect, useState } from "react";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";

const Cart = ({ tone = "dark", variant = "icon" }) => {
  const [open, setOpen] = useState(false);
  const [subtotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const cart = useSelector((store) => store.cartStore);
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();
  const isLight = tone === "light";

  useEffect(() => {
    if (cart.products?.some((item) => !item)) {
      dispatch(sanitizeCart());
    }
  }, [cart.products, dispatch]);

  useEffect(() => {
    const cartProducts = (cart.products || []).filter(Boolean);

    const totalAmount = cartProducts.reduce(
      (sum, product) => sum + (product.sellingPrice || 0) * (product.qty || 0),
      0
    );

    const discountTotal = cartProducts.reduce(
      (sum, product) =>
        sum +
        ((product.mrp || 0) - (product.sellingPrice || 0)) * (product.qty || 0),
      0
    );

    setSubTotal(totalAmount);
    setDiscount(discountTotal);
  }, [cart]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={
          variant === "count"
            ? "flex h-[30px] min-w-[30px] items-center justify-center rounded-full bg-white text-[18px] font-medium leading-none text-black"
            : `relative flex h-9 w-9 items-center justify-center transition-colors duration-500 ${
                isLight
                  ? "text-[var(--si-cream)]/65 hover:text-[var(--si-cream)]"
                  : "text-[var(--si-deep-brown)]/50 hover:text-[var(--si-deep-brown)]"
              }`
        }
        aria-label={`Cart, ${cart.count} items`}
      >
        {variant === "count" ? (
          cart.count
        ) : (
          <>
            <BsCart2 size={18} />
            <span
              className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.55rem] font-medium tracking-wide ${
                isLight
                  ? "bg-[var(--si-burnt-orange)] text-[var(--si-deep-brown)]"
                  : "bg-[var(--si-deep-brown)] text-[var(--si-cream)]"
              }`}
            >
              {cart.count}
            </span>
          </>
        )}
      </SheetTrigger>

      <SheetContent
        overlayClassName="z-[100]"
        className="z-[100] flex h-dvh max-h-dvh w-full flex-col gap-0 overflow-hidden border-l border-[var(--si-mist)] bg-[var(--si-cream)] p-0 sm:max-w-[440px] [&>button]:right-4 [&>button]:top-4 [&>button]:text-[var(--si-deep-brown)]/50 [&>button]:hover:text-[var(--si-deep-brown)] [&>button]:opacity-100 [&>button]:ring-0 [&>button]:focus:ring-0"
      >
        <SheetHeader className="shrink-0 space-y-0 border-b border-[var(--si-mist)] px-6 pb-4 pt-5 text-left sm:px-7">
          <div className="nn-hairline-gold mb-3 w-10" />
          <p className="nn-label mb-1.5 text-[0.52rem] text-[var(--si-deep-brown)]">
            Selection
          </p>
          <SheetTitle className="nn-display text-[1.75rem] font-light tracking-[0.04em] text-[var(--si-deep-brown)] sm:text-[2rem]">
            My{" "}
            <span className="nn-display-italic text-[var(--si-burnt-orange)]">Cart</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review items in your shopping cart
          </SheetDescription>
          {cart.count > 0 && (
            <p className="mt-2 text-[0.7rem] font-light uppercase tracking-[0.18em] text-[var(--si-muted)]">
              {cart.count} {cart.count === 1 ? "item" : "items"}
            </p>
          )}
        </SheetHeader>

        <div className="nn-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4 sm:px-7">
          {cart.count === 0 && (
            <div className="flex h-full min-h-[180px] flex-col items-center justify-center px-4 text-center">
              <div className="nn-hairline-gold mb-6 w-10" />
              <p className="nn-display mb-2 text-2xl font-light text-[var(--si-deep-brown)]">
                Your cart is{" "}
                <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                  empty
                </span>
              </p>
              <p className="max-w-[220px] text-sm font-light leading-relaxed text-[var(--si-muted)]">
                Browse the collection and add a piece to your bag.
              </p>
            </div>
          )}

          <ul className="divide-y divide-[var(--si-mist)]">
            {(cart.products || []).filter(Boolean).map((product) => (
              <li
                key={product.variantId || product.productId}
                className="flex gap-4 py-4 first:pt-0"
              >
                <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden bg-[var(--si-mist)] ring-1 ring-[var(--si-burnt-orange)]/20">
                  <Image
                    src={product.media || imgPlaceholder.src}
                    fill
                    sizes="72px"
                    alt={product.name || "Product"}
                    className="object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    <h4 className="nn-display line-clamp-2 text-lg font-light leading-snug text-[var(--si-deep-brown)]">
                      {product.name}
                    </h4>
                    {product.size && (
                      <p className="nn-label mt-1.5 text-[0.48rem] text-[var(--si-burnt-orange)]">
                        {product.size}
                      </p>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-light tracking-wide text-[var(--si-deep-brown)]">
                    <span className="text-[var(--si-muted)]">{product.qty} ×</span>{" "}
                    {formatPrice(product.sellingPrice)}
                  </p>
                </div>

                <button
                  type="button"
                  className="nn-label cursor-pointer self-start pt-1 text-[0.48rem] tracking-[0.18em] text-[var(--si-muted)] transition-colors hover:text-[var(--si-deep-brown)]"
                  onClick={() =>
                    dispatch(
                      removeFromCart({
                        productId: product.productId,
                        variantId: product.variantId,
                        size: product.size,
                      })
                    )
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 border-t border-[var(--si-mist)] bg-[var(--si-cream)] px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7 sm:py-5">
          <div className="mb-4 space-y-2 text-sm font-light">
            <div className="flex items-baseline justify-between gap-3">
              <span className="tracking-wide text-[var(--si-muted)]">
                Subtotal
              </span>
              <span className="tracking-wide text-[var(--si-deep-brown)]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="tracking-wide text-[var(--si-muted)]">
                Discount
              </span>
              <span className="tracking-wide text-[var(--si-deep-brown)]">
                ?{formatPrice(discount)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {cart.count === 0 ? (
              <Link
                href={WEBSITE_SHOP}
                onClick={() => setOpen(false)}
                className="nn-btn-primary w-full !py-3 text-center"
              >
                Continue Shopping
              </Link>
            ) : (
              <>
                <Link
                  href={WEBSITE_CART}
                  onClick={() => setOpen(false)}
                  className="nn-btn-outline w-full !py-3 text-center"
                >
                  View Cart
                </Link>
                <Link
                  href={WEBSITE_CHECKOUT}
                  onClick={() => setOpen(false)}
                  className="nn-btn-primary w-full !py-3 text-center"
                >
                  Checkout
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
