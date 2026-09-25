import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";
import Image from "next/image";
import placeholderImg from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import {
  USER_ORDERS,
  WEBSITE_PRODUCT_DETAILS,
} from "@/routes/WebsiteRoute";
import { formatWallSize } from "@/lib/wallDecorSizes";
import { formatMoney } from "@/lib/formatCurrency";
import { getOrderByOrderId } from "@/lib/getOrderByOrderId";
import OrderStatusTag from "@/components/Application/Website/OrderStatusTag";
import { HiOutlineEye } from "react-icons/hi2";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const OrderDetails = async ({ params }) => {
  const { orderid } = await params;
  const orderResult = await getOrderByOrderId(orderid);
  const order = orderResult?.data;
  const breadcrumb = {
    title: "Order Details",
    eyebrow: "Velora",
    subtitle: order?.order_id
      ? `Reference ${order.order_id}`
      : "A record of this order.",
    links: [
      { label: "Orders", href: USER_ORDERS },
      { label: "Details" },
    ],
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
              <Link href={USER_ORDERS} className="nn-btn-outline !py-3 mt-4 inline-block">
                Back to Orders
              </Link>
            </div>
          ) : (
            <div className="nn-animate-fade-up-delay-2 max-w-5xl">
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
                  {order.products?.map((product) => (
                    <li
                      key={product.variantId?._id || product._id}
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
                              {product?.productId?.name}
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

                      <div className="flex items-center justify-between sm:justify-end gap-5 pl-[5rem] sm:pl-0">
                        <div className="flex sm:flex-col gap-4 sm:gap-1 sm:items-end sm:text-right text-sm font-light text-[var(--si-muted)]">
                          <span>{formatMoney(product.sellingPrice, order.currency || "PKR")}</span>
                          <span>× {product.qty}</span>
                          <span className="text-[var(--si-deep-brown)] tracking-wide">
                            {formatMoney(product.qty * product.sellingPrice, order.currency || "PKR")}
                          </span>
                        </div>
                        {product?.productId?.slug && (
                          <Link
                            href={WEBSITE_PRODUCT_DETAILS(
                              product.productId.slug
                            )}
                            aria-label={`View ${product?.productId?.name || "product"}`}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--si-mist)] text-[var(--si-deep-brown)]/45 transition-all duration-300 hover:border-[var(--si-burnt-orange)]/45 hover:text-[var(--si-deep-brown)]"
                          >
                            <HiOutlineEye size={18} />
                          </Link>
                        )}
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
                      ["Country", order.country],
                      ["State", order.state],
                      ["City", order.city],
                      ["Pincode", order.pincode],
                      ["Landmark", order.landmark],
                      ["Order note", order.ordernote || "—"],
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
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--si-muted)]">Discount</dt>
                      <dd className="text-[var(--si-deep-brown)]">
                        −{formatMoney(order.discount, order.currency || "PKR")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--si-muted)]">Coupon</dt>
                      <dd className="text-[var(--si-deep-brown)]">
                        −{formatMoney(order.couponDiscountAmount, order.currency || "PKR")}
                      </dd>
                    </div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
