import Link from "next/link";
import React from "react";
import { buildPageMeta } from "@/lib/buildPageMeta";

export const metadata = buildPageMeta({
  title: "Returns & Refunds – Client Assurance",
  description:
    "Returns and refunds for Velora clothing. Unused pieces with tags can be returned.",
  path: "/returns-refunds",
  keywords:
    "wall art returns, embroidery refund policy, damaged art delivery, Velora returns, exchange policy, client assurance",
});

const eligible = [
  "Damage to frame, panel surface, or embroidery during transit",
  "Piece materially differs from its product listing",
  "Manufacturing defect not consistent with the character of thread art",
];

const notEligible = [
  "Change of mind after delivery or after placing an order",
  "Minor tonal variations inherent to thread embroidery",
  "Damage from improper handling or installation after delivery",
  "Orders cancelled after production has started on bespoke commissions (except studio error)",
];

const processSteps = [
  "Email us within 48 hours with your OI- order ID",
  "Send clear photographs of the concern and packaging",
  "We respond within 1–2 business days",
  "Approved returns collected by our courier partner",
];

const resolutions = [
  {
    title: "Refund",
    text: "Returned via the same channel used for your email invoice payment within 7–14 business days after inspection",
  },
  {
    title: "Exchange",
    text: "Alternative panel of equal value, where available — no cash on delivery exchanges",
  },
  {
    title: "Repair",
    text: "Minor framing issues resolved at our discretion",
  },
];

const ReturnsRefundsPage = () => {
  return (
    <div className="bg-[var(--si-cream)] text-[var(--si-deep-brown)]">
      {/* Large quote opener — not a hero template */}
      <section className="px-6 sm:px-10 lg:px-20 xl:px-28 pt-20 sm:pt-28 pb-16 text-center">
        <p className="nn-label text-[var(--si-deep-brown)] mb-8">Client Assurance</p>
        <h1 className="nn-display text-3xl font-light text-[var(--si-deep-brown)] sm:text-4xl">
          Returns & Refunds
        </h1>
        <blockquote className="nn-display-italic mt-6 text-2xl sm:text-3xl lg:text-4xl font-light leading-[1.35] text-[var(--si-deep-brown)] max-w-3xl mx-auto">
          We stand behind every panel that leaves our studio.
        </blockquote>
        <p className="mt-8 mx-auto max-w-lg text-sm font-light leading-[1.95] text-[var(--si-muted)]">
          Orders are placed by form and paid via email invoice — not cash on
          delivery. When something is genuinely wrong, we resolve it — repair,
          replacement, or refund — without delay.
        </p>
      </section>

      {/* Eligible vs Not — contrasting twin cards */}
      <section className="px-6 sm:px-10 lg:px-20 xl:px-28 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-6 lg:gap-10">
          <div className="p-8 sm:p-10 bg-[var(--si-cream)] border border-[var(--si-burnt-orange)]/25">
            <h2 className="nn-display text-2xl font-light text-[var(--si-deep-brown)] mb-6 flex items-center gap-3">
              <span className="text-[var(--si-burnt-orange)]">✓</span> Eligible
            </h2>
            <ul className="space-y-4">
              {eligible.map((item) => (
                <li key={item} className="text-sm font-light leading-[1.9] text-[var(--si-muted)] pl-4 border-l border-[var(--si-burnt-orange)]/30">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 sm:p-10 bg-[var(--si-cream)] border border-[var(--si-mist)]">
            <h2 className="nn-display text-2xl font-light text-[var(--si-muted)] mb-6 flex items-center gap-3">
              <span className="text-[var(--si-fog)]">✕</span> Not Eligible
            </h2>
            <ul className="space-y-4">
              {notEligible.map((item) => (
                <li key={item} className="text-sm font-light leading-[1.9] text-[var(--si-fog)] pl-4 border-l border-[var(--si-mist)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process — horizontal steps on desktop */}
      <section className="bg-[var(--si-deep-brown)] px-6 sm:px-10 lg:px-20 xl:px-28 py-16 sm:py-24">
        <p className="nn-label text-[var(--si-cream)]/70 mb-10 text-center">
          How to Report
        </p>
        <ol className="mx-auto max-w-5xl grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, i) => (
            <li key={step} className="text-center lg:text-left">
              <span className="nn-display text-3xl text-[var(--si-burnt-orange)]/40 block mb-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-light leading-[1.9] text-[var(--si-cream)]/60">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Resolution options */}
      <section className="px-6 sm:px-10 lg:px-20 xl:px-28 py-16 sm:py-24">
        <p className="nn-label text-[var(--si-deep-brown)] mb-10 text-center">Resolution</p>
        <div className="mx-auto max-w-4xl grid sm:grid-cols-3 gap-6">
          {resolutions.map((r) => (
            <div key={r.title} className="text-center p-6 border-t-2 border-[var(--si-burnt-orange)]">
              <h3 className="nn-display text-xl font-light text-[var(--si-deep-brown)] mb-2">
                {r.title}
              </h3>
              <p className="text-xs sm:text-sm font-light text-[var(--si-muted)]">
                {r.text}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-12 mx-auto max-w-xl text-center text-xs font-light leading-[1.9] text-[var(--si-fog)]">
          Bespoke commissions: returns limited to defects or transit damage.
          Deposits and balances are confirmed by invoice. Full terms are
          confirmed in writing before production. This policy aligns with our
          Terms & Conditions and Shipping & Delivery pages.
        </p>
      </section>

      <section className="px-6 sm:px-10 py-14 border-t border-[var(--si-mist)] text-center">
        <Link href="/contact-us" className="nn-btn-primary">
          Contact Velora
        </Link>
      </section>
    </div>
  );
};

export default ReturnsRefundsPage;
