"use client";
import ButtonLoading from "@/components/Application/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { zSchema } from "@/lib/zodSchema";
import {
  WEBSITE_HOME,
  WEBSITE_ORDER_SUCCESS,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import { addIntoCart, clearCart } from "@/store/reducer/cartReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { IoCloseCircleSharp, IoMailOutline } from "react-icons/io5";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";

import Loading from "@/components/Application/Loading";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";

const inputClass =
  "h-11 rounded-none border border-[var(--si-mist)] bg-[var(--si-cream)] px-4 text-sm font-light text-[var(--si-deep-brown)] shadow-none placeholder:text-[var(--si-fog)] focus-visible:ring-0 focus-visible:border-[var(--si-burnt-orange)] transition-colors duration-300";

const labelClass =
  "text-[0.62rem] tracking-[0.2em] uppercase font-medium text-[var(--si-muted)] mb-2.5 block";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  const authStore = useSelector((store) => store.authStore);
  const { formatPrice, currency } = useCurrency();
  const [verifiedCartData, setVerifiedCartData] = useState([]);
  const { data: getVerifiedCartData } = useFetch(
    "/api/cart-verification",
    "POST",
    { data: cart.products }
  );

  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [subtotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const [placingOrder, setPlacingOrder] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  useEffect(() => {
    if (getVerifiedCartData && getVerifiedCartData.success) {
      const cartData = (getVerifiedCartData.data || []).filter(Boolean);
      setVerifiedCartData(cartData);
      dispatch(clearCart());
      cartData.forEach((cartItem) => {
        dispatch(addIntoCart(cartItem));
      });
    }
  }, [getVerifiedCartData]);

  useEffect(() => {
    const cartProducts = (cart.products || []).filter(Boolean);

    const subTotalAmount = cartProducts.reduce(
      (sum, product) => sum + (product.sellingPrice || 0) * (product.qty || 0),
      0
    );

    const discount = cartProducts.reduce(
      (sum, product) =>
        sum +
        ((product.mrp || 0) - (product.sellingPrice || 0)) * (product.qty || 0),
      0
    );

    setSubTotal(subTotalAmount);
    setDiscount(discount);
    setTotalAmount(subTotalAmount);

    couponForm.setValue("minShoppingAmount", subTotalAmount);
  }, [cart]);

  // coupon form

  const couponFormSchema = zSchema.pick({
    code: true,
    minShoppingAmount: true,
  });

  const couponForm = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      minShoppingAmount: subtotal,
    },
  });

  const applyCoupon = async (values) => {
    setCouponLoading(true);
    try {
      const { data: response } = await axios.post("/api/coupon/apply", values);
      if (!response.success) {
        throw new Error(response.message);
      }

      const discountPercentage = response.data.discountPercentage;
      // get coupon discount amount
      setCouponDiscountAmount((subtotal * discountPercentage) / 100);
      setTotalAmount(subtotal - (subtotal * discountPercentage) / 100);
      showToast("success", response.message);
      setCouponCode(couponForm.getValues("code"));
      setIsCouponApplied(true);

      couponForm.resetField("code", "");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setIsCouponApplied(false);
    setCouponCode("");
    setCouponDiscountAmount(0);
    setTotalAmount(subtotal);
  };

  // place order
  const orderFormSchema = zSchema
    .pick({
      name: true,
      email: true,
      phone: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
      landmark: true,
      ordernote: true,
    })
    .extend({
      userId: z.string().optional(),
    });

  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      landmark: "",
      ordernote: "",
      userId: authStore?.auth?._id,
    },
  });

  useEffect(() => {
    if (authStore) {
      orderForm.setValue("userId", authStore?.auth?._id);
    }
  }, [authStore]);

  const placeOrder = async (formData) => {
    setPlacingOrder(true);
    setSavingOrder(true);
    try {
      const products = verifiedCartData.map((cartItem) => ({
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        name: cartItem.name,
        size: cartItem.size || null,
        qty: cartItem.qty,
        mrp: cartItem.mrp,
        sellingPrice: cartItem.sellingPrice,
      }));

      const { data: paymentResponseData } = await axios.post(
        "/api/payment/save-cod-order",
        {
          ...formData,
          products: products,
          subtotal: subtotal,
          discount: discount,
          couponDiscountAmount: couponDiscountAmount,
          totalAmount: totalAmount,
          currency:
            verifiedCartData[0]?.currency || currency || "PKR",
        }
      );

      if (paymentResponseData.success) {
        showToast(
          "success",
          paymentResponseData.data?.emailSent === false
            ? "Order placed. Contact us with your Order ID if you need payment details."
            : "Order confirmed — check your email for bank transfer details."
        );
        dispatch(clearCart());
        orderForm.reset();
        router.push(WEBSITE_ORDER_SUCCESS(paymentResponseData.data.order_id));
      } else {
        showToast("error", paymentResponseData.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setPlacingOrder(false);
      setSavingOrder(false);
    }
  };

  return (
    <div className="relative min-h-[70vh] nn-cream-bg">
      {savingOrder && (
        <Loading variant="overlay" label="Confirming order" />
      )}

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.45]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% 0%, rgb(228 87 0 / 12%), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 20%, rgb(75 46 30 / 6%), transparent 50%)",
        }}
      />

      <section className="relative px-6 sm:px-10 lg:px-28 xl:px-36 pt-10 sm:pt-14 pb-20 sm:pb-28">
        <nav className="nn-animate-fade-up flex items-center gap-2 text-[0.58rem] tracking-[0.28em] uppercase text-[var(--si-muted)] mb-6">
          <Link
            href={WEBSITE_HOME}
            className="hover:text-[var(--si-deep-brown)] transition-colors"
          >
            Home
          </Link>
          <span className="text-[var(--si-burnt-orange)]/50">/</span>
          <span className="text-[var(--si-deep-brown)]">Checkout</span>
        </nav>

        <div className="nn-animate-fade-up-delay-1 max-w-2xl mb-8 sm:mb-10">
          <div className="nn-hairline-gold w-16 mb-5" />
          <p className="nn-label text-[var(--si-deep-brown)] mb-3">Secure Checkout</p>
          <h1 className="nn-display text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-[var(--si-deep-brown)] leading-[0.95]">
            Complete Your{" "}
            <span className="nn-display-italic text-[var(--si-burnt-orange)]">
              Order
            </span>
          </h1>
          {cart.count > 0 && (
            <p className="mt-3 text-sm font-light tracking-wide text-[var(--si-muted)]">
              {cart.count} {cart.count === 1 ? "piece" : "pieces"} awaiting
              delivery details
            </p>
          )}
        </div>

        {cart.count === 0 ? (
          <div className="nn-animate-fade-up-delay-2 mx-auto max-w-lg text-center py-16 sm:py-20 border border-[var(--si-mist)] bg-[var(--si-cream)]/60">
            <div className="nn-hairline-gold w-12 mx-auto mb-10" />
            <p className="nn-label text-[var(--si-burnt-orange)] mb-5">Empty Atelier</p>
            <h2 className="nn-display text-3xl sm:text-4xl font-light text-[var(--si-deep-brown)] mb-4">
              Your cart is{" "}
              <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                empty
              </span>
            </h2>
            <p className="text-sm font-light text-[var(--si-muted)] mb-10 max-w-xs mx-auto leading-relaxed">
              Discover signed works from the collection and begin your
              selection.
            </p>
            <Link href={WEBSITE_SHOP} className="nn-btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
            {/* Order summary — first on mobile, sticky right column on lg+ */}
            <aside className="order-1 lg:order-2 lg:w-[35%] w-full shrink-0 self-stretch">
              <div className="border border-[var(--si-mist)] bg-[var(--si-cream)] p-8 sm:p-10 lg:sticky lg:top-28 lg:z-20">
                <div className="nn-hairline-gold w-12 mb-6" />
                <p className="nn-label text-[var(--si-deep-brown)] mb-3">Summary</p>
                <h2 className="nn-display text-3xl font-light text-[var(--si-deep-brown)] mb-8">
                  Order{" "}
                  <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                    details
                  </span>
                </h2>

                <ul className="divide-y divide-[var(--si-mist)] mb-8">
                  {verifiedCartData &&
                    verifiedCartData.filter(Boolean).map((product) => (
                      <li
                        key={product.variantId || product.productId}
                        className="py-5 first:pt-0"
                      >
                        <div className="flex items-start gap-4">
                          <Link
                            href={WEBSITE_PRODUCT_DETAILS(product.url)}
                            className="group relative shrink-0 w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] overflow-hidden bg-[var(--si-mist)] ring-1 ring-[var(--si-burnt-orange)]/20"
                          >
                            <Image
                              src={product.media || imgPlaceholder.src}
                              fill
                              sizes="72px"
                              alt={product.name || "Product"}
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <h3 className="nn-display text-base sm:text-lg font-light text-[var(--si-deep-brown)] leading-snug line-clamp-2">
                              <Link
                                href={WEBSITE_PRODUCT_DETAILS(product.url)}
                                className="hover:text-[var(--si-deep-brown)] transition-colors duration-300"
                              >
                                {product.name}
                              </Link>
                            </h3>
                            {product.size && (
                              <p className="mt-1.5 nn-label text-[var(--si-burnt-orange)] text-[0.5rem]">
                                {product.size}
                              </p>
                            )}
                            <p className="mt-2 text-sm font-light tracking-wide text-[var(--si-muted)]">
                              {product.qty} × {formatPrice(product.sellingPrice)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>

                <dl className="space-y-4 text-sm font-light">
                  <div className="flex justify-between items-baseline gap-4">
                    <dt className="text-[var(--si-muted)] tracking-wide">
                      Subtotal
                    </dt>
                    <dd className="text-[var(--si-deep-brown)] tracking-wide">
                      {formatPrice(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between items-baseline gap-4">
                    <dt className="text-[var(--si-muted)] tracking-wide">
                      Discount
                    </dt>
                    <dd className="text-[var(--si-deep-brown)] tracking-wide">
                      −{formatPrice(discount)}
                    </dd>
                  </div>
                  <div className="flex justify-between items-baseline gap-4">
                    <dt className="text-[var(--si-muted)] tracking-wide">
                      Coupon Discount
                    </dt>
                    <dd className="text-[var(--si-deep-brown)] tracking-wide">
                      −{formatPrice(couponDiscountAmount)}
                    </dd>
                  </div>
                  <div className="nn-hairline my-2" />
                  <div className="flex justify-between items-baseline gap-4 pt-1">
                    <dt className="nn-label text-[var(--si-deep-brown)] text-[0.58rem]">
                      Total
                    </dt>
                    <dd className="nn-display text-2xl text-[var(--si-deep-brown)]">
                      {formatPrice(totalAmount)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 pt-8 border-t border-[var(--si-mist)]">
                  {!isCouponApplied ? (
                    <Form {...couponForm}>
                      <form
                        className="space-y-3"
                        onSubmit={couponForm.handleSubmit(applyCoupon)}
                      >
                        <p className="nn-label text-[var(--si-muted)] text-[0.52rem]">
                          Promotional Code
                        </p>
                        <div className="flex gap-3">
                          <div className="flex-1 min-w-0">
                            <FormField
                              control={couponForm.control}
                              name="code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter code"
                                      className={inputClass}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                                </FormItem>
                              )}
                            />
                          </div>
                          <ButtonLoading
                            type="submit"
                            text="Apply"
                            className="shrink-0 nn-btn-outline !py-0 !px-5 h-11 rounded-none cursor-pointer disabled:opacity-60"
                            loading={couponLoading}
                          />
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="flex justify-between items-center py-3 px-4 border border-[var(--si-burnt-orange)]/30 bg-[var(--si-cream)]">
                      <div>
                        <span className="nn-label text-[var(--si-muted)] text-[0.5rem]">
                          Applied
                        </span>
                        <p className="text-sm font-light tracking-wide text-[var(--si-deep-brown)] mt-0.5">
                          {couponCode}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        aria-label="Remove coupon"
                        className="text-[var(--si-deep-brown)] hover:text-[var(--si-deep-brown)] transition-colors cursor-pointer"
                      >
                        <IoCloseCircleSharp size={22} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Shipping & payment — after summary on mobile, left column on lg+ */}
            <div className="order-2 lg:order-1 lg:w-[65%] w-full min-w-0 nn-animate-fade-up-delay-2">
              <div className="border border-[var(--si-mist)] bg-[var(--si-cream)]/60 p-8 sm:p-10 lg:p-12">
                <div className="nn-hairline-gold w-12 mb-6" />
                <p className="nn-label text-[var(--si-deep-brown)] mb-3">
                  Delivery
                </p>
                <h2 className="nn-display text-3xl font-light text-[var(--si-deep-brown)] mb-2">
                  Shipping{" "}
                  <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                    Address
                  </span>
                </h2>
                <p className="text-sm font-light text-[var(--si-muted)] mb-10 leading-relaxed max-w-md">
                  Enter your delivery details below. Each order is prepared by
                  hand and dispatched with care.
                </p>

                <Form {...orderForm}>
                  <form
                    className="grid sm:grid-cols-2 gap-x-6 gap-y-6"
                    onSubmit={orderForm.handleSubmit(placeOrder)}
                  >
                    <FormField
                      control={orderForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Full name*"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email*"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Phone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Phone*"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Country</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Country*"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>State</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="State*"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="City*"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Pincode</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Pincode*"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Landmark</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Landmark*"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="ordernote"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className={labelClass}>
                            Order Note
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Special instructions for delivery (optional)"
                              rows={4}
                              className={`${inputClass} min-h-[110px] resize-none py-3 leading-[1.8]`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />

                    <div className="sm:col-span-2 pt-4 mt-2 border-t border-[var(--si-mist)]">
                      <p className="nn-label text-[var(--si-deep-brown)] mb-4">
                        Payment
                      </p>
                      <div className="mb-6 flex items-center gap-2.5 border-l-2 border-[var(--si-burnt-orange)] bg-[var(--si-burnt-orange)]/5 px-3 py-2.5 text-sm text-[var(--si-muted)]">
                        <IoMailOutline
                          className="shrink-0 text-[var(--si-deep-brown)]"
                          size={17}
                          aria-hidden="true"
                        />
                        <p className="font-light leading-relaxed">
                          <span className="font-medium text-[var(--si-deep-brown)]">
                            Note:
                          </span>{" "}
                          Bank transfer details will be sent to your email after
                          your order is placed.
                        </p>
                      </div>

                      <ButtonLoading
                        type="submit"
                        text="Place Order"
                        loading={placingOrder}
                        className="w-full sm:w-auto nn-btn-primary h-auto rounded-none cursor-pointer disabled:opacity-60"
                      />
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Checkout;
