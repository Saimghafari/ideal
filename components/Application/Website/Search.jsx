"use client";
import { Input } from "../../ui/input";
import { WEBSITE_SHOP } from "../../../routes/WebsiteRoute";
import { SHOP_CATEGORIES } from "@/lib/staticCatalog";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { HiArrowRight } from "react-icons/hi2";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";

const collections = [
  ...SHOP_CATEGORIES.map((item) => ({
    label: item.name,
    href: `${WEBSITE_SHOP}?category=${item.slug}`,
  })),
  { label: "All sweets & bakery", href: WEBSITE_SHOP },
];

const popular = [
  "Soan Halwa",
  "Butter Biscuits",
  "Kunafa",
  "Namak Pare",
  "Fudge Cake",
  "Gift Box",
];

const Search = ({ isShow, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const go = (href) => {
    onClose?.();
    router.push(href);
  };

  const handleSearch = () => {
    const q = query?.trim();
    if (!q) return;
    go(`${WEBSITE_SHOP}?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    if (!isShow) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [isShow]);

  return (
    <Sheet open={isShow} onOpenChange={(open) => !open && onClose?.()}>
      <SheetContent
        overlayClassName="z-[100] bg-[var(--si-deep-brown)]/40"
        className="z-[100] flex h-dvh max-h-dvh w-full flex-col gap-0 overflow-hidden border-l border-[var(--si-mist)] bg-[var(--si-cream)] p-0 shadow-none sm:max-w-[420px] [&>button]:right-5 [&>button]:top-5 [&>button]:text-[var(--si-deep-brown)]/50 [&>button]:hover:text-[var(--si-deep-brown)] [&>button]:opacity-100 [&>button]:ring-0 [&>button]:focus:ring-0"
      >
        <SheetHeader className="shrink-0 space-y-0 px-6 pb-2 pt-6 pr-14 text-left sm:px-8">
          <SheetTitle className="nn-display text-[1.85rem] font-light tracking-[0.02em] text-[var(--si-deep-brown)]">
            Search
          </SheetTitle>
          <SheetDescription className="mt-1 text-[0.8rem] font-light text-[var(--si-deep-brown)]/55">
            Find sweets, bakery, biscuits, and gift boxes.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6 pt-4 sm:px-8">
          <div className="flex items-center gap-3 rounded-full border border-[var(--si-mist)] bg-white px-4 transition-colors focus-within:border-[var(--si-burnt-orange)]">
            <IoSearchOutline
              size={18}
              className="shrink-0 text-[var(--si-deep-brown)]/40"
            />
            <Input
              ref={inputRef}
              className="h-12 flex-1 rounded-none border-0 bg-transparent px-0 text-[0.95rem] font-light text-[var(--si-deep-brown)] shadow-none placeholder:text-[var(--si-deep-brown)]/35 focus-visible:ring-0"
              placeholder="Type a sweet, cake, or bakery item"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            {query.trim() && (
              <button
                type="button"
                onClick={handleSearch}
                className="shrink-0 rounded-full bg-[var(--si-burnt-orange)] px-4 py-1.5 text-[0.62rem] font-medium tracking-[0.16em] uppercase text-white"
              >
                Go
              </button>
            )}
          </div>
        </div>

        <div className="nn-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-8 sm:px-8">
          <p className="mb-3 text-[0.62rem] font-medium tracking-[0.2em] uppercase text-[var(--si-deep-brown)]/45">
            From the shop
          </p>
          <ul className="mb-8">
            {collections.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => onClose?.()}
                  className="group flex items-center justify-between border-b border-[var(--si-mist)] py-3.5 text-[0.95rem] text-[var(--si-deep-brown)] transition-colors hover:text-[var(--si-burnt-orange)]"
                >
                  {item.label}
                  <HiArrowRight
                    size={14}
                    className="opacity-0 text-[var(--si-burnt-orange)] transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <p className="mb-3 text-[0.62rem] font-medium tracking-[0.2em] uppercase text-[var(--si-deep-brown)]/45">
            Popular searches
          </p>
          <div className="flex flex-wrap gap-2">
            {popular.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() =>
                  go(`${WEBSITE_SHOP}?q=${encodeURIComponent(term)}`)
                }
                className="rounded-full border border-[var(--si-mist)] bg-white px-3.5 py-1.5 text-[0.78rem] text-[var(--si-deep-brown)]/80 transition-colors hover:border-[var(--si-burnt-orange)] hover:text-[var(--si-burnt-orange)]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Search;
