"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { WEBSITE_ABOUT, WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const SLIDES = [
  {
    src: "/assets/home/si-cat-sweets.png",
    alt: "Super Ideal sweets",
  },
  {
    src: "/assets/home/si-cat-bakery.png",
    alt: "Super Ideal bakery",
  },
  {
    src: "/assets/home/si-fudge-cake.png",
    alt: "Chocolate fudge cake",
  },
  {
    src: "/assets/home/si-gift-box.png",
    alt: "Super Ideal gift box",
  },
];

const ClosingCta = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || SLIDES.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      aria-labelledby="closing-cta-heading"
      className="border-t border-black/[0.06] bg-white"
    >
      <div className="mx-auto grid w-full max-w-[92rem] items-center gap-10 px-5 py-12 sm:gap-12 sm:px-8 sm:py-16 md:px-10 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-20 xl:gap-24 xl:px-16">
        <div className="order-2 mx-auto max-w-xl text-center lg:order-1 lg:mx-0 lg:text-left">
          <p className="text-[0.68rem] font-medium tracking-[0.28em] uppercase text-[#8a8a8a]">
            The counter
          </p>
          <h2
            id="closing-cta-heading"
            className="mt-4 text-[1.85rem] font-medium leading-[0.95] tracking-[-0.04em] text-black sm:text-[2.35rem] lg:text-[2.55rem] xl:text-[3.15rem]"
          >
            Sweets for the table.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[0.95rem] font-normal leading-7 text-[#6b6b6b] sm:mt-5 sm:text-[1rem] lg:mx-0">
            Mithai, biscuits, cakes, and gift boxes from the Faisalabad counter.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start">
            <Link
              href={WEBSITE_SHOP}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#111] px-8 text-[0.7rem] font-medium tracking-[0.18em] uppercase text-white transition-colors hover:bg-[#2a2a2a] sm:w-auto"
            >
              Shop now
            </Link>
            <Link
              href={WEBSITE_ABOUT}
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-black/12 px-8 text-[0.7rem] font-medium tracking-[0.18em] uppercase text-[#111] transition-colors hover:border-black/30 sm:w-auto"
            >
              Our story
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div
            className="relative mx-auto h-[22rem] w-full max-w-[36rem] overflow-hidden rounded-[14px] bg-[#f4f4f4] sm:h-[26rem] lg:mx-0 lg:h-[32rem] lg:max-w-none xl:h-[36rem]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {SLIDES.map((slide, index) => (
              <Image
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 1024px) 42vw, (min-width: 640px) 70vw, 90vw"
                priority={index === 0}
                className={`object-cover object-[center_18%] transition-opacity duration-700 ease-in-out ${
                  index === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`Show look ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => setActive(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === active ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingCta;
