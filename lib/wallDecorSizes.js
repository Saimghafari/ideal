/** Clothing sizes used on the storefront and in admin variants. */
const RAW_SIZES = [
  { value: "XS", label: "XS", bestFor: "Extra small — fitted knits and shirts." },
  { value: "S", label: "S", bestFor: "Small — usual fit for slimmer frames." },
  { value: "M", label: "M", bestFor: "Medium — the standard everyday fit." },
  { value: "L", label: "L", bestFor: "Large — ease through the chest and hip." },
  { value: "XL", label: "XL", bestFor: "Extra large — relaxed coats and knits." },
  { value: "XXL", label: "XXL", bestFor: "XXL — generous room through the body." },
  { value: "One Size", label: "One Size", bestFor: "Accessories and unisex pieces." },
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
