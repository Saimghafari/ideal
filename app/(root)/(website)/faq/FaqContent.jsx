"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "@/lib/faqData";
import {
  WEBSITE_CARE_GUIDE,
  WEBSITE_RETURNS,
  WEBSITE_SHIPPING,
} from "@/routes/WebsiteRoute";

const FaqContent = ({ hideHeader = false }) => {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === active);

  return (
    <div className="min-h-screen bg-[var(--si-cream)] text-[var(--si-deep-brown)]">
      {!hideHeader && (
        <header className="bg-[var(--si-deep-brown)] px-6 pb-14 pt-20 text-center sm:px-10 sm:pt-24">
          <p className="nn-label mb-5 text-[var(--si-cream)]">Super Ideal</p>
          <h1 className="nn-display text-4xl font-light text-[var(--si-cream)] sm:text-5xl lg:text-6xl">
            Sweets FAQ
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm font-light leading-[1.9] text-white/55">
            Packs, orders, shipping, and freshness for Super Ideal sweets and bakery.
          </p>
        </header>
      )}

      <div className="sticky top-[4.25rem] z-30 border-b border-[var(--si-mist)] bg-[var(--si-cream)]/95 px-6 py-4 backdrop-blur-sm sm:px-10">
        <ul className="nn-scrollbar mx-auto flex max-w-3xl justify-start gap-2 overflow-x-auto sm:justify-center">
          {FAQ_CATEGORIES.map((cat) => (
            <li key={cat.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(cat.id)}
                className={`px-5 py-2 text-[0.62rem] font-light uppercase tracking-[0.2em] transition-colors ${
                  active === cat.id
                    ? "bg-[var(--si-deep-brown)] text-[var(--si-cream)]"
                    : "border border-[var(--si-mist)] bg-transparent text-[var(--si-muted)] hover:text-[var(--si-deep-brown)]"
                }`}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section className="px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="space-y-3">
            {filtered.map((item, index) => (
              <AccordionItem
                key={`${item.category}-${index}`}
                value={`faq-${index}`}
                className="rounded-none border border-[var(--si-mist)] bg-white px-6 data-[state=open]:border-[var(--si-burnt-orange)] sm:px-8"
              >
                <AccordionTrigger className="py-6 text-left text-[0.95rem] font-light text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)] hover:no-underline sm:text-base [&>svg]:text-[var(--si-burnt-orange)]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-sm font-light leading-[1.95] text-[var(--si-muted)]">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t border-[var(--si-mist)] px-6 py-16 text-center">
        <p className="nn-display-italic mb-6 text-xl font-light text-[var(--si-deep-brown)] sm:text-2xl">
          Still have a question?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5 text-sm">
          <Link href="/contact-us" className="nn-btn-outline">
            Contact Super Ideal
          </Link>
          <Link href={WEBSITE_SHIPPING} className="nn-link-quiet">
            Shipping
          </Link>
          <Link href={WEBSITE_CARE_GUIDE} className="nn-link-quiet">
            Freshness
          </Link>
          <Link href={WEBSITE_RETURNS} className="nn-link-quiet">
            Returns
          </Link>
          <Link href="/wall-art-size-guide" className="nn-link-quiet">
            Pack guide
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FaqContent;
