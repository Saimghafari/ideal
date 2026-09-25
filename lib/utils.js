import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export {
  sizes,
  WALL_DECOR_SIZES,
  getWallSizeMeta,
  formatWallSize,
} from "./wallDecorSizes";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sortings = [
  { label: "Default Sorting", value: "default_sorting" },
  { label: "Ascending Order", value: "asc" },
  { label: "Descending Order", value: "desc" },
  { label: "Price: Low To High", value: "price_low_high" },
  { label: "Price: High To Low", value: "price_high_low" },
];

export const orderStatus = [
  "unpaid",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  // legacy values kept so existing orders still validate
  "pending",
  "unverified",
];

/** Admin select options — primary payment → fulfillment flow */
export const orderStatusOptions = [
  { label: "Unpaid", value: "unpaid" },
  { label: "Paid", value: "paid" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

/**
 * @deprecated Import getPaymentDetails from @/lib/paymentDetails
 * Kept for any legacy imports.
 */
export { getPaymentDetails, PAYMENT_DETAILS } from "@/lib/paymentDetails";

