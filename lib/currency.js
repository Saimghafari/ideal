export const CURRENCY_COOKIE = "currency";
export const CURRENCY_USD = "USD";
export const CURRENCY_PKR = "PKR";

export function currencyFromCountry() {
  return CURRENCY_PKR;
}

export function resolveCurrencyFromRequest() {
  return CURRENCY_PKR;
}

export function calcDiscountPercentage(mrp, sellingPrice) {
  const m = Number(mrp || 0);
  const s = Number(sellingPrice || 0);
  if (m <= 0 || s <= 0 || s >= m) return 0;
  return Math.round(((m - s) / m) * 100);
}

/** Always PKR — sellingPrice is rupees. */
export function resolvePrices(item) {
  if (!item) {
    return {
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      currency: CURRENCY_PKR,
    };
  }

  const sellingPrice = Number(
    item.sellingPricePkr || item.sellingPrice || 0
  );
  const mrp = Number(item.mrpPkr || item.mrp || sellingPrice || 0);

  return {
    mrp,
    sellingPrice,
    discountPercentage: calcDiscountPercentage(mrp, sellingPrice),
    currency: CURRENCY_PKR,
  };
}
