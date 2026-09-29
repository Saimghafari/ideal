/** Pack sizes used on the storefront and in admin variants. */
const RAW_SIZES = [
  { value: "250g", label: "250g", bestFor: "A small tin for tea time." },
  { value: "500g", label: "500g", bestFor: "The usual family pack." },
  { value: "1kg", label: "1 kg", bestFor: "A sharing box for guests." },
  { value: "2kg", label: "2 kg", bestFor: "A larger box for gatherings." },
  { value: "Tray", label: "Tray", bestFor: "Counter trays and catering platters." },
  { value: "Gift", label: "Gift", bestFor: "Wrapped gift boxes and hampers." },
];

export const WALL_DECOR_SIZES = RAW_SIZES.map((size) => ({
  ...size,
  metric: size.label,
  scale: 1,
}));

export const CLOTHING_SIZES = WALL_DECOR_SIZES;

export const sizes = WALL_DECOR_SIZES.map((size) => ({
  label: size.label,
  value: size.value,
}));

export function getWallSizeMeta(sizeValue) {
  if (!sizeValue) return null;
  return (
    WALL_DECOR_SIZES.find(
      (s) =>
        s.value === sizeValue ||
        s.label === sizeValue ||
        String(sizeValue).toUpperCase() === s.value.toUpperCase()
    ) || null
  );
}

export function formatWallSize(sizeValue) {
  const meta = getWallSizeMeta(sizeValue);
  return meta?.label || sizeValue || "";
}
