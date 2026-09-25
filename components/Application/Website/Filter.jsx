"use client";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ButtonLoading from "../ButtonLoading";
import { useRouter, useSearchParams } from "next/navigation";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import Link from "next/link";
import { sizes as clothingSizes } from "@/lib/utils";
import { useCurrency } from "@/components/Application/Website/CurrencyProvider";

const PRICE_MAX = 100000;

const Filter = ({ showHeading = true, tone = "default" }) => {
  const isDrawer = tone === "drawer";
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();

  const [priceFilter, setPriceFilter] = useState({
    minPrice: 0,
    maxPrice: PRICE_MAX,
  });
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const { data: categoryData } = useFetch("/api/category/get-category");

  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  useEffect(() => {
    searchParams.get("category")
      ? setSelectedCategory(searchParams.get("category").split(","))
      : setSelectedCategory([]);
    searchParams.get("size")
      ? setSelectedSizes(searchParams.get("size").split(","))
      : setSelectedSizes([]);

    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    if (min || max) {
      setPriceFilter({
        minPrice: min ? parseInt(min, 10) : 0,
        maxPrice: max ? parseInt(max, 10) : PRICE_MAX,
      });
    }
  }, [searchParams]);

  const handlePriceChange = (value) => {
    setPriceFilter({ minPrice: value[0], maxPrice: value[1] });
  };

  const handleCategoryFilter = (categorySlug) => {
    let next = [...selectedCategory];
    if (next.includes(categorySlug)) {
      next = next.filter((cat) => cat !== categorySlug);
    } else {
      next.push(categorySlug);
    }

    setSelectedCategory(next);

    next.length > 0
      ? urlSearchParams.set("category", next.join(","))
      : urlSearchParams.delete("category");
    urlSearchParams.delete("color");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const handleSizeFilter = (sizeValue) => {
    let next = [...selectedSizes];
    if (next.includes(sizeValue)) {
      next = next.filter((item) => item !== sizeValue);
    } else {
      next.push(sizeValue);
    }
    setSelectedSizes(next);
    next.length > 0
      ? urlSearchParams.set("size", next.join(","))
      : urlSearchParams.delete("size");
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const handlePriceFilter = () => {
    urlSearchParams.set("minPrice", String(priceFilter.minPrice));
    urlSearchParams.set("maxPrice", String(priceFilter.maxPrice));
    urlSearchParams.delete("color");
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const categories = categoryData?.success ? categoryData.data : [];

  if (tone === "bar") {
    return (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {categories.map((category) => {
          const active = selectedCategory.includes(category.slug);
          return (
            <button
              key={category._id}
              type="button"
              onClick={() => handleCategoryFilter(category.slug)}
              className={`text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
                active
                  ? "text-[var(--si-deep-brown)]"
                  : "text-[var(--si-muted)] hover:text-[var(--si-deep-brown)]"
              }`}
            >
              {category.name}
              {active && (
                <span className="mt-1 block h-px w-full bg-[var(--si-burnt-orange)]" />
              )}
            </button>
          );
        })}
        {searchParams.toString().length > 0 && (
          <Link
            href={WEBSITE_SHOP}
            className="text-[0.58rem] tracking-[0.16em] uppercase text-[var(--si-muted)] hover:text-[var(--si-burnt-orange)]"
          >
            Clear
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {showHeading && (
        <div className="mb-8">
          <p className="nn-label mb-3 text-[0.5rem] text-[var(--si-burnt-orange)]">
            Filter
          </p>
          <h2 className="nn-display text-[1.85rem] font-light leading-[1.1] text-[var(--si-deep-brown)]">
            Clothes that{" "}
            <span className="nn-display-italic text-[var(--si-burnt-orange)]">
              last
            </span>
          </h2>
        </div>
      )}

      {searchParams.toString().length > 0 && !isDrawer && (
        <Link
          href={WEBSITE_SHOP}
          className="nn-link-quiet mb-7 inline-block !text-[0.58rem]"
        >
          Clear selection
        </Link>
      )}

      <Accordion
        type="multiple"
        defaultValue={["1", "2", "4"]}
        className="border-t border-[var(--si-mist)]"
      >
        <AccordionItem value="1" className="border-[var(--si-mist)]">
          <AccordionTrigger
            className={`nn-label text-[var(--si-deep-brown)] hover:no-underline hover:text-[var(--si-deep-brown)] [&[data-state=open]]:text-[var(--si-deep-brown)] ${
              isDrawer
                ? "py-4 text-[0.52rem] tracking-[0.26em]"
                : "py-5 text-[0.55rem] tracking-[0.28em]"
            }`}
          >
            Category
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3.5 pb-2">
              {categoryData?.success &&
                categoryData.data.map((category) => {
                  const active = selectedCategory.includes(category.slug);
                  return (
                    <li key={category._id}>
                      <label className="group/item flex cursor-pointer items-center gap-3">
                        <Checkbox
                          onCheckedChange={() =>
                            handleCategoryFilter(category.slug)
                          }
                          checked={active}
                          className="rounded-none border-[var(--si-fog)] data-[state=checked]:border-[var(--si-deep-brown)] data-[state=checked]:bg-[var(--si-deep-brown)]"
                        />
                        <span
                          className={`text-sm font-light transition-colors ${
                            active
                              ? "text-[var(--si-deep-brown)]"
                              : "text-[var(--si-muted)] group-hover/item:text-[var(--si-deep-brown)]"
                          }`}
                        >
                          {category.name}
                        </span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="2" className="border-[var(--si-mist)]">
          <AccordionTrigger
            className={`nn-label text-[var(--si-deep-brown)] hover:no-underline hover:text-[var(--si-deep-brown)] [&[data-state=open]]:text-[var(--si-deep-brown)] ${
              isDrawer
                ? "py-4 text-[0.52rem] tracking-[0.26em]"
                : "py-5 text-[0.55rem] tracking-[0.28em]"
            }`}
          >
            Size
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-wrap gap-2 pb-2">
              {clothingSizes.map((size) => {
                const active = selectedSizes.includes(size.value);
                return (
                  <li key={size.value}>
                    <button
                      type="button"
                      onClick={() => handleSizeFilter(size.value)}
                      className={`min-w-10 px-2.5 py-1.5 text-[0.7rem] tracking-[0.12em] uppercase border ${
                        active
                          ? "border-[var(--si-deep-brown)] bg-[var(--si-deep-brown)] text-[var(--si-cream)]"
                          : "border-[var(--si-mist)] text-[var(--si-deep-brown)]"
                      }`}
                    >
                      {size.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="4" className="border-b-0 border-[var(--si-mist)]">
          <AccordionTrigger
            className={`nn-label text-[var(--si-deep-brown)] hover:no-underline hover:text-[var(--si-deep-brown)] [&[data-state=open]]:text-[var(--si-deep-brown)] ${
              isDrawer
                ? "py-4 text-[0.52rem] tracking-[0.26em]"
                : "py-5 text-[0.55rem] tracking-[0.28em]"
            }`}
          >
            Price (Rs)
          </AccordionTrigger>
          <AccordionContent className="overflow-visible pb-2">
            <div className="px-2.5 py-4">
              <Slider
                value={[priceFilter.minPrice, priceFilter.maxPrice]}
                min={0}
                max={PRICE_MAX}
                step={500}
                onValueChange={handlePriceChange}
                className="w-full py-2 [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:hover:ring-2 [&_[data-slot=slider-thumb]]:focus-visible:ring-2"
              />
            </div>
            <div className="flex items-center justify-between px-1 pt-1 text-[0.7rem] font-light tracking-[0.08em] text-[var(--si-muted)]">
              <span>{formatPrice(priceFilter.minPrice)}</span>
              <span className="text-[var(--si-fog)]">to</span>
              <span>{formatPrice(priceFilter.maxPrice)}</span>
            </div>

            <div className="mt-6 px-1">
              <ButtonLoading
                onClick={handlePriceFilter}
                type="button"
                text="Apply Range"
                className="nn-btn-outline w-full !rounded-none !bg-transparent !py-3.5 text-[var(--si-deep-brown)] hover:!bg-[var(--si-deep-brown)] hover:!text-[var(--si-cream)]"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;
