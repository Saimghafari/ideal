"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const ArrowIcon = ({ direction }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path
      d={direction === "prev" ? "M72 95L27 50L72 5" : "M28 5L73 50L28 95"}
      stroke="currentColor"
      strokeWidth="6.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GenderCollectionRow = ({ collection }) => {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [railMetrics, setRailMetrics] = useState({
    canScroll: false,
    thumb: 0,
    left: 0,
  });
  const railRef = useRef(null);
  const scrollHideRef = useRef(null);

  const updateRailMetrics = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const { scrollLeft, scrollWidth, clientWidth } = rail;
    const canScroll = scrollWidth > clientWidth + 2;
    setRailMetrics({
      canScroll,
      thumb: canScroll ? (clientWidth / scrollWidth) * 100 : 100,
      left: canScroll ? (scrollLeft / scrollWidth) * 100 : 0,
    });
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  const handleRailScroll = useCallback(() => {
    updateRailMetrics();
    setIsScrolling(true);
    window.clearTimeout(scrollHideRef.current);
    scrollHideRef.current = window.setTimeout(() => setIsScrolling(false), 800);
  }, [updateRailMetrics]);

  const scrollByPage = useCallback((direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * rail.clientWidth,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    updateRailMetrics();
    const observer = new ResizeObserver(updateRailMetrics);
    observer.observe(rail);
    window.addEventListener("resize", updateRailMetrics);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateRailMetrics);
      window.clearTimeout(scrollHideRef.current);
    };
  }, [updateRailMetrics]);

  if (!collection) return null;

  const headingId = `${collection.id}-collections-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-white py-7 md:py-4">
      <div className="mx-auto flex w-full flex-col md:flex-row md:items-center md:justify-end md:px-5">
        <Link
          href={collection.href || WEBSITE_SHOP}
          className="relative block w-full px-5 md:w-1/2 md:px-0 lg:w-5/12"
        >
          <div className="relative overflow-hidden rounded-[10px] pb-[133%]">
            {collection.featured?.src ? (
              <Image
                src={collection.featured.src}
                alt={collection.featured.alt || collection.title}
                fill
                sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-[1.2s] ease-out hover:scale-[1.03]"
              />
            ) : null}
          </div>
          <span className="sr-only">Shop {collection.title}</span>
        </Link>

        <div className="w-full px-5 md:w-3/4">
          <div className="mt-7 md:-ml-24 md:mt-0 lg:-ml-32">
            <div className="mb-5 text-center md:ml-24 md:px-5 lg:mb-8 lg:ml-32 xl:mb-14">
              <h2
                id={headingId}
                className="text-[1.85rem] font-medium leading-[0.95] tracking-[-0.04em] text-black sm:text-[2.35rem] lg:text-[2.55rem] xl:text-[3.15rem]"
              >
                {collection.title}
              </h2>
            </div>

            <div>
              <div className="relative">
              <button
                type="button"
                aria-label="Previous slide"
                disabled={!canPrev}
                onClick={() => scrollByPage(-1)}
                className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 p-3 text-[#454645] shadow-sm disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowIcon direction="prev" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                disabled={!canNext}
                onClick={() => scrollByPage(1)}
                className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 p-3 text-[#454645] shadow-sm disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowIcon direction="next" />
              </button>

              <div
                ref={railRef}
                onScroll={handleRailScroll}
                aria-label={`${collection.title} categories`}
                className="gender-collection-rail overflow-x-auto overflow-y-hidden overscroll-x-contain"
              >
                <ul className="flex w-full">
                  {collection.items.map((item) => (
                    <li
                      key={item.id}
                      className="w-[calc((100%+4px)/2-4px)] shrink-0 pr-1 lg:w-[calc((100%+4px)/3-4px)]"
                    >
                      <Link href={item.href || collection.href || WEBSITE_SHOP} className="group block">
                        <div className="relative overflow-hidden rounded-[10px] pb-[126.6%]">
                          {item.src ? (
                            <Image
                              src={item.src}
                              alt={item.alt || item.title}
                              fill
                              sizes="(min-width: 1024px) 22vw, 40vw"
                              className="object-cover object-center transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                            />
                          ) : null}
                          <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/40 px-4 py-[5px] text-[0.891rem] font-normal leading-tight text-white md:text-[1.188rem]">
                            {item.title}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              </div>

              <div
                className={`mt-3 h-[3px] overflow-hidden rounded-md bg-[rgba(225,227,225,0.2)] transition-opacity duration-300 ${
                  railMetrics.canScroll && isScrolling ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-md bg-[#282928]"
                  style={{
                    width: `${railMetrics.thumb}%`,
                    marginLeft: `${railMetrics.left}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GenderCollections = ({ collections = [] }) => {
  if (!collections.length) return null;

  return (
    <div className="bg-white">
      {collections.map((collection) => (
        <GenderCollectionRow key={collection.id} collection={collection} />
      ))}
    </div>
  );
};

export default GenderCollections;
