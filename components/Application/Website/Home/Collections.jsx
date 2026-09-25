import Image from "next/image";
import Link from "next/link";
import React from "react";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const Collections = ({ collections = [] }) => {
  if (!collections.length) return null;

  return (
    <section className="bg-[var(--si-cream)]">
      {collections.map((item, index) => {
        const reverse = index % 2 === 1;
        return (
          <Link
            key={item.id}
            href={item.href || WEBSITE_SHOP}
            className={`group grid border-t border-[var(--si-mist)] lg:grid-cols-2 ${
              reverse ? "lg:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--si-mist)] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[34rem]">
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div
              className={`flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:px-16 xl:px-20 ${
                reverse
                  ? "bg-[var(--si-deep-brown)] text-[var(--si-cream)]"
                  : "bg-[var(--si-cream)] text-[var(--si-deep-brown)]"
              }`}
            >
              <p
                className={`nn-label mb-4 ${
                  reverse ? "text-[var(--si-cream)]" : "text-[var(--si-burnt-orange)]"
                }`}
              >
                {String(index + 1).padStart(2, "0")} · {item.subtitle}
              </p>
              <h2 className="nn-display text-4xl font-light leading-[0.95] sm:text-5xl lg:text-[3.4rem]">
                {item.title}
              </h2>
              <p
                className={`mt-5 max-w-sm text-sm font-light leading-relaxed ${
                  reverse ? "text-white/55" : "text-[var(--si-muted)]"
                }`}
              >
                {item.description}
              </p>
              <span
                className={`nn-link-quiet mt-8 w-fit ${
                  reverse
                    ? "border-white/25 text-[var(--si-cream)]"
                    : "text-[var(--si-deep-brown)]"
                }`}
              >
                Shop {item.title}
              </span>
            </div>
          </Link>
        );
      })}
    </section>
  );
};

export default Collections;
