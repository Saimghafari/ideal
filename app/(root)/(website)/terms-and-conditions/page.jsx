import Link from "next/link";
import React from "react";
import { buildPageMeta } from "@/lib/buildPageMeta";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

export const metadata = buildPageMeta({
  title: "Terms & Conditions – Shop Policies",
  description:
    "Terms for shopping Velora clothing. Prices are in Pakistani rupees.",
  path: "/terms-and-conditions",
  keywords:
    "velora terms, wall art shop policies, embroidery purchase terms, returns policy, intellectual property, online wall decor shop",
});

const clauses = [
  {
    num: "I",
    title: "Use of Our Website",
    points: [
      "You must be at least 18 years old, or visiting under the supervision of a parent or guardian, to place an order.",
      "Use the website only for lawful purposes. Fraudulent, abusive, or harmful activity is strictly prohibited.",
    ],
  },
  {
    num: "II",
    title: "Product Information",
    points: [
      "We aim to display accurate product details, sizes, and prices in Pakistani rupees. Fabric shade can vary slightly between pieces.",
      "We reserve the right to correct inaccuracies and update information at any time without prior notice.",
    ],
  },
  {
    num: "III",
    title: "Orders & Payments",
    points: [
      "Place an order by completing the checkout form. We do not offer cash on delivery (COD) or on-site card checkout.",
      "After you place an order, you receive an email invoice with your OI- order ID and payment instructions. Pay using the method shown on the invoice.",
      "Studio preparation and dispatch begin after payment is confirmed against your invoice.",
      "If an item cannot be fulfilled, we will notify you and arrange a refund or cancellation as applicable.",
      "Bespoke commissions require a written deposit agreement before production begins. Deposits are confirmed by invoice and are non-refundable once production has started, except for studio error or transit damage as set out in our Returns & Refunds policy.",
    ],
  },
  {
    num: "IV",
    title: "Shipping & Delivery",
    points: [
      "Orders are prepared and dispatched after invoice payment is confirmed. Timelines and packaging standards are described in our Shipping & Delivery policy.",
      "Risk of loss passes to you upon delivery to the address provided at checkout, except where damage in transit is reported per our Returns & Refunds policy.",
    ],
  },
  {
    num: "V",
    title: "Returns & Refunds",
    points: [
      "Eligibility, timelines, and refund methods are governed exclusively by our Returns & Refunds policy.",
      "Change-of-mind returns follow the window on the returns page. Worn or washed pieces cannot be returned.",
      "Approved refunds are issued using the same channel you used to pay the email invoice, unless otherwise agreed in writing.",
    ],
  },
  {
    num: "VI",
    title: "Intellectual Property",
    points: [
      "All content on Velora — including logos, images, embroidery compositions, and text — is our property and protected by copyright laws.",
      "You may not copy, reproduce, or use our content or designs without prior written consent.",
    ],
  },
  {
    num: "VII",
    title: "Limitation of Liability",
    points: [
      "To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the website or products.",
      "Nothing in these terms limits liability where it cannot be limited under applicable law.",
    ],
  },
  {
    num: "VIII",
    title: "Changes to Terms",
    points: [
      "We may update these Terms & Conditions at any time. The revised version is effective when posted on this page. Continued use of the website constitutes acceptance of the updated terms.",
    ],
  },
];

const TermsAndConditionsPage = () => {
  return (
    <div className="bg-[var(--si-cream)] text-[var(--si-deep-brown)] min-h-screen">
      {/* Document-style header — narrow, left-aligned, no dark hero */}
      <header className="px-6 sm:px-10 lg:px-20 xl:px-28 pt-16 sm:pt-20 pb-12 border-b border-[var(--si-mist)]">
        <nav className="text-[0.58rem] tracking-[0.22em] uppercase text-[var(--si-muted)] flex gap-2 mb-10">
          <Link href={WEBSITE_HOME} className="hover:text-[var(--si-deep-brown)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--si-deep-brown)]">Terms</span>
        </nav>
        <div className="max-w-2xl">
          <h1 className="nn-display text-4xl sm:text-5xl font-light text-[var(--si-deep-brown)]">
            Terms & Conditions
          </h1>
          <p className="mt-6 text-sm font-light leading-[1.95] text-[var(--si-muted)]">
            Effective July 2026. By using this website, you agree to the following
            terms. These terms work together with our Shipping & Delivery,
            Returns & Refunds, and Privacy policies — there is no conflict: orders
            are placed via form, paid by email invoice, and we do not offer cash
            on delivery.
          </p>
        </div>
      </header>

      {/* Prose document — Roman numerals, no sidebar */}
      <article className="px-6 sm:px-10 lg:px-20 xl:px-28 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto space-y-14">
          {clauses.map((clause) => (
            <section key={clause.num}>
              <div className="flex items-baseline gap-4 mb-5">
                <span className="nn-display text-lg text-[var(--si-burnt-orange)]/60">
                  {clause.num}.
                </span>
                <h2 className="nn-display text-xl sm:text-2xl font-light text-[var(--si-deep-brown)]">
                  {clause.title}
                </h2>
              </div>
              <ul className="space-y-3 pl-8 sm:pl-10">
                {clause.points.map((point) => (
                  <li
                    key={point}
                    className="text-sm font-light leading-[1.95] text-[var(--si-muted)] list-disc marker:text-[var(--si-burnt-orange)]/50"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>

      <footer className="px-6 sm:px-10 lg:px-20 xl:px-28 py-12 border-t border-[var(--si-mist)]">
        <p className="max-w-2xl mx-auto text-xs font-light text-[var(--si-fog)] text-center">
          Questions?{" "}
          <Link href="/contact-us" className="text-[var(--si-deep-brown)] underline underline-offset-2">
            Contact the studio
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default TermsAndConditionsPage;
