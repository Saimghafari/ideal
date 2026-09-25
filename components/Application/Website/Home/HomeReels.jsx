"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { resolvePrices } from "@/lib/currency";
import { formatMoney } from "@/lib/formatCurrency";
import { showToast } from "@/lib/showToast";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";

const HomeReels = ({ reels = [] }) => {
  const dispatch = useDispatch();
  const railRef = useRef(null);
  const videoRefs = useRef({});
  const [activeReel, setActiveReel] = useState(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanPrev(rail.scrollLeft > 8);
    setCanNext(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    updateArrows();
    rail.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      rail.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, reels.length]);

  useEffect(() => {
    const nodes = Object.values(videoRefs.current).filter(Boolean);
    if (!nodes.length || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.55] }
    );

    nodes.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [reels.length]);

  useEffect(() => {
    if (!activeReel) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") setActiveReel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeReel]);

  const scrollByPage = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.9, 960), behavior: "smooth" });
  };

  const handleAddToCart = (reel, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!reel?.productId) return;
    dispatch(
      addIntoCart({
        productId: reel.productId,
        variantId: reel.variantId || reel.productId,
        name: reel.name,
        url: reel.slug,
        size: reel.size || "M",
        color: null,
        mrp: reel.mrp,
        sellingPrice: reel.sellingPrice,
        media: reel.thumb || reel.poster,
        qty: 1,
      })
    );
    showToast("success", "Product added into cart.");
  };

  if (!reels.length) return null;

  return (
    <section aria-label="Product reels" className="bg-white py-[18px]">
      <div className="relative mx-auto w-full px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        <div
          ref={railRef}
          className="home-reels-rail flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain pb-1 sm:gap-3"
        >
          {reels.map((reel) => {
            const prices = resolvePrices(reel);
            const discount = Number(reel.discountPercentage) || 0;
            return (
              <article
                key={reel.id}
                className="relative h-[450px] w-[250px] shrink-0 snap-start overflow-hidden rounded-[14px] bg-[#111] sm:h-[520px] sm:w-[300px]"
              >
                <button
                  type="button"
                  aria-label={`Watch reel — ${reel.name}`}
                  onClick={() => setActiveReel(reel)}
                  className="absolute inset-0 z-10"
                />
                {reel.poster ? (
                  <Image
                    src={reel.poster}
                    alt=""
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                ) : null}
                <video
                  ref={(node) => {
                    if (node) videoRefs.current[reel.id] = node;
                    else delete videoRefs.current[reel.id];
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={reel.poster}
                  src={reel.video}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 z-20 p-2 sm:p-2.5">
                  <div className="relative rounded-[14px] bg-white/18 px-2.5 py-2.5 backdrop-blur-[17px] sm:px-3">
                    <Link
                      href={reel.href || WEBSITE_PRODUCT_DETAILS(reel.slug)}
                      className="relative z-20 flex items-center gap-2.5"
                    >
                      <span className="relative h-[38px] w-[38px] shrink-0 overflow-hidden rounded-full bg-white/20 sm:h-[42px] sm:w-[42px]">
                        {reel.thumb ? (
                          <Image
                            src={reel.thumb}
                            alt=""
                            fill
                            sizes="42px"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-medium text-white sm:text-[13px]">
                          {reel.name}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-white/95">
                          <span>{formatMoney(prices.sellingPrice)}</span>
                          {discount > 0 ? (
                            <span className="text-white/55 line-through">
                              {formatMoney(prices.mrp)}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </Link>
                    {discount > 0 ? (
                      <span className="absolute right-3 top-2 rounded-[5px] bg-[#f01313] px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {discount}% off
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={(event) => handleAddToCart(reel, event)}
                      className="relative z-20 mt-2 flex h-9 w-full items-center justify-center rounded-[9px] bg-white text-[12px] font-medium text-[var(--si-deep-brown)] transition-colors hover:bg-[var(--si-cream)]"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {canPrev ? (
          <button
            type="button"
            aria-label="Previous reels"
            onClick={() => scrollByPage(-1)}
            className="absolute left-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--si-deep-brown)] shadow-md backdrop-blur-sm md:flex"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        ) : null}
        {canNext ? (
          <button
            type="button"
            aria-label="Next reels"
            onClick={() => scrollByPage(1)}
            className="absolute right-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--si-deep-brown)] shadow-md backdrop-blur-sm md:flex"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        ) : null}
      </div>

      {activeReel ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Watch reel — ${activeReel.name}`}
          onClick={() => setActiveReel(null)}
        >
          <div
            className="relative h-[min(86vh,720px)] w-[min(100%,380px)] overflow-hidden rounded-[16px] bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <video
              className="h-full w-full object-cover"
              src={activeReel.video}
              poster={activeReel.poster}
              autoPlay
              muted
              loop
              playsInline
              controls
            />
            <button
              type="button"
              onClick={() => setActiveReel(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white"
              aria-label="Close reel"
            >
              ×
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
              <p className="text-sm text-white">{activeReel.name}</p>
              <Link
                href={activeReel.href || WEBSITE_PRODUCT_DETAILS(activeReel.slug)}
                className="mt-2 inline-flex text-[11px] tracking-[0.16em] uppercase text-white/80"
              >
                View product
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default HomeReels;
