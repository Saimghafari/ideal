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
  WEBSITE_CART,
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
import { IoCloseCircleSharp, IoTimeOutline } from "react-icons/io5";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";

import Loading from "@/components/Application/Loading";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";
import { STATIC_PRODUCTS } from "@/lib/staticCatalog";

const catalogById = Object.fromEntries(
  STATIC_PRODUCTS.map((product) => [product._id, product])
);

const inputClass =
  "h-12 rounded-2xl border-[#f1e3d4] bg-[#FFF8F2] px-4 text-[14.5px] font-medium text-[#3a2416] shadow-none placeholder:text-[#b7a498] focus-visible:border-[#E45700] focus-visible:ring-0";

const labelClass =
  "text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a6754]";

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

  const { data: branchResponse } = useFetch("/api/branch/public");
  const branchList = branchResponse?.success ? branchResponse.data || [] : [];
  const branchOptions = branchList.map((branch) => ({
    label: branch.short || branch.name,
    value: branch._id,
  }));
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
      phone: true,
      country: true,
      city: true,
      ordernote: true,
    })
    .extend({
      userId: z.string().optional(),
      landmark: z.string().optional(),
      branchId: z.string().optional(),
      serviceType: z.enum(["delivery", "pickup"]).optional(),
    });

  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      country: "Pakistan",
      city: "Faisalabad",
      landmark: "",
      ordernote: "",
      userId: authStore?.auth?._id,
      branchId: "",
      serviceType: "delivery",
    },
  });

  useEffect(() => {
    if (authStore) {
      orderForm.setValue("userId", authStore?.auth?._id);
    }
  }, [authStore]);

  const serviceType = orderForm.watch("serviceType");
  const needsPickup = (verifiedCartData || []).some((item) => item?.deliverable === false);

  useEffect(() => {
    if (needsPickup) orderForm.setValue("serviceType", "pickup");
  }, [needsPickup]);

  const placeOrder = async (formData) => {
    if (branchOptions.length && !formData.branchId) {
      showToast("error", "Choose a branch.");
      return;
    }
    if (needsPickup && formData.serviceType === "delivery") {
      showToast("error", "Some items are in-store only. Choose pickup.");
      return;
    }

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
          serviceType: needsPickup ? "pickup" : formData.serviceType || "delivery",
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
        showToast("success", "Order received. You can follow it on the next screen.");
        dispatch(clearCart());
        orderForm.reset();
        router.push(WEBSITE_ORDER_SUCCESS(paymentResponseData.data.order_id));
      } else {
        showToast("error", paymentResponseData.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setPlacingOrder(false);
      setSavingOrder(false);
    }
  };

  const itemCount = (verifiedCartData || []).reduce(
    (sum, product) => sum + (product?.qty || 0),
    0
  );

  return (
    <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
      {savingOrder && (
        <Loading variant="overlay" label="Confirming order" />
      )}

      <section className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 lg:py-10 xl:px-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[#8a6754]"
        >
          <Link href={WEBSITE_HOME} className="hover:text-[#E45700]">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <Link href={WEBSITE_CART} className="hover:text-[#E45700]">
            Cart
          </Link>
          <span aria-hidden="true">›</span>
          <span className="font-medium text-[#3a2416]">Checkout</span>
        </nav>

        <header className="mb-6 sm:mb-8">
          <p className="mb-1 text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#E45700]">
            Super Ideal
          </p>
          <h1 className="font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.85rem]">
            Checkout
          </h1>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[#8a6754] sm:text-[15px]">
            {cart.count > 0
              ? `${itemCount || cart.count} ${
                  (itemCount || cart.count) === 1 ? "item" : "items"
                } of sweets, bakery, and gift boxes ready for delivery.`
              : "Add sweets, bakery, biscuits, or a gift box to place an order."}
          </p>
        </header>

        <ol className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-3">
          {[
            { label: "Cart", state: "done" },
            { label: "Delivery", state: "current" },
            { label: "Confirmation", state: "upcoming" },
          ].map((step, index) => (
            <li
              key={step.label}
              className={`min-w-0 rounded-2xl border px-2 py-2.5 sm:px-4 sm:py-3 ${
                step.state === "current"
                  ? "border-[#E45700] bg-white shadow-[0_6px_18px_rgba(228,87,0,0.08)]"
                  : "border-[#f1e3d4] bg-white/70"
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.14em] ${
                  step.state === "upcoming" ? "text-[#b7a498]" : "text-[#E45700]"
                }`}
              >
                Step {index + 1}
              </p>
              <p
                className={`mt-0.5 truncate text-[12px] font-bold sm:text-[14.5px] ${
                  step.state === "upcoming" ? "text-[#9a8170]" : "text-[#3a2416]"
                }`}
              >
                {step.label}
              </p>
            </li>
          ))}
        </ol>

        {cart.count === 0 ? (
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
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
              <p className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#E45700]">
                Nothing to check out
              </p>
              <h2 className="font-display text-[2.15rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3rem]">
                Your cart is empty
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#6b5142] sm:text-[16px]">
                Choose sweets, bakery, biscuits, or a gift box. Fresh trays and
                packed boxes are ready when you are.
              </p>
              <Link
                href={WEBSITE_SHOP}
                className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#E45700] px-7 text-[14.5px] font-bold text-white shadow-[0_8px_16px_rgba(228,87,0,0.28)] transition-colors hover:bg-[#cf4c00]"
              >
                Shop sweets & bakery
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="order-2 min-w-0 lg:order-1">
              <div className="rounded-[24px] border border-[#f1e3d4] bg-white p-4 shadow-[0_10px_28px_rgba(75,46,30,0.06)] sm:p-6 lg:p-8">
                <p className="text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#E45700]">
                  Delivery
                </p>
                <h2 className="mt-1 font-display text-[1.55rem] font-semibold tracking-[-0.02em] text-[#3a2416] sm:text-[1.85rem]">
                  Where should we send it?
                </h2>
                <p className="mt-2 mb-6 max-w-lg text-[13.5px] leading-relaxed text-[#8a6754] sm:mb-8 sm:text-[14.5px]">
                  Enter the address for your sweets, bakery, and gift boxes.
                  Each order is packed fresh and dispatched with care.
                </p>

                <Form {...orderForm}>
                  <form
                    className="grid gap-x-4 gap-y-5 sm:grid-cols-2"
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
                          <FormMessage className="text-xs text-[#E45700]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="branchId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Branch</FormLabel>
                          <FormControl>
                            <select
                              className={inputClass}
                              value={field.value || ""}
                              onChange={(event) => field.onChange(event.target.value)}
                            >
                              <option value="">
                                {branchOptions.length ? "Choose a branch" : "Any branch"}
                              </option>
                              {branchOptions.map((branch) => (
                                <option key={branch.value} value={branch.value}>
                                  {branch.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage className="text-xs text-[#E45700]" />
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
                          <FormMessage className="text-xs text-[#E45700]" />
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
                          <FormMessage className="text-xs text-[#E45700]" />
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
                          <FormMessage className="text-xs text-[#E45700]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Landmark
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Landmark (optional)"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[#E45700]" />
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
                              placeholder="Gift message or delivery note (optional)"
                              rows={4}
                              className={`${inputClass} min-h-[120px] resize-none py-3 leading-relaxed`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[#E45700]" />
                        </FormItem>
                      )}
                    />

                    <div className="sm:col-span-2 mt-1 border-t border-[#f1e3d4] pt-5">
                      <p className="text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#E45700]">
                        How do you want it?
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={needsPickup}
                          onClick={() => orderForm.setValue("serviceType", "delivery")}
                          className={`h-11 rounded-2xl border text-[13.5px] font-bold ${
                            serviceType !== "pickup"
                              ? "border-[#E45700] bg-[#fff4ec] text-[#3a2416]"
                              : "border-[#f1e3d4] text-[#8a6754]"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => orderForm.setValue("serviceType", "pickup")}
                          className={`h-11 rounded-2xl border text-[13.5px] font-bold ${
                            serviceType === "pickup"
                              ? "border-[#E45700] bg-[#fff4ec] text-[#3a2416]"
                              : "border-[#f1e3d4] text-[#8a6754]"
                          }`}
                        >
                          Pickup
                        </button>
                      </div>
                      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#f1e3d4] bg-[#FFF8F2] px-4 py-3.5 text-[13.5px] leading-relaxed text-[#6b5142] sm:text-[14.5px]">
                        <IoTimeOutline
                          className="mt-0.5 shrink-0 text-[#E45700]"
                          size={18}
                          aria-hidden="true"
                        />
                        <p>
                          <span className="font-bold text-[#3a2416]">
                            {needsPickup ? "Counter only." : "Cash on delivery."}
                          </span>{" "}
                          {needsPickup
                            ? "One of these items stays in the shop, so this order is for pickup."
                            : "The kitchen starts as soon as the order is placed. Pay when it arrives, or at the counter."}
                        </p>
                      </div>

                      <ButtonLoading
                        type="submit"
                        text="Place order"
                        loading={placingOrder}
                        className="mt-5 h-12 w-full rounded-full bg-[#E45700] px-6 text-[14.5px] font-bold text-white shadow-[0_8px_16px_rgba(228,87,0,0.28)] hover:bg-[#cf4c00]"
                      />
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            <aside className="order-1 lg:sticky lg:top-[calc(76px+env(safe-area-inset-top,0px)+1.25rem)] lg:order-2">
              <div className="rounded-[24px] border border-[#f1e3d4] bg-white p-4 shadow-[0_10px_28px_rgba(75,46,30,0.06)] sm:p-6">
                <h2 className="font-display text-[1.45rem] font-semibold tracking-[-0.02em] text-[#3a2416]">
                  Order summary
                </h2>
                <p className="mt-1 mb-5 text-[13px] leading-relaxed text-[#8a6754]">
                  Packed sweets, bakery, and gift boxes for your order.
                </p>

                <ul className="mb-5 space-y-3">
                  {verifiedCartData &&
                    verifiedCartData.filter(Boolean).map((product) => {
                      const live = catalogById[product.productId];
                      const categoryName = product.categoryName || live?.category?.name || "";
                      const lineTotal =
                        (product.sellingPrice || 0) * (product.qty || 0);

                      return (
                        <li
                          key={product.variantId || product.productId}
                          className="flex gap-3 rounded-2xl border border-[#f1e3d4] bg-[#FFF8F2] p-2.5"
                        >
                          <Link
                            href={WEBSITE_PRODUCT_DETAILS(product.url)}
                            className="relative aspect-square w-[4.25rem] shrink-0 overflow-hidden rounded-xl bg-[#f7efe6] sm:w-[4.75rem]"
                          >
                            <Image
                              src={product.media || imgPlaceholder.src}
                              fill
                              sizes="76px"
                              alt={product.name || "Sweet or bakery item"}
                              className="object-cover"
                            />
                          </Link>
                          <div className="min-w-0 flex-1 py-0.5">
                            {categoryName ? (
                              <p className="text-[11px] font-semibold text-[#9a8170]">
                                {categoryName}
                              </p>
                            ) : null}
                            <h3 className="line-clamp-2 font-display text-[1.02rem] font-semibold leading-snug tracking-[-0.02em] text-[#3a2416]">
                              <Link
                                href={WEBSITE_PRODUCT_DETAILS(product.url)}
                                className="hover:text-[#E45700]"
                              >
                                {product.name}
                              </Link>
                            </h3>
                            {product.size ? (
                              <p className="mt-0.5 text-[12px] text-[#8a6754]">
                                Pack {product.size}
                              </p>
                            ) : null}
                            <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[13px]">
                              <span className="font-extrabold text-[#E45700]">
                                {formatPrice(lineTotal)}
                              </span>
                              {product.qty > 1 ? (
                                <span className="text-[#9a8170]">
                                  {product.qty} × {formatPrice(product.sellingPrice)}
                                </span>
                              ) : null}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                </ul>

                <dl className="space-y-3.5 text-[14.5px]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#8a6754]">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </dt>
                    <dd className="font-semibold text-[#3a2416]">
                      {formatPrice(subtotal)}
                    </dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#8a6754]">You save</dt>
                      <dd className="font-semibold text-[#E45700]">
                        −{formatPrice(discount)}
                      </dd>
                    </div>
                  )}
                  {couponDiscountAmount > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#8a6754]">Coupon</dt>
                      <dd className="font-semibold text-[#E45700]">
                        −{formatPrice(couponDiscountAmount)}
                      </dd>
                    </div>
                  )}
                  <div className="border-t border-[#f1e3d4] pt-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#8a6754]">
                        Total
                      </dt>
                      <dd className="font-display text-[1.85rem] font-semibold leading-none tracking-[-0.03em] text-[#3a2416] sm:text-[2.1rem]">
                        {formatPrice(totalAmount)}
                      </dd>
                    </div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#9a8170]">
                      Pakistani rupees. Shipping is confirmed after you place
                      the order.
                    </p>
                  </div>
                </dl>

                <div className="mt-5 border-t border-[#f1e3d4] pt-5">
                  {!isCouponApplied ? (
                    <Form {...couponForm}>
                      <form
                        className="space-y-2.5"
                        onSubmit={couponForm.handleSubmit(applyCoupon)}
                      >
                        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a6754]">
                          Promotional code
                        </p>
                        <div className="flex flex-col gap-2 min-[420px]:flex-row">
                          <div className="min-w-0 flex-1">
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
                                  <FormMessage className="text-xs text-[#E45700]" />
                                </FormItem>
                              )}
                            />
                          </div>
                          <ButtonLoading
                            type="submit"
                            text="Apply"
                            className="h-12 shrink-0 rounded-full border-2 border-[#E45700] bg-white px-6 text-[14.5px] font-bold text-[#E45700] hover:bg-[#fff4ec]"
                            loading={couponLoading}
                          />
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E45700]/30 bg-[#fff4ec] px-4 py-3">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#E45700]">
                          Applied
                        </span>
                        <p className="truncate text-[14.5px] font-semibold text-[#3a2416]">
                          {couponCode}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        aria-label="Remove coupon"
                        className="cursor-pointer text-[#E45700] transition-colors hover:text-[#cf4c00]"
                      >
                        <IoCloseCircleSharp size={22} />
                      </button>
                    </div>
                  )}
                </div>

                <ul className="mt-5 space-y-2 border-t border-[#f1e3d4] pt-4 text-[12.5px] text-[#8a6754]">
                  <li>Freshly packed for delivery</li>
                  <li>Premium ingredients, made with care</li>
                  <li>Trusted bakery since 1969</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
};

export default Checkout;
