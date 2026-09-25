"use client";
import { Input } from "../../ui/input";
import { WEBSITE_SHOP } from "../../../routes/WebsiteRoute";
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
  { label: "Women", href: `${WEBSITE_SHOP}?category=women` },
  { label: "Men", href: `${WEBSITE_SHOP}?category=men` },
  { label: "Accessories", href: `${WEBSITE_SHOP}?category=accessories` },
  { label: "All clothing", href: WEBSITE_SHOP },
];

const popular = ["Silk", "Cashmere", "Coat", "Shirt", "Trousers", "Dress"];

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
        overlayClassName="bg-black/25 backdrop-blur-[6px]"
        className="menu-glass flex h-dvh max-h-dvh w-full flex-col gap-0 overflow-hidden border-l border-white/50 bg-transparent p-0 shadow-none sm:max-w-[420px] [&>button]:right-5 [&>button]:top-5 [&>button]:text-black/40 [&>button]:hover:text-black [&>button]:opacity-100 [&>button]:ring-0 [&>button]:focus:ring-0"
      >
        <SheetHeader className="shrink-0 space-y-0 px-6 pb-2 pt-6 pr-14 text-left sm:px-8">
          <SheetTitle className="nn-display text-[1.85rem] font-light tracking-[0.02em] text-black">
            Search
          </SheetTitle>
          <SheetDescription className="mt-1 text-[0.8rem] font-light text-black/45">
            Find a piece from the collection.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6 pt-4 sm:px-8">
          <div className="flex items-center gap-3 rounded-full border border-black/10 bg-white/50 px-4 transition-colors focus-within:border-black/25 focus-within:bg-white/70">
            <IoSearchOutline size={18} className="shrink-0 text-black/35" />
            <Input
              ref={inputRef}
              className="h-12 flex-1 rounded-none border-0 bg-transparent px-0 text-[0.95rem] font-light text-black shadow-none placeholder:text-black/35 focus-visible:ring-0"
              placeholder="Type a name, fabric, or style"
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
                className="shrink-0 rounded-full bg-black px-4 py-1.5 text-[0.62rem] font-medium tracking-[0.16em] uppercase text-white"
              >
                Go
              </button>
            )}
          </div>
        </div>

        <div className="nn-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-8 sm:px-8">
          <p className="mb-3 text-[0.62rem] font-medium tracking-[0.2em] uppercase text-black/40">
            Collections
          </p>
          <ul className="mb-8">
            {collections.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => onClose?.()}
                  className="group flex items-center justify-between border-b border-black/8 py-3.5 text-[0.95rem] text-black transition-colors hover:text-black/55"
                >
                  {item.label}
                  <HiArrowRight
                    size={14}
                    className="opacity-0 transition-opacity group-hover:opacity-50"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <p className="mb-3 text-[0.62rem] font-medium tracking-[0.2em] uppercase text-black/40">
            Popular searches
          </p>
          <div className="flex flex-wrap gap-2">
            {popular.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => go(`${WEBSITE_SHOP}?q=${encodeURIComponent(term)}`)}
                className="rounded-full border border-black/10 bg-white/30 px-3.5 py-1.5 text-[0.78rem] text-black/75 transition-colors hover:border-black/25 hover:bg-white/50 hover:text-black"
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
