"use client";
import React, { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams } from "next/navigation";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { updateShopQuery } from "@/lib/updateShopQuery";
import Link from "next/link";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";
import {
  SHOP_PRICE_MAX,
  SHOP_PRICE_MIN,
  SHOP_PRICE_STEP,
} from "@/lib/staticCatalog";

const PRICE_PRESETS = [
  { label: "Under Rs 500", min: 0, max: 500 },
  { label: "Rs 500 – 1,500", min: 500, max: 1500 },
  { label: "Rs 1,500 – 3,000", min: 1500, max: 3000 },
];

const AVAILABILITY = [
  { value: "online", label: "Online delivery" },
  { value: "store", label: "In store only" },
];

const Filter = ({ tone = "sidebar", categories = [] }) => {
  const isDrawer = tone === "drawer";
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const [priceFilter, setPriceFilter] = useState({
    minPrice: SHOP_PRICE_MIN,
    maxPrice: SHOP_PRICE_MAX,
  });

  const selectedCategory = (searchParams.get("category") || "")
    .split(",")
    .map((item) => item.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter(Boolean);
  const availability = searchParams.get("availability") || "";

  useEffect(() => {
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    setPriceFilter({
      minPrice: min ? parseInt(min, 10) : SHOP_PRICE_MIN,
      maxPrice: max ? Math.min(parseInt(max, 10), SHOP_PRICE_MAX) : SHOP_PRICE_MAX,
    });
  }, [searchParams]);

  const pushParams = (mutate) => {
    const next = new URLSearchParams(searchParams.toString());
    mutate(next);
    updateShopQuery(router, next.toString());
  };

  const handleCategoryFilter = (categorySlug) => {
    pushParams((params) => {
      const current = (params.get("category") || "").split(",").filter(Boolean);
      if (current.length === 1 && current[0] === categorySlug) params.delete("category");
      else params.set("category", categorySlug);
    });
  };

  const handleSubcategoryFilter = (parentSlug, childSlug) => {
    pushParams((params) => {
      if (params.get("category") === childSlug) params.set("category", parentSlug);
      else params.set("category", childSlug);
    });
  };

  const handleAvailability = (value) => {
    pushParams((params) => {
      if (params.get("availability") === value) params.delete("availability");
      else params.set("availability", value);
    });
  };

  const applyPrice = (minPrice, maxPrice) => {
    setPriceFilter({ minPrice, maxPrice });
    pushParams((params) => {
      if (minPrice <= SHOP_PRICE_MIN && maxPrice >= SHOP_PRICE_MAX) {
        params.delete("minPrice");
        params.delete("maxPrice");
        return;
      }
      params.set("minPrice", String(minPrice));
      params.set("maxPrice", String(maxPrice));
    });
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className={isDrawer ? "" : "rounded-[22px] border border-[#f1e3d4] bg-white p-5 shadow-[0_8px_24px_rgba(75,46,30,0.04)]"}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-[1.35rem] font-semibold text-[#3a2416]">Filters</h2>
        {hasFilters ? (
          <Link href={WEBSITE_SHOP} scroll={false} className="text-[12.5px] font-bold text-[#E45700] hover:text-[#c2410c]">
            Clear all
          </Link>
        ) : null}
      </div>

      <div className="border-t border-[#f3e6da] pt-4">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#E45700]">Category</p>
        <ul className="mt-3 space-y-2">
          {categories.map((category) => {
            const active =
              selectedCategory.includes(category.slug) ||
              category.children?.some((child) => selectedCategory.includes(child.slug));
            return (
              <li key={category.slug}>
                <button
                  type="button"
                  onClick={() => handleCategoryFilter(category.slug)}
                  aria-pressed={active}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[14px] transition-colors ${
                    active
                      ? "bg-[#fff1e6] font-bold text-[#E45700]"
                      : "font-medium text-[#5c4032] hover:bg-[#fff8f2]"
                  }`}
                >
                  <span>{category.name}</span>
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      active ? "border-[#E45700] bg-[#E45700]" : "border-[#e4cfc0]"
                    }`}
                  >
                    {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                  </span>
                </button>
                {!isDrawer && active && category.children?.length ? (
                  <ul className="mt-1 space-y-1 border-l border-[#f3e6da] pl-3">
                    {category.children.map((child) => {
                      const childActive = selectedCategory.includes(child.slug);
                      return (
                        <li key={child.slug}>
                          <button
                            type="button"
                            onClick={() => handleSubcategoryFilter(category.slug, child.slug)}
                            aria-pressed={childActive}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] transition-colors ${
                              childActive
                                ? "bg-[#fff1e6] font-bold text-[#E45700]"
                                : "font-medium text-[#5c4032] hover:bg-[#fff8f2]"
                            }`}
                          >
                            <span>{child.name}</span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                childActive ? "border-[#E45700] bg-[#E45700]" : "border-[#e4cfc0]"
                              }`}
                            >
                              {childActive ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5 border-t border-[#f3e6da] pt-4">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#E45700]">Availability</p>
        <div className="mt-3 grid gap-2">
          {AVAILABILITY.map((option) => {
            const active = availability === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAvailability(option.value)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-2 text-[13px] font-semibold ${
                  active
                    ? "border-[#E45700] bg-[#E45700] text-white"
                    : "border-[#f0dcc4] bg-[#fffaf6] text-[#5c4032] hover:border-[#E45700]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 border-t border-[#f3e6da] pt-4">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#E45700]">Price range</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => {
            const active =
              priceFilter.minPrice === preset.min && priceFilter.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPrice(preset.min, preset.max)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                  active
                    ? "bg-[#3a2416] text-white"
                    : "bg-[#fff1e6] text-[#6b5142] hover:bg-[#ffe4d2]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="px-1 pb-1 pt-5">
          <Slider
            value={[priceFilter.minPrice, priceFilter.maxPrice]}
            min={SHOP_PRICE_MIN}
            max={SHOP_PRICE_MAX}
            step={SHOP_PRICE_STEP}
            onValueChange={(value) =>
              setPriceFilter({ minPrice: value[0], maxPrice: value[1] })
            }
            onValueCommit={(value) => applyPrice(value[0], value[1])}
            className="w-full py-2 [&_[data-slot=slider-range]]:bg-[#E45700] [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-[#E45700] [&_[data-slot=slider-thumb]]:bg-white"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[13px] font-bold text-[#3a2416]">
          <span>{formatPrice(priceFilter.minPrice)}</span>
          <span className="text-[12px] font-medium text-[#b08974]">to</span>
          <span>{formatPrice(priceFilter.maxPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default Filter;
