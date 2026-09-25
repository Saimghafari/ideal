"use client";

import { sizes as clothingSizes } from "@/lib/utils";

const SizeGuide = ({
  activeSize,
  selectedSizes = [],
  availableSizes,
  onSelect,
  multi = false,
}) => {
  const availableSet = availableSizes?.length
    ? new Set(availableSizes)
    : null;

  const list = clothingSizes.filter(
    (size) => !availableSet || availableSet.has(size.value)
  );

  const isActive = (size) =>
    multi
      ? selectedSizes.includes(size.value)
      : activeSize === size.value;

  return (
    <div>
      {!multi && (
        <p className="nn-label mb-4 text-[0.48rem] text-[var(--si-muted)]">
          Size
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {list.map((size) => {
          const active = isActive(size);
          return (
            <button
              key={size.value}
              type="button"
              onClick={() => onSelect?.(size.value)}
              className={`min-w-12 px-3 py-2 text-[0.72rem] tracking-[0.14em] uppercase border ${
                active
                  ? "border-[var(--si-deep-brown)] bg-[var(--si-deep-brown)] text-[var(--si-cream)]"
                  : "border-[var(--si-mist)] text-[var(--si-deep-brown)]"
              }`}
            >
              {size.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeGuide;
