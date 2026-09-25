"use client";

import UserPanelLayout from "@/components/Application/Website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import {
  USER_ORDERS,
  WEBSITE_CART,
  WEBSITE_ORDER_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { formatMoney } from "@/lib/formatCurrency";
import OrderStatusTag from "@/components/Application/Website/OrderStatusTag";
import { HiOutlineEye } from "react-icons/hi2";

const breadCrumbData = {
  title: "My Account",
  eyebrow: "Velora",
  subtitle: "Your orders, profile, and bag in one place.",
  links: [{ label: "Account" }],
};

const MyAccount = () => {
  const { data: dashboardData } = useFetch("/api/dashboard/user");
  const cartStore = useSelector((store) => store.cartStore);

  const totalOrders = dashboardData?.data?.totalOrder || 0;
  const recentOrders = dashboardData?.data?.recentOrders || [];
  const cartCount = cartStore?.count || 0;

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div>
          <div className="mb-10 sm:mb-12">
            <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-3">
              Overview
            </p>
            <h2 className="nn-display text-2xl sm:text-3xl font-light text-[var(--si-deep-brown)] leading-tight">
              Your{" "}
              <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                dashboard
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 mb-14 sm:mb-16">
            <Link
              href={USER_ORDERS}
              className="group block border-t border-[var(--si-mist)] pt-6 transition-colors"
            >
              <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-4">
                Total Orders
              </p>
              <p className="nn-display text-4xl sm:text-5xl font-light text-[var(--si-deep-brown)] leading-none group-hover:text-[var(--si-deep-brown)] transition-colors duration-300">
                {totalOrders}
              </p>
              <p className="mt-3 text-sm font-light text-[var(--si-muted)]">
                Clothing orders from Velora
              </p>
            </Link>

            <Link
              href={WEBSITE_CART}
              className="group block border-t border-[var(--si-mist)] pt-6 transition-colors"
            >
              <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-4">
                Items In Cart
              </p>
              <p className="nn-display text-4xl sm:text-5xl font-light text-[var(--si-deep-brown)] leading-none group-hover:text-[var(--si-deep-brown)] transition-colors duration-300">
                {cartCount}
              </p>
              <p className="mt-3 text-sm font-light text-[var(--si-muted)]">
                Reserved for checkout
              </p>
            </Link>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-2">
                  History
                </p>
                <h3 className="nn-display text-xl sm:text-2xl font-light text-[var(--si-deep-brown)]">
                  Recent{" "}
                  <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                    orders
                  </span>
                </h3>
              </div>
              {recentOrders.length > 0 && (
                <Link href={USER_ORDERS} className="nn-link-quiet">
                  View all orders
                </Link>
              )}
            </div>

            {recentOrders.length === 0 ? (
              <div className="border border-[var(--si-mist)] bg-[var(--si-cream)]/50 px-6 py-14 text-center">
                <div className="nn-hairline-gold w-10 mx-auto mb-8" />
                <p className="nn-label text-[var(--si-burnt-orange)] mb-4">
                  No Orders Yet
                </p>
                <p className="text-sm font-light text-[var(--si-muted)] mb-8 max-w-xs mx-auto leading-relaxed">
                  When you place an order, it will appear here.
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
                    {recentOrders.map((order, i) => (
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
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default MyAccount;
