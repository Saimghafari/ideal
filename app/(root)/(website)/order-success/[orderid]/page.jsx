import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";
import Image from "next/image";
import placeholderImg from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import {
  USER_ORDERS,
  WEBSITE_HOME,
  WEBSITE_ORDER_DETAILS,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import { formatWallSize } from "@/lib/wallDecorSizes";
import { formatMoney } from "@/lib/formatCurrency";
import { getOrderByOrderId } from "@/lib/getOrderByOrderId";
import OrderStatusTag from "@/components/Application/Website/OrderStatusTag";
import { IoMailOutline } from "react-icons/io5";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const OrderSuccess = async ({ params }) => {
  const { orderid } = await params;
  const orderResult = await getOrderByOrderId(orderid);
  const order = orderResult?.data;
  const breadcrumb = {
    title: "Thank You",
    eyebrow: "Velora",
    subtitle: order?.order_id
      ? `Reference ${order.order_id}`
      : "Your order confirmation.",
    links: [{ label: "Confirmation" }],
  };

  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />

      <div className="relative nn-cream-bg">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.35]"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 40% at 100% 0%, rgb(228 87 0 / 8%), transparent 55%)",
          }}
        />

        <div className="relative px-6 sm:px-10 lg:px-28 xl:px-36 pt-10 sm:pt-12 pb-20 sm:pb-28">
          {!orderResult?.success || !order ? (
            <div className="mx-auto max-w-lg border border-[var(--si-mist)] bg-[var(--si-cream)]/50 px-6 py-16 text-center">
              <div className="nn-hairline-gold w-10 mx-auto mb-8" />
              <p className="nn-label text-[var(--si-burnt-orange)] mb-4">Unavailable</p>
              <h2 className="nn-display text-3xl font-light text-[var(--si-deep-brown)] mb-4">
                Order not{" "}
                <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                  found
                </span>
              </h2>
              <Link href={WEBSITE_SHOP} className="nn-btn-outline !py-3 mt-4 inline-block">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="nn-animate-fade-up-delay-2 max-w-5xl">
              <div className="mb-14 text-center sm:text-left">
                <div className="nn-hairline-gold w-14 mb-8 mx-auto sm:mx-0" />
                <p className="nn-label text-[var(--si-deep-brown)] mb-4">
                  Order confirmed
                </p>
                <h1 className="nn-display text-4xl sm:text-5xl font-light text-[var(--si-deep-brown)] leading-[1.05]">
                  Thank you
                  <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                    {" "}
                    for your order
                  </span>
                </h1>

                <div className="mt-6 mx-auto sm:mx-0 flex max-w-lg items-center gap-2.5 border-l-2 border-[var(--si-burnt-orange)] bg-[var(--si-burnt-orange)]/5 px-3 py-2.5 text-left text-sm text-[var(--si-muted)]">
                  <IoMailOutline
                    className="shrink-0 text-[var(--si-deep-brown)]"
                    size={17}
                    aria-hidden="true"
                  />
                  <p className="font-light leading-relaxed">
                    <span className="font-medium text-[var(--si-deep-brown)]">
                      Payment note:
                    </span>{" "}
                    Bank transfer details have been sent to your email.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4 justify-center sm:justify-start">
                  <Link
                    href={WEBSITE_ORDER_DETAILS(order.order_id)}
                    className="nn-btn-primary !py-3"
                  >
                    View order details
                  </Link>
                  <Link href={WEBSITE_SHOP} className="nn-btn-outline !py-3">
                    Continue shopping
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-4 mb-12 border-b border-[var(--si-mist)] pb-8">
                <div>
                  <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-2">
                    Order Id
                  </p>
                  <p className="text-sm font-light tracking-wide text-[var(--si-deep-brown)]">
                    {order.order_id}
                  </p>
                </div>
                <div>
                  <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-2">
                    Payment
                  </p>
                  <p className="text-sm font-light tracking-wide text-[var(--si-deep-brown)]">
                    {order.payment_method === "COD"
                      ? "Cash on Delivery"
                      : order.payment_method === "Invoice"
                        ? "Bank Transfer"
                        : order.payment_method || "Bank Transfer"}
                  </p>
                </div>
                <div>
                  <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-2">
                    Status
                  </p>
                  <OrderStatusTag status={order.status} size="md" />
                </div>
              </div>

              <div className="mb-14">
                <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-3">
                  Pieces
                </p>
                <h2 className="nn-display text-2xl font-light text-[var(--si-deep-brown)] mb-8">
                  Order{" "}
                  <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                    items
                  </span>
                </h2>

                <ul className="divide-y divide-[var(--si-mist)]">
                  {order.products?.map((product, index) => (
                    <li
                      key={
                        product.variantId?._id ||
                        product.productId?._id ||
                        product._id ||
                        index
                      }
                      className="py-6 flex flex-col sm:flex-row sm:items-center gap-5"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden bg-[var(--si-mist)] ring-1 ring-[var(--si-burnt-orange)]/20">
                          <Image
                            src={
                              product?.variantId?.media?.[0]?.secure_url ||
                              product?.productId?.media?.[0]?.secure_url ||
                              placeholderImg.src
                            }
                            fill
                            sizes="80px"
                            alt={product?.productId?.name || "Product"}
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <h3 className="nn-display text-lg sm:text-xl font-light text-[var(--si-deep-brown)] leading-snug">
                            <Link
                              href={WEBSITE_PRODUCT_DETAILS(
                                product?.productId?.slug
                              )}
                              className="hover:text-[var(--si-deep-brown)] transition-colors"
                            >
                              {product?.productId?.name || product?.name}
                            </Link>
                          </h3>
                          {(product?.size || product?.variantId?.size) && (
                            <p className="mt-1.5 nn-label text-[0.48rem] text-[var(--si-burnt-orange)]">
                              {product.size ||
                                formatWallSize(product.variantId.size)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-4 sm:gap-1 sm:items-end sm:text-right text-sm font-light text-[var(--si-muted)] pl-[5rem] sm:pl-0">
                        <span>{formatMoney(product.sellingPrice, order.currency || "PKR")}</span>
                        <span>× {product.qty}</span>
                        <span className="text-[var(--si-deep-brown)] tracking-wide">
                          {formatMoney(product.qty * product.sellingPrice, order.currency || "PKR")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                <div>
                  <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-3">
                    Delivery
                  </p>
                  <h3 className="nn-display text-xl font-light text-[var(--si-deep-brown)] mb-6">
                    Shipping{" "}
                    <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                      address
                    </span>
                  </h3>
                  <dl className="space-y-3 text-sm font-light">
                    {[
                      ["Name", order.name],
                      ["Email", order.email],
                      ["Phone", order.phone],
                      ["City", order.city],
                      ["Landmark", order.landmark],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex justify-between gap-6 border-b border-[var(--si-mist)]/70 pb-3"
                      >
                        <dt className="text-[var(--si-muted)] tracking-wide">
                          {label}
                        </dt>
                        <dd className="text-right text-[var(--si-deep-brown)]">
                          {value || "—"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-3">
                    Totals
                  </p>
                  <h3 className="nn-display text-xl font-light text-[var(--si-deep-brown)] mb-6">
                    Order{" "}
                    <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                      summary
                    </span>
                  </h3>
                  <dl className="space-y-3 text-sm font-light border border-[var(--si-mist)] bg-[var(--si-cream)]/40 px-5 py-6">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--si-muted)]">Subtotal</dt>
                      <dd className="text-[var(--si-deep-brown)]">
                        {formatMoney(order.subtotal, order.currency || "PKR")}
                      </dd>
                    </div>
                    {Number(order.discount) > 0 && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--si-muted)]">Discount</dt>
                        <dd className="text-[var(--si-deep-brown)]">
                          −{formatMoney(order.discount, order.currency || "PKR")}
                        </dd>
                      </div>
                    )}
                    {Number(order.couponDiscountAmount) > 0 && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--si-muted)]">Coupon</dt>
                        <dd className="text-[var(--si-deep-brown)]">
                          −{formatMoney(order.couponDiscountAmount, order.currency || "PKR")}
                        </dd>
                      </div>
                    )}
                    <div className="nn-hairline my-2" />
                    <div className="flex justify-between gap-4 items-baseline pt-1">
                      <dt className="nn-label text-[0.5rem] text-[var(--si-muted)]">
                        Total
                      </dt>
                      <dd className="nn-display text-2xl font-light text-[var(--si-deep-brown)]">
                        {formatMoney(order.totalAmount, order.currency || "PKR")}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-14 flex flex-wrap gap-4">
                <Link href={WEBSITE_HOME} className="nn-link-quiet">
                  Back to home
                </Link>
                <Link href={USER_ORDERS} className="nn-link-quiet">
                  My orders
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
