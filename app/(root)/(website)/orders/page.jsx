"use client";

import Loading from "@/components/Application/Loading";
import UserPanelLayout from "@/components/Application/Website/UserPanelLayout";
import useFetch from "@/hooks/useFetch";
import { formatMoney } from "@/lib/formatCurrency";
import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_ORDER_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Link from "next/link";
import React from "react";
import OrderStatusTag from "@/components/Application/Website/OrderStatusTag";
import { HiOutlineEye } from "react-icons/hi2";

const formatOrderDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Orders = () => {
  const { data: orderData, loading } = useFetch("/api/user-order");
  const orders = orderData?.data || [];

  return (
    <UserPanelLayout>
      <div className="min-w-0 font-ui text-[#3a2416]">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[#8a6754]"
        >
          <Link href={WEBSITE_HOME} className="hover:text-[#E45700]">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <Link href={USER_DASHBOARD} className="hover:text-[#E45700]">
            Account
          </Link>
          <span aria-hidden="true">›</span>
          <span className="font-medium text-[#3a2416]">Orders</span>
        </nav>

        <header className="max-w-xl">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#E45700] sm:text-[12.5px]">
            Super Ideal
          </p>
          <h1 className="font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#3a2416] min-[400px]:text-[2.15rem] sm:text-[2.55rem]">
            All orders
          </h1>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[#6b5142] sm:text-[15.5px]">
            Every sweets, bakery, and gift box order you have placed.
          </p>
        </header>

        <div className="mt-6 sm:mt-8">
          {loading ? (
            <div className="rounded-[22px] border border-[#f1e3d4] bg-white px-5 py-12 text-center shadow-[0_8px_22px_rgba(75,46,30,0.05)]">
              <Loading variant="inline" label="Loading orders" />
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-[24px] border border-[#f1e3d4] bg-white px-5 py-10 text-center shadow-[0_8px_22px_rgba(75,46,30,0.05)] sm:px-8 sm:py-14">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#E45700]">
                No orders yet
              </p>
              <h2 className="mx-auto mt-3 max-w-sm font-display text-[1.55rem] font-semibold leading-tight tracking-[-0.03em] text-[#3a2416] sm:text-[1.85rem]">
                Your first order will sit here
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-[#6b5142] sm:text-[15px]">
                Browse mithai, bakery, biscuits, and gift boxes. Once you place
                an order, it appears on this page.
              </p>
              <Link
                href={WEBSITE_SHOP}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#E45700] px-7 text-[14.5px] font-bold text-white shadow-[0_8px_16px_rgba(228,87,0,0.28)] transition-colors hover:bg-[#cf4c00]"
              >
                Shop sweets & bakery
              </Link>
            </div>
          ) : (
            <>
              <ul className="space-y-3 lg:hidden">
                {orders.map((order) => {
                  const placed = formatOrderDate(order.createdAt);
                  const pieces = order.products?.length || 0;
                  return (
                    <li key={order._id}>
                      <article className="rounded-[20px] border border-[#f1e3d4] bg-white p-4 shadow-[0_6px_18px_rgba(75,46,30,0.05)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#8a6754]">
                              Order
                            </p>
                            <Link
                              href={WEBSITE_ORDER_DETAILS(order.order_id)}
                              className="mt-1 block break-all font-display text-[1.05rem] font-semibold tracking-[-0.02em] text-[#3a2416] hover:text-[#E45700]"
                            >
                              {order.order_id}
                            </Link>
                            {placed ? (
                              <p className="mt-1 text-[12.5px] text-[#8a6754]">
                                {placed}
                              </p>
                            ) : null}
                          </div>
                          <OrderStatusTag status={order.status} />
                        </div>
                        <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#f6efe8] pt-3">
                          <div>
                            <p className="text-[12px] text-[#8a6754]">
                              {pieces} {pieces === 1 ? "item" : "items"}
                            </p>
                            <p className="mt-0.5 text-[15px] font-extrabold text-[#E45700]">
                              {formatMoney(
                                order.totalAmount,
                                order.currency || "PKR"
                              )}
                            </p>
                          </div>
                          <Link
                            href={WEBSITE_ORDER_DETAILS(order.order_id)}
                            className="inline-flex h-10 items-center justify-center rounded-full border border-[#f1e3d4] px-4 text-[13px] font-bold text-[#3a2416] transition-colors hover:border-[#E45700] hover:text-[#E45700]"
                          >
                            View
                          </Link>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>

              <div className="hidden overflow-hidden rounded-[22px] border border-[#f1e3d4] bg-white shadow-[0_8px_22px_rgba(75,46,30,0.05)] lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#f1e3d4] bg-[#FFF8F2]">
                      <th className="px-5 py-3.5 text-start text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#8a6754]">
                        Order
                      </th>
                      <th className="px-4 py-3.5 text-start text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#8a6754]">
                        Placed
                      </th>
                      <th className="px-4 py-3.5 text-start text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#8a6754]">
                        Items
                      </th>
                      <th className="px-4 py-3.5 text-start text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#8a6754]">
                        Status
                      </th>
                      <th className="px-4 py-3.5 text-end text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#8a6754]">
                        Amount
                      </th>
                      <th className="px-5 py-3.5 text-end text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#8a6754]">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-[#f6efe8] last:border-0"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={WEBSITE_ORDER_DETAILS(order.order_id)}
                            className="text-[14px] font-semibold tracking-wide text-[#3a2416] underline-offset-4 hover:text-[#E45700] hover:underline"
                          >
                            {order.order_id}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-[13.5px] text-[#6b5142]">
                          {formatOrderDate(order.createdAt) || "—"}
                        </td>
                        <td className="px-4 py-4 text-[13.5px] text-[#6b5142]">
                          {order.products?.length || 0}
                        </td>
                        <td className="px-4 py-4">
                          <OrderStatusTag status={order.status} />
                        </td>
                        <td className="px-4 py-4 text-end text-[14px] font-bold text-[#3a2416]">
                          {formatMoney(
                            order.totalAmount,
                            order.currency || "PKR"
                          )}
                        </td>
                        <td className="px-5 py-4 text-end">
                          <Link
                            href={WEBSITE_ORDER_DETAILS(order.order_id)}
                            aria-label={`View order ${order.order_id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f1e3d4] text-[#8a6754] transition-colors hover:border-[#E45700] hover:text-[#E45700]"
                          >
                            <HiOutlineEye size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default Orders;
