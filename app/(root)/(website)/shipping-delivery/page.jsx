import Link from "next/link";
import React from "react";
import { buildPageMeta } from "@/lib/buildPageMeta";
import DirectAnswer from "@/components/Application/Website/DirectAnswer";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLdBuilders";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

export const metadata = buildPageMeta({
  title: "Shipping & Delivery",
  description:
    "How Super Ideal packs and delivers sweets and bakery across Pakistan.",
  path: "/shipping-delivery",
  keywords:
    "sweets delivery, bakery shipping, Super Ideal dispatch, gift box delivery, Faisalabad bakery",
});

const timeline = [
  {
    step: "Order Placed",
    detail:
      "Complete the checkout form. You receive an email with your OI- order ID and invoice. We do not offer cash on delivery or online card payment.",
  },
  {
    step: "Invoice Payment",
    detail:
      "Pay using the instructions on your email invoice. Studio work begins after payment is confirmed.",
  },
  {
    step: "Studio Preparation",
    detail:
      "Sweets and biscuits are sealed, and cakes are packed for a cool journey.",
  },
  {
    step: "Dispatch",
    detail:
      "Typically within 2–4 business days of payment confirmation. Tracking details are shared by email.",
  },
  {
    step: "Arrival",
    detail:
      "Inspect packaging on receipt. Contact us within 48 hours if damage is found — see Returns & Refunds.",
  },
];

const packaging = [
  "Food-safe inner wrap",
  "Sealed tins and boxes",
  "Cushioned outer carton",
  "Chilled packing for cream cakes",
];

const deliveryZones = [
  {
    zone: "Standard",
    time: "3–7 days",
    cities: "After dispatch, depending on destination and courier service",
  },
  {
    zone: "Extended routes",
    time: "7–14 days",
    cities: "Remote or international destinations may take longer",
  },
];

const ShippingDeliveryPage = () => {
  return (
    <div className="bg-[var(--si-cream)] text-[var(--si-deep-brown)]">
      <SeoJsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: WEBSITE_HOME },
          { name: "Shipping & Delivery", url: "/shipping-delivery" },
        ])}
      />
      {/* Wine stripe header — unique slim banner */}
      <div className="bg-[var(--si-deep-brown)] px-6 sm:px-10 lg:px-20 xl:px-28 py-12 sm:py-14">
        <nav className="text-[0.58rem] tracking-[0.22em] uppercase text-[var(--si-cream)]/40 flex gap-2 mb-6">
          <Link href={WEBSITE_HOME} className="hover:text-[var(--si-cream)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--si-cream)]/70">Shipping</span>
        </nav>
        <h1 className="nn-display text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--si-cream)]">
          From the shop to your door
        </h1>
      </div>

      {/* Intro strip */}
      <div className="px-6 sm:px-10 lg:px-20 xl:px-28 py-12 border-b border-[var(--si-mist)]">
        <p className="mx-auto max-w-2xl text-center text-sm font-light leading-[2] text-[var(--si-muted)]">
          Sweets, biscuits, and gift boxes are packed after your email invoice is
          paid. We do not ship cash-on-delivery orders. Fresh cakes and some
          bakery items stay in store.
        </p>
      </div>

      {/* Vertical timeline — unique to shipping */}
      <section className="px-6 sm:px-10 lg:px-20 xl:px-28 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="nn-label text-[var(--si-deep-brown)] mb-12 text-center">The Journey</p>
          <ol className="relative space-y-0">
            {timeline.map((item, i) => (
              <li key={item.step} className="relative flex gap-8 pb-12 last:pb-0">
                {i < timeline.length - 1 && (
                  <span
                    className="absolute left-[11px] top-6 bottom-0 w-px bg-[var(--si-burnt-orange)]/25"
                    aria-hidden
                  />
                )}
                <span className="relative z-10 mt-1.5 h-[22px] w-[22px] shrink-0 rounded-full border-2 border-[var(--si-burnt-orange)] bg-[var(--si-cream)]" />
                <div className="pt-0.5">
                  <h2 className="nn-display text-xl font-light text-[var(--si-deep-brown)] mb-2">
                    {item.step}
                  </h2>
                  <p className="text-sm font-light leading-[1.9] text-[var(--si-muted)]">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Packaging checklist + delivery zones side by side */}
      <section className="bg-[var(--si-cream)] px-6 sm:px-10 lg:px-20 xl:px-28 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="nn-label text-[var(--si-deep-brown)] mb-8">Inside the Box</p>
            <ul className="space-y-4">
              {packaging.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 py-3 border-b border-[var(--si-mist)] text-sm font-light text-[var(--si-muted)]"
                >
                  <span className="h-1.5 w-1.5 rotate-45 bg-[var(--si-burnt-orange)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="nn-label text-[var(--si-deep-brown)] mb-8">Delivery Times</p>
            <div className="space-y-6">
              {deliveryZones.map((zone) => (
                <div
                  key={zone.zone}
                  className="p-6 sm:p-8 border border-[var(--si-mist)] bg-[var(--si-cream)]"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className="nn-display text-xl font-light text-[var(--si-deep-brown)]">
                      {zone.zone}
                    </h3>
                    <span className="nn-display text-2xl text-[var(--si-burnt-orange)]">
                      {zone.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-light text-[var(--si-muted)]">
                    {zone.cities}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs font-light text-[var(--si-fog)] leading-[1.8]">
              International shipping available on request.{" "}
              <Link href="/contact-us" className="text-[var(--si-deep-brown)] underline underline-offset-2">
                Contact us
              </Link>{" "}
              for a quote.
            </p>
          </div>
        </div>
      </section>

      <DirectAnswer
        question="Does Super Ideal ship internationally?"
        answer="International shipping for dry sweets and biscuits is available on request. After invoice payment, Super Ideal packs the order in 1–2 business days. Contact the shop with your city for a quote — there is no cash-on-delivery shipping."
        href="/contact-us"
        linkLabel="Request an international shipping quote"
      />
      <section className="px-6 sm:px-10 py-12 text-center border-t border-[var(--si-mist)]">
        <Link href="/contact-us" className="nn-link-quiet">
          Delivery questions?
        </Link>
      </section>
    </div>
  );
};

export default ShippingDeliveryPage;
