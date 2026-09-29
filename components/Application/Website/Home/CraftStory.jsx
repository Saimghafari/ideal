"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { craftSlides } from "./homeData";

const CraftStory = () => {
  const [active, setActive] = useState(0);
  const hasCycled = useRef(false);
  const previous = (active - 1 + craftSlides.length) % craftSlides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      hasCycled.current = true;
      setActive((current) => (current + 1) % craftSlides.length);
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="grid lg:grid-cols-2 lg:items-stretch min-h-[660px] lg:min-h-[720px]">
      {/* Left: Full-bleed auto-fading craft images */}
      <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-full overflow-hidden">
        {/* Keep previous slide fully opaque so the background never flashes */}
        <div className="absolute inset-0 z-0">
          <Image
            src={craftSlides[previous].src}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[var(--si-deep-brown)]/15" />
        </div>

        {/* Active slide fades in on top */}
        <div
          key={active}
          className={`absolute inset-0 z-[1] ${
            hasCycled.current
              ? "animate-[nn-slide-fade_1200ms_ease-in-out]"
              : ""
          }`}
        >
          <Image
            src={craftSlides[active].src}
            alt={craftSlides[active].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority={active === 0}
          />
          <div className="absolute inset-0 bg-[var(--si-deep-brown)]/15" />
        </div>
      </div>

      {/* Right: Copy */}
      <div className="bg-[var(--si-cream)] flex items-center px-8 sm:px-14 lg:px-16 xl:px-20 py-20 sm:py-28">
        <div className="max-w-md">
          <div className="nn-hairline w-20 mb-8" />
          <p className="nn-label text-[var(--si-deep-brown)] mb-6">The House</p>
          <h2 className="nn-display text-4xl sm:text-5xl lg:text-[3.25rem] font-light text-[var(--si-deep-brown)] leading-[1.05]">
            Baked with care,
            <br />
            <span className="nn-display-italic text-[var(--si-burnt-orange)]">
              shared with ease
            </span>
          </h2>
          <p className="mt-8 text-sm font-light leading-[1.95] text-[var(--si-muted)]">
            Every Super Ideal box starts in the Faisalabad kitchen — mithai,
            biscuits, and bakery, priced in rupees.
          </p>
          <p className="mt-5 text-sm font-light leading-[1.95] text-[var(--si-muted)]">
            Fresh from the oven, packed for the people you are taking it to.
          </p>
          <Link href="/about-us" className="nn-link-quiet mt-10 inline-block">
            Discover our story
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CraftStory;
