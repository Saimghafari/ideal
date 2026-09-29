import React from "react";
import FaqContent from "./FaqContent";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { buildPageMeta } from "@/lib/buildPageMeta";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/jsonLdBuilders";
import { FAQ_ITEMS } from "@/lib/faqData";

export const metadata = buildPageMeta({
  title: "FAQ",
  description:
    "Questions about Super Ideal sweets and bakery — packs, orders, shipping, freshness, and returns. Prices are in Pakistani rupees.",
  path: "/faq",
  keywords: "super ideal faq, sweets packs, bakery shipping, freshness",
});

const FaqPage = () => (
  <>
    <SeoJsonLd
      data={buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "FAQ", url: "/faq" },
      ])}
    />
    <SeoJsonLd data={buildFaqJsonLd(FAQ_ITEMS)} />
    <header className="bg-[var(--si-deep-brown)] px-6 pb-14 pt-16 text-center sm:px-10 sm:pb-16 sm:pt-20">
      <p className="nn-label mb-5 text-[var(--si-cream)]">Super Ideal</p>
      <h1 className="nn-display text-4xl font-light text-[var(--si-cream)] sm:text-5xl lg:text-6xl">
        Sweets FAQ
      </h1>
      <p className="mx-auto mt-6 max-w-md text-sm font-light leading-[1.9] text-white/55">
        Packs, orders, shipping, and freshness for Super Ideal sweets and bakery.
      </p>
    </header>
    <FaqContent hideHeader />
  </>
);

export default FaqPage;
