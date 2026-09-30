export const FULFILLMENT_STAGES = ["received", "preparing", "on_the_way", "delivered", "cancelled"];

export const PREP_MINUTE_OPTIONS = [10, 20];

export function resolveFulfillmentStage(order) {
  if (order?.fulfillmentStage && FULFILLMENT_STAGES.includes(order.fulfillmentStage)) {
    return order.fulfillmentStage;
  }
  const fromStatus = {
    unpaid: "received",
    paid: "received",
    pending: "received",
    unverified: "received",
    processing: "preparing",
    shipped: "on_the_way",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  return fromStatus[order?.status] || "received";
}

export function statusFromStage(stage) {
  if (stage === "delivered") return "delivered";
  if (stage === "cancelled") return "cancelled";
  if (stage === "on_the_way") return "shipped";
  return "processing";
}

export function stageFromStatus(status) {
  return resolveFulfillmentStage({ status });
}

export function trackingSteps(serviceType = "delivery") {
  const handoff =
    serviceType === "pickup"
      ? { key: "on_the_way", label: "Ready for pickup" }
      : { key: "on_the_way", label: "Out for delivery" };
  const done =
    serviceType === "pickup"
      ? { key: "delivered", label: "Collected" }
      : { key: "delivered", label: "Delivered" };

  return [
    { key: "received", label: "Order received" },
    { key: "preparing", label: "Preparing" },
    handoff,
    done,
  ];
}

export function minutesRemaining(order, now = Date.now()) {
  const stage = resolveFulfillmentStage(order);
  if (stage !== "received" && stage !== "preparing") return null;
  const start = new Date(order?.stageUpdatedAt || order?.createdAt || now).getTime();
  const total = (Number(order?.prepMinutes) || 20) * 60 * 1000;
  return Math.max(1, Math.ceil((start + total - now) / 60000));
}

export function trackingHeadline(order) {
  const stage = resolveFulfillmentStage(order);
  const pickup = order?.serviceType === "pickup";
  const mins = Number(order?.prepMinutes) || 20;
  const left = minutesRemaining(order);

  if (stage === "cancelled") return "This order was cancelled";
  if (stage === "delivered") return pickup ? "Collected from the counter" : "Delivered";
  if (stage === "on_the_way") return pickup ? "Ready at the counter" : "On the way to you";
  if (left) return `About ${left} min`;
  return `About ${mins} min`;
}
