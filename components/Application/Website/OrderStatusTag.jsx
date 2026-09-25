import React from "react";

/** Light fill + matching border/text — square tags (no radius) */
const STATUS_STYLES = {
  unpaid: {
    background: "#FEF3C7",
    color: "#92400E",
    border: "#FCD34D",
  },
  paid: {
    background: "#DCFCE7",
    color: "#166534",
    border: "#86EFAC",
  },
  pending: {
    background: "#E0F2FE",
    color: "#075985",
    border: "#7DD3FC",
  },
  processing: {
    background: "#FEF9C3",
    color: "#854D0E",
    border: "#FDE047",
  },
  shipped: {
    background: "#CFFAFE",
    color: "#155E75",
    border: "#67E8F9",
  },
  delivered: {
    background: "#DCFCE7",
    color: "#166534",
    border: "#86EFAC",
  },
  cancelled: {
    background: "#FEE2E2",
    color: "#991B1B",
    border: "#FCA5A5",
  },
  unverified: {
    background: "#FFEDD5",
    color: "#9A3412",
    border: "#FDBA74",
  },
};

/**
 * Square colored status tag for customer order UI.
 * @param {string} status
 * @param {"sm"|"md"} [size="sm"]
 */
export default function OrderStatusTag({ status, size = "sm" }) {
  const key = String(status || "unpaid").toLowerCase();
  const palette = STATUS_STYLES[key] || {
    background: "#F2EDE3",
    color: "#1C1610",
    border: "#BDB3A6",
  };
  const label = key.replace(/^\w/, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center border capitalize font-medium tracking-wide ${
        size === "md"
          ? "px-3 py-1 text-[0.7rem]"
          : "px-2.5 py-0.5 text-[0.62rem]"
      }`}
      style={{
        backgroundColor: palette.background,
        color: palette.color,
        borderColor: palette.border,
        borderRadius: 0,
      }}
    >
      {label}
    </span>
  );
}
