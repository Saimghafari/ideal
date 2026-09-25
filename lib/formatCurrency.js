import { CURRENCY_PKR } from "@/lib/currency";

export function formatPKR(value, options = {}) {
  const amount = Number(value || 0);
  return `Rs ${amount.toLocaleString("en-PK", {
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
    ...options,
  })}`;
}

export function formatUSD(value, options = {}) {
  return formatPKR(value, options);
}

export function formatMoney(value, _currency = CURRENCY_PKR, options = {}) {
  return formatPKR(value, options);
}
