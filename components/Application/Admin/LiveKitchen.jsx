"use client";

import { showToast } from "@/lib/showToast";
import { ADMIN_ORDER_DETAILS } from "@/routes/AdminPanelRoute";
import axios from "axios";
import Link from "next/link";
import { useRef, useState } from "react";
import useVisiblePoll from "@/hooks/useVisiblePoll";

const STAGE_LABEL = {
  received: "Received",
  preparing: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function ageLabel(createdAt) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
  if (mins < 1) return "Just now";
  if (mins === 1) return "1 min ago";
  return `${mins} min ago`;
}

const LiveKitchen = () => {
  const [orders, setOrders] = useState([]);
  const [busyId, setBusyId] = useState("");
  const seen = useRef(null);

  const load = async () => {
    try {
      const { data } = await axios.get("/api/orders/live");
      if (!data.success) return;
      const next = data.data || [];
      if (seen.current) {
        const fresh = next.filter(
          (order) => !seen.current.has(order._id) && order.fulfillmentStage === "received"
        );
        if (fresh.length === 1) showToast("success", `New order ${fresh[0].order_id}`);
        if (fresh.length > 1) showToast("success", `${fresh.length} new orders received`);
      }
      seen.current = new Set(next.map((order) => order._id));
      setOrders(next);
    } catch {
      // keep the last board if a poll fails
    }
  };

  useVisiblePoll(load, 4000);

  const updateStage = async (order, fulfillmentStage, prepMinutes) => {
    setBusyId(order._id + fulfillmentStage + (prepMinutes || ""));
    try {
      const { data } = await axios.put("/api/orders/update-status", {
        _id: order._id,
        fulfillmentStage,
        prepMinutes,
      });
      if (!data.success) throw new Error(data.message);
      await load();
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setBusyId("");
    }
  };

  const active = orders.filter((order) => !["delivered", "cancelled"].includes(order.fulfillmentStage));

  return (
    <section className="mb-6 rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <h3 className="font-semibold">Live orders</h3>
        </div>
        <p className="text-sm text-muted-foreground">{active.length} open today</p>
      </div>
      {orders.length === 0 ? (
        <p className="px-4 py-8 text-sm text-muted-foreground">No orders yet today. New orders appear here as soon as they are placed.</p>
      ) : (
        <ul className="divide-y">
          {orders.map((order) => {
            const handoff = order.serviceType === "pickup" ? "Ready for pickup" : "Out for delivery";
            const done = order.serviceType === "pickup" ? "Collected" : "Delivered";
            return (
              <li key={order._id} className="grid gap-3 px-4 py-4 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={ADMIN_ORDER_DETAILS(order.order_id)} className="font-semibold hover:underline">
                      {order.order_id}
                    </Link>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                      {STAGE_LABEL[order.fulfillmentStage] || order.fulfillmentStage}
                    </span>
                    <span className="text-xs text-muted-foreground">{ageLabel(order.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm">
                    {order.name} · {order.phone}
                    {order.branchName ? ` · ${order.branchName}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(order.products || []).map((item) => `${item.qty}× ${item.name}`).join(", ")}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.serviceType === "pickup" ? "Pickup" : "Delivery"}
                  {order.landmark ? ` · ${order.landmark}` : ""}
                  {order.city ? `, ${order.city}` : ""}
                  {order.fulfillmentStage === "preparing" || order.fulfillmentStage === "received"
                    ? ` · ${order.prepMinutes || 20} min`
                    : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-md border px-2.5 py-1.5 text-xs font-medium" disabled={Boolean(busyId)} onClick={() => updateStage(order, "preparing", 10)}>
                    Prep 10 min
                  </button>
                  <button type="button" className="rounded-md border px-2.5 py-1.5 text-xs font-medium" disabled={Boolean(busyId)} onClick={() => updateStage(order, "preparing", 20)}>
                    Prep 20 min
                  </button>
                  <button type="button" className="rounded-md border px-2.5 py-1.5 text-xs font-medium" disabled={Boolean(busyId)} onClick={() => updateStage(order, "on_the_way")}>
                    {handoff}
                  </button>
                  <button type="button" className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground" disabled={Boolean(busyId)} onClick={() => updateStage(order, "delivered")}>
                    {done}
                  </button>
                  <button type="button" className="rounded-md px-2.5 py-1.5 text-xs text-red-600" disabled={Boolean(busyId)} onClick={() => updateStage(order, "cancelled")}>
                    Cancel
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default LiveKitchen;
