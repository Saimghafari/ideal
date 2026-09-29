"use client";

import UserPanelLayout from "@/components/Application/Website/UserPanelLayout";
import OrderStatusTag from "@/components/Application/Website/OrderStatusTag";
import useFetch from "@/hooks/useFetch";
import { formatMoney } from "@/lib/formatCurrency";
import {
  USER_ORDERS,
  WEBSITE_CART,
  WEBSITE_HOME,
  WEBSITE_ORDER_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Link from "next/link";
import React from "react";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineEye,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { useSelector } from "react-redux";

const firstName = (name) => {
  const part = String(name || "").trim().split(/\s+/)[0];
  return part || "";
};

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

const StatCard = ({ href, label, value, note, action, icon }) => (
  <Link
    href={href}
    className="group flex min-h-[9.5rem] flex-col rounded-[22px] border border-[#f1e3d4] bg-white p-4 shadow-[0_8px_22px_rgba(75,46,30,0.05)] transition-shadow hover:shadow-[0_14px_30px_rgba(75,46,30,0.08)] sm:min-h-[10.5rem] sm:p-5"
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#8a6754] sm:text-[12px]">
        {label}
      </p>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff4ec] text-[#E45700]">
        {icon}
      </span>
    </div>
    <p className="mt-4 font-display text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-[#3a2416] sm:text-[2.75rem]">
      {value}
    </p>
    <p className="mt-2 text-[13px] leading-relaxed text-[#8a6754] sm:text-[13.5px]">
      {note}
    </p>
    <p className="mt-auto pt-4 text-[13px] font-bold text-[#E45700] group-hover:text-[#cf4c00]">
      {action}
    </p>
  </Link>
);

const MyAccount = () => {
  const { data: dashboardData, loading } = useFetch("/api/dashboard/user");
  const cartStore = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore?.auth);

  const totalOrders = dashboardData?.data?.totalOrder || 0;
  const recentOrders = dashboardData?.data?.recentOrders || [];
  const cartCount = cartStore?.count || 0;
  const greeting = firstName(auth?.name);
  const orderCountLabel = loading ? "—" : totalOrders;

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
          <span className="font-medium text-[#3a2416]">Account</span>
        </nav>

        <header className="max-w-xl">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#E45700] sm:text-[12.5px]">
            Super Ideal
          </p>
          <h1 className="font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#3a2416] min-[400px]:text-[2.15rem] sm:text-[2.55rem] lg:text-[2.85rem]">
            {greeting ? `Hello, ${greeting}` : "Your account"}
          </h1>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[#6b5142] sm:text-[15.5px]">
            Your sweets, bakery orders, and the treats waiting in your bag.
          </p>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 sm:mt-8 sm:gap-4">
          <StatCard
            href={USER_ORDERS}
            label="Orders"
            value={orderCountLabel}
            note="Sweets, bakery, and gift boxes you have ordered"
            action="View all orders"
            icon={
              <HiOutlineClipboardDocumentList size={18} aria-hidden="true" />
            }
          />
          <StatCard
            href={WEBSITE_CART}
            label="In your bag"
            value={cartCount}
            note={
              cartCount === 1
                ? "One item ready for checkout"
                : "Items ready for checkout"
            }
            action="Open your bag"
            icon={<HiOutlineShoppingBag size={18} aria-hidden="true" />}
          />
        </div>

        <section className="mt-8 sm:mt-10">
          <div className="mb-4 flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between sm:mb-5">
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#E45700] sm:text-[12px]">
                Recent
              </p>
              <h2 className="mt-1 font-display text-[1.45rem] font-semibold tracking-[-0.02em] text-[#3a2416] sm:text-[1.7rem]">
                Latest orders
              </h2>
            </div>
            {recentOrders.length > 0 && (
              <Link
                href={USER_ORDERS}
                className="text-[13px] font-bold text-[#E45700] hover:text-[#cf4c00]"
              >
                See every order
              </Link>
            )}
          </div>

          {loading && recentOrders.length === 0 ? (
            <div className="rounded-[22px] border border-[#f1e3d4] bg-white px-5 py-12 text-center shadow-[0_8px_22px_rgba(75,46,30,0.05)]">
              <p className="text-[14px] text-[#8a6754]">Opening your orders…</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="rounded-[24px] border border-[#f1e3d4] bg-white px-5 py-10 text-center shadow-[0_8px_22px_rgba(75,46,30,0.05)] sm:px-8 sm:py-14">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#E45700]">
                Nothing here yet
              </p>
              <h3 className="mx-auto mt-3 max-w-sm font-display text-[1.55rem] font-semibold leading-tight tracking-[-0.03em] text-[#3a2416] sm:text-[1.85rem]">
                Your first order will sit here
              </h3>
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
                {recentOrders.map((order) => {
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
                    {recentOrders.map((order) => (
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
        </section>
      </div>
    </UserPanelLayout>
  );
};

export default MyAccount;
