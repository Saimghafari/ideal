"use client";

import Loading from "@/components/Application/Loading";
import UserPanelLayout from "@/components/Application/Website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_ORDER_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import Link from "next/link";
import React from "react";
import { formatMoney } from "@/lib/formatCurrency";
import OrderStatusTag from "@/components/Application/Website/OrderStatusTag";
import { HiOutlineEye } from "react-icons/hi2";

const breadCrumbData = {
  title: "My Orders",
  eyebrow: "Velora",
  subtitle: "A record of every clothing order you have placed.",
  links: [{ label: "Orders" }],
};

const Orders = () => {
  const { data: orderData, loading } = useFetch("/api/user-order");
  const orders = orderData?.data || [];

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div>
          <div className="mb-10 sm:mb-12">
            <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-3">
              History
            </p>
            <h2 className="nn-display text-2xl sm:text-3xl font-light text-[var(--si-deep-brown)] leading-tight">
              All{" "}
              <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                orders
              </span>
            </h2>
          </div>

          {loading ? (
            <Loading variant="inline" label="Loading orders" />
          ) : orders.length === 0 ? (
            <div className="border border-[var(--si-mist)] bg-[var(--si-cream)]/50 px-6 py-14 text-center max-w-lg">
              <div className="nn-hairline-gold w-10 mx-auto mb-8" />
              <p className="nn-label text-[var(--si-burnt-orange)] mb-4">
                No Orders Yet
              </p>
              <p className="text-sm font-light text-[var(--si-muted)] mb-8 max-w-xs mx-auto leading-relaxed">
                Discover signed works from the collection and begin your
                selection.
              </p>
              <Link href={WEBSITE_SHOP} className="nn-btn-outline !py-3">
                Explore the Collection
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem]">
                <thead>
                  <tr className="border-b border-[var(--si-mist)]">
                    <th className="nn-label text-[0.48rem] text-[var(--si-muted)] text-start font-normal pb-4 pr-4">
                      No.
                    </th>
                    <th className="nn-label text-[0.48rem] text-[var(--si-muted)] text-start font-normal pb-4 pr-4">
                      Order
                    </th>
                    <th className="nn-label text-[0.48rem] text-[var(--si-muted)] text-start font-normal pb-4 pr-4">
                      Pieces
                    </th>
                    <th className="nn-label text-[0.48rem] text-[var(--si-muted)] text-start font-normal pb-4 pr-4">
                      Status
                    </th>
                    <th className="nn-label text-[0.48rem] text-[var(--si-muted)] text-end font-normal pb-4 pr-4">
                      Amount
                    </th>
                    <th className="nn-label text-[0.48rem] text-[var(--si-muted)] text-end font-normal pb-4">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr
                      key={order._id}
                      className="border-b border-[var(--si-mist)]/80 last:border-0"
                    >
                      <td className="py-5 pr-4 text-sm font-light text-[var(--si-fog)]">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="py-5 pr-4">
                        <Link
                          href={WEBSITE_ORDER_DETAILS(order.order_id)}
                          className="text-sm font-light tracking-wide text-[var(--si-deep-brown)] hover:text-[var(--si-deep-brown)] transition-colors underline-offset-4 hover:underline decoration-[var(--si-burnt-orange)]/50"
                        >
                          {order.order_id}
                        </Link>
                      </td>
                      <td className="py-5 pr-4 text-sm font-light text-[var(--si-muted)]">
                        {order.products?.length || 0}
                      </td>
                      <td className="py-5 pr-4">
                        <OrderStatusTag status={order.status} />
                      </td>
                      <td className="py-5 pr-4 text-end text-sm font-light tracking-wide text-[var(--si-deep-brown)]">
                        {formatMoney(order.totalAmount, order.currency || "PKR")}
                      </td>
                      <td className="py-5 text-end">
                        <Link
                          href={WEBSITE_ORDER_DETAILS(order.order_id)}
                          aria-label={`View order ${order.order_id}`}
                          className="inline-flex h-9 w-9 items-center justify-center border border-[var(--si-mist)] text-[var(--si-deep-brown)]/45 transition-all duration-300 hover:border-[var(--si-burnt-orange)]/45 hover:text-[var(--si-deep-brown)]"
                        >
                          <HiOutlineEye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default Orders;
