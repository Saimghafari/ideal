"use client";
import Filter from "@/components/Application/Website/Filter";
import Sorting from "@/components/Application/Website/Sorting";
import { WEBSITE_HOME, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
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
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductBox from "@/components/Application/Website/ProductBox";
import ButtonLoading from "@/components/Application/ButtonLoading";

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="nn-frame !p-[7px]">
      <div className="aspect-[4/5] w-full bg-[var(--si-mist)]" />
    </div>
    <div className="mt-6 space-y-3 px-0.5">
      <div className="h-2.5 w-16 bg-[var(--si-mist)]" />
      <div className="h-5 w-4/5 bg-[var(--si-mist)]" />
      <div className="h-3 w-1/3 bg-[var(--si-mist)]" />
    </div>
  </div>
);

export const ProductSkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:gap-x-14 lg:gap-y-20">
    {Array.from({ length: count }).map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

const ShopClient = ({ hideHeader = false }) => {
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [limit, setLimit] = useState(9);
  const [sorting, setSorting] = useState("default_sorting");
  const [isMobileFilter, setIsMobileFilter] = useState(false);

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
  const categoryLabel = searchParams.get("category")?.split(",")[0];

  const resultLabel =
    productCount > 0
      ? `${productCount} ${productCount === 1 ? "piece" : "pieces"}`
      : null;

  return (
    <div className={hideHeader ? "" : "nn-cream-bg min-h-[70vh]"}>
      {!hideHeader && (
        <header className="border-b border-[var(--si-mist)] bg-[var(--si-cream)] px-6 py-12 sm:px-10 sm:py-16 lg:px-14 xl:px-20">
          <nav className="mb-6 flex items-center gap-2 text-[0.58rem] tracking-[0.22em] uppercase text-[var(--si-muted)]">
            <Link href={WEBSITE_HOME} className="hover:text-[var(--si-deep-brown)]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--si-deep-brown)]">Shop</span>
          </nav>
          <p className="nn-label mb-3 text-[var(--si-burnt-orange)]">The Collection</p>
          <h1 className="nn-display text-4xl font-light sm:text-5xl">
            Quiet luxury clothing
          </h1>
          {categoryLabel && (
            <p className="mt-4 text-sm font-light text-[var(--si-muted)]">
              Viewing {categoryLabel.replace(/-/g, " ")}
            </p>
          )}
        </header>
      )}

      <Sheet open={isMobileFilter} onOpenChange={setIsMobileFilter}>
        <SheetContent
          side="right"
          className="flex h-full w-full flex-col gap-0 overflow-hidden border-l border-[var(--si-mist)] bg-[var(--si-cream)] p-0 sm:max-w-md [&>button]:right-5 [&>button]:top-5 [&>button]:text-[var(--si-deep-brown)]"
        >
          <div className="shrink-0 px-6 pb-5 pt-8">
            <SheetHeader className="space-y-0 p-0">
              <p className="nn-label mb-3 text-[var(--si-burnt-orange)]">Refine</p>
              <SheetTitle className="nn-display text-3xl font-light">
                Size & price
              </SheetTitle>
              <SheetDescription className="mt-2 text-sm font-light text-[var(--si-muted)]">
                Narrow the collection by size or rupee range.
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="nn-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-6">
            <Filter showHeading={false} tone="drawer" />
          </div>
          <div className="shrink-0 border-t border-[var(--si-mist)] px-6 py-4">
            <button
              type="button"
              onClick={() => setIsMobileFilter(false)}
              className="nn-btn-primary w-full"
            >
              View clothing
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <section className="bg-[var(--si-cream)]">
        <div className="flex flex-col gap-5 border-b border-[var(--si-mist)] px-6 py-5 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 xl:px-20">
          <Filter showHeading={false} tone="bar" />
          <Sorting
            limit={limit}
            setLimit={setLimit}
            sorting={sorting}
            setSorting={setSorting}
            mobileFilterOpen={isMobileFilter}
            setMobileFilterOpen={setIsMobileFilter}
            resultLabel={resultLabel}
          />
        </div>

        <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-14 xl:px-20">
          {showInitialSkeleton && <ProductSkeletonGrid count={limit} />}

          {error && (
            <div className="py-16 text-center">
              <p className="nn-label mb-4 text-[var(--si-burnt-orange)]">Unavailable</p>
              <p className="nn-display text-2xl font-light">{error.message}</p>
            </div>
          )}

          {!showInitialSkeleton && !error && productCount > 0 && (
            <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:gap-x-14 lg:gap-y-20">
              {products.map((product) => (
                <ProductBox key={product._id} product={product} />
              ))}
            </div>
          )}

          {!showInitialSkeleton &&
            !error &&
            productCount === 0 &&
            !isFetching && (
              <div className="py-20 text-center">
                <p className="nn-label mb-4 text-[var(--si-burnt-orange)]">Empty edit</p>
                <h2 className="nn-display mb-4 text-3xl font-light">
                  Nothing in this selection
                </h2>
                <p className="mx-auto mb-10 max-w-sm text-sm font-light text-[var(--si-muted)]">
                  Soften the filters to see the full collection.
                </p>
                <Link href={WEBSITE_SHOP} className="nn-btn-outline">
                  Reset filters
                </Link>
              </div>
            )}

          <div className="mt-16 flex flex-col items-center gap-5">
            {hasNextPage ? (
              <ButtonLoading
                type="button"
                loading={isFetching}
                text="Load more"
                onClick={fetchNextPage}
                className="nn-btn-outline !rounded-none !bg-transparent !px-12 !py-4"
              />
            ) : (
              !showInitialSkeleton &&
              !error &&
              productCount > 0 && (
                <p className="nn-label text-[0.5rem] text-[var(--si-muted)]">
                  End of the collection
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
