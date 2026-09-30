"use client";
import Filter from "@/components/Application/Website/Filter";
import Sorting from "@/components/Application/Website/Sorting";
import { WEBSITE_HOME, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { updateShopQuery } from "@/lib/updateShopQuery";
import React, { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductBox from "@/components/Application/Website/ProductBox";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { SHOP_CATEGORIES } from "@/lib/staticCatalog";
import useFetch from "@/hooks/useFetch";

const ProductSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-[18px] border border-[#f1e3d4] bg-white">
    <div className="aspect-square bg-[#f3e6d8]" />
    <div className="space-y-2 px-3 py-3">
      <div className="h-2.5 w-16 rounded-full bg-[#f3e6d8]" />
      <div className="h-4 w-4/5 rounded-full bg-[#f3e6d8]" />
      <div className="h-3 w-1/3 rounded-full bg-[#f3e6d8]" />
      <div className="h-8 rounded-full bg-[#f3e6d8]" />
    </div>
  </div>
);

const ShopClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchParamsString = searchParams.toString();
  const [limit, setLimit] = useState(12);
  const [sorting, setSorting] = useState("default_sorting");
  const [isMobileFilter, setIsMobileFilter] = useState(false);
  const { data: categoryResponse } = useFetch("/api/category/get-category");
  const categories =
    categoryResponse?.success && categoryResponse.data?.length
      ? categoryResponse.data
      : SHOP_CATEGORIES.map((item) => ({ ...item, children: item.children || [] }));

  const fetchProduct = async (pageParam) => {
    const { data: getProduct } = await axios.get(
      `/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParamsString}`
    );

    if (!getProduct.success) {
      throw new Error(getProduct.message || "Failed to fetch products");
    }

    return getProduct.data;
  };

  const { error, data, isFetching, isLoading, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["products", limit, sorting, searchParamsString],
      queryFn: async ({ pageParam }) => await fetchProduct(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    });

  const products = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.products || []);
  }, [data]);

  const productCount = products.length;
  const showInitialSkeleton = isLoading || (isFetching && !data);
  const selectedCategories = (searchParams.get("category") || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const searchTerm = searchParams.get("search") || searchParams.get("q");

  const selectCategory = (slug) => {
    const next = new URLSearchParams(searchParams.toString());
    const onlyThis = slug && selectedCategories.length === 1 && selectedCategories[0] === slug;
    if (!slug || onlyThis) next.delete("category");
    else next.set("category", slug);
    updateShopQuery(router, next.toString());
  };

  const onlineProducts = products.filter((item) => item.deliverable !== false && !item.todayOnly);
  const todayProducts = products.filter((item) => item.todayOnly);
  const storeProducts = products.filter((item) => item.deliverable === false && !item.todayOnly);

  const resultLabel =
    productCount > 0
      ? `${productCount} ${productCount === 1 ? "product" : "products"}`
      : null;

  const productGrid = "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-4";

  return (
    <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
      <header>
        <div className="relative h-[200px] overflow-hidden sm:h-[250px] lg:h-[280px]">
          <Image
            src="/assets/home/si-storefront.png"
            alt="Super Ideal bakery storefront at night, with cakes and sweets in the window"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_42%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(43,24,16,0.82)_0%,rgba(43,24,16,0.55)_38%,rgba(43,24,16,0.12)_68%)]" />
          <div className="relative mx-auto flex h-full w-full max-w-[1680px] flex-col justify-end px-4 pb-6 pt-5 sm:justify-center sm:px-6 sm:pb-8 xl:px-10">
            <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-white/75 sm:mb-3">
              <Link href={WEBSITE_HOME} className="hover:text-white">Home</Link>
              <span aria-hidden="true">›</span>
              <span className="font-medium text-white">Products</span>
            </nav>
            <h1 className="font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[2.6rem] lg:text-[3rem]">
              Sweets & Bakery
            </h1>
            <p className="mt-2 max-w-[460px] text-[13.5px] leading-relaxed text-white/85 sm:text-[15px]">
              {searchTerm
                ? `Showing results for “${searchTerm}”.`
                : "Packed sweets, bakery, and gift boxes, plus fresh counter items for the same day."}
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1680px] px-4 pb-1 pt-6 sm:px-6 sm:pt-8 xl:px-10">
          <h2 className="mb-4 font-display text-[1.35rem] font-semibold tracking-[-0.02em] sm:text-[1.6rem]">
            Shop by category
          </h2>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
            {categories.map((item) => {
              const active =
                selectedCategories.includes(item.slug) ||
                item.children?.some((child) => selectedCategories.includes(child.slug));
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => selectCategory(item.slug)}
                  aria-pressed={active}
                  className={`w-[128px] shrink-0 overflow-hidden rounded-2xl border bg-white text-left shadow-[0_6px_16px_rgba(75,46,30,0.05)] sm:w-[148px] ${
                    active ? "border-[#E45700]" : "border-[#f1e3d4]"
                  }`}
                >
                  <span className="relative block aspect-[4/3] bg-[#f7efe6]">
                    {item.image ? (
                      <Image src={item.image} alt="" fill sizes="140px" className="object-cover" />
                    ) : null}
                  </span>
                  <span className={`block px-1.5 py-2 text-center text-[12px] font-bold leading-tight sm:text-[13px] ${active ? "text-[#E45700]" : "text-[#3a2416]"}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <Sheet open={isMobileFilter} onOpenChange={setIsMobileFilter}>
        <SheetContent
          side="right"
          className="flex h-full w-full flex-col gap-0 overflow-hidden border-l border-[#f1e3d4] bg-[#FFF8F2] p-0 sm:max-w-md [&>button]:right-5 [&>button]:top-5 [&>button]:text-[#3a2416]"
        >
          <div className="shrink-0 px-5 pb-3 pt-7">
            <SheetHeader className="space-y-0 p-0">
              <SheetTitle className="font-display text-[1.7rem] font-semibold text-[#3a2416]">
                Refine products
              </SheetTitle>
              <SheetDescription className="mt-1 text-[13.5px] text-[#8a6754]">
                Choose a category, availability, or price range.
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
            <Filter tone="drawer" categories={categories} />
          </div>
          <div className="shrink-0 border-t border-[#f1e3d4] px-5 py-4">
            <button
              type="button"
              onClick={() => setIsMobileFilter(false)}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#E45700] text-[14px] font-bold text-white hover:bg-[#cf4c00]"
            >
              Show products
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <section className="mx-auto grid w-full max-w-[1680px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-8 xl:px-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Filter categories={categories} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 rounded-[18px] border border-[#f1e3d4] bg-white px-3 py-3 sm:px-4">
            <Sorting
              limit={limit}
              setLimit={setLimit}
              sorting={sorting}
              setSorting={setSorting}
              setMobileFilterOpen={setIsMobileFilter}
              resultLabel={resultLabel}
            />
          </div>

          {showInitialSkeleton && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-[22px] bg-white px-6 py-16 text-center">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#E45700]">Unavailable</p>
              <p className="mt-2 font-display text-[1.6rem] font-semibold">{error.message}</p>
            </div>
          )}

          {!showInitialSkeleton && !error && productCount > 0 && (
            <div className="space-y-9">
              {onlineProducts.length > 0 && (
                <div>
                  <h2 className="font-display text-[1.35rem] font-semibold sm:text-[1.55rem]">
                    Available for Online Delivery
                  </h2>
                  <p className="mt-1 text-[13px] text-[#8a6754]">Sweets, biscuits, and gift boxes we can send to your door.</p>
                  <div className={`mt-3 ${productGrid}`}>
                    {onlineProducts.map((product) => (
                      <ProductBox key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}
              {todayProducts.length > 0 && (
                <div>
                  <h2 className="font-display text-[1.35rem] font-semibold sm:text-[1.55rem]">
                    Only Today
                  </h2>
                  <p className="mt-1 text-[13px] text-[#8a6754]">Fresh counter items for today. Collect them in store.</p>
                  <div className={`mt-3 ${productGrid}`}>
                    {todayProducts.map((product) => (
                      <ProductBox key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}
              {storeProducts.length > 0 && (
                <div>
                  <h2 className="font-display text-[1.35rem] font-semibold sm:text-[1.55rem]">
                    Not Available for Online Delivery
                  </h2>
                  <p className="mt-1 text-[13px] text-[#8a6754]">Cakes, catering, and fresh cream items stay at the counter.</p>
                  <div className={`mt-3 ${productGrid}`}>
                    {storeProducts.map((product) => (
                      <ProductBox key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!showInitialSkeleton && !error && productCount === 0 && !isFetching && (
            <div className="rounded-[22px] bg-white px-6 py-16 text-center">
              <h2 className="font-display text-[1.8rem] font-semibold">Nothing in this selection</h2>
              <p className="mx-auto mt-2 max-w-sm text-[14px] text-[#8a6754]">
                Try another category or widen the price range to see the full counter.
              </p>
              <Link
                href={WEBSITE_SHOP}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-[#E45700] px-6 text-[14px] font-bold text-white hover:bg-[#cf4c00]"
              >
                Reset filters
              </Link>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center gap-4">
            {hasNextPage ? (
              <ButtonLoading
                type="button"
                loading={isFetching}
                text="Load more"
                onClick={fetchNextPage}
                className="inline-flex h-11 items-center rounded-full border border-[#E45700] bg-white px-8 text-[14px] font-bold text-[#E45700] hover:bg-[#E45700] hover:text-white"
              />
            ) : (
              !showInitialSkeleton &&
              !error &&
              productCount > 0 && (
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#b08974]">
                  You have seen every product
                </p>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopClient;
