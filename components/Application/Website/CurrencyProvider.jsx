"use client";

import { createContext, useContext, useMemo } from "react";
import { CURRENCY_PKR, resolvePrices } from "@/lib/currency";
import { formatMoney } from "@/lib/formatCurrency";

const CurrencyContext = createContext({
  currency: CURRENCY_PKR,
  formatPrice: (value) => formatMoney(value, CURRENCY_PKR),
  resolvePrices: (item) => resolvePrices(item),
});

export function CurrencyProvider({ children }) {
  const value = useMemo(
    () => ({
      currency: CURRENCY_PKR,
      formatPrice: (amount, options) =>
        formatMoney(amount, CURRENCY_PKR, options),
      resolvePrices: (item) => resolvePrices(item),
    }),
    []
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
