import Link from "next/link";
import React from "react";
import { buildPageMeta } from "@/lib/buildPageMeta";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

export const metadata = buildPageMeta({
  title: "Privacy Policy – Data Protection & Privacy",
  description:
    "Read our privacy policy at Velora. Learn how we protect your personal information and ensure your privacy while shopping for embroidery wall décor.",
  path: "/privacy-policy",
  keywords:
    "velora privacy policy, data protection, wall art shop privacy, personal information, secure shopping, embroidery wall decor",
});

const dataTypes = [
  {
    title: "Personal Details",
    text: "Name, email, phone, and shipping or billing addresses from registration or checkout.",
  },
  {
    title: "Payment Data",
    text: "Orders are paid via email invoice after you submit the checkout form. We do not offer cash on delivery or process card payments on this website. Invoice and order details (including your OI- order ID) are kept to fulfil and support your order.",
  },
  {
    title: "Usage Information",
    text: "Browser type, pages visited, and session data to improve your experience.",
  },
  {
    title: "Account Records",
    text: "Login credentials, order history (including OI- order IDs), and preferences to personalise your journey.",
  },
];

const uses = [
  "Process orders and send email invoices and order updates",
  "Provide customer support and shipping notifications",
  "Send studio news you opt into (unsubscribe anytime)",
  "Personalise recommendations and browsing",
  "Maintain website security and performance",
];

const PrivacyPolicy = () => {
  return (
    <div className="bg-[var(--si-cream)] text-[var(--si-deep-brown)]">
      {/* Soft gradient header — different from terms document style */}
      <header className="bg-gradient-to-b from-[var(--si-cream)] to-[var(--si-cream)] px-6 sm:px-10 lg:px-20 xl:px-28 pt-16 sm:pt-20 pb-14">
        <nav className="text-[0.58rem] tracking-[0.22em] uppercase text-[var(--si-muted)] flex gap-2 mb-10">
          <Link href={WEBSITE_HOME} className="hover:text-[var(--si-deep-brown)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--si-deep-brown)]">Privacy</span>
        </nav>
        <div className="max-w-6xl grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <p className="nn-label text-[var(--si-deep-brown)] mb-5">Your Trust</p>
            <h1 className="nn-display text-4xl sm:text-5xl lg:text-6xl font-light text-[var(--si-deep-brown)]">
              Privacy Policy
            </h1>
          </div>
          <p className="text-sm font-light leading-[1.95] text-[var(--si-muted)] lg:pb-2">
            We handle your information with the same care we bring to every panel
            — securely, transparently, and never sold to third parties.
          </p>
        </div>
      </header>

      {/* Data type cards — 2x2 grid, unique to privacy */}
      <section className="px-6 sm:px-10 lg:px-20 xl:px-28 py-16 sm:py-20">
        <p className="nn-label text-[var(--si-deep-brown)] mb-10">What We Collect</p>
        <div className="mx-auto max-w-6xl grid sm:grid-cols-2 gap-6">
          {dataTypes.map((item) => (
            <div
              key={item.title}
              className="p-8 sm:p-10 bg-[var(--si-cream)] border border-[var(--si-mist)] hover:shadow-[0_20px_50px_-20px_rgb(8_6_4/0.1)] transition-shadow duration-500"
            >
              <h2 className="nn-display text-xl font-light text-[var(--si-deep-brown)] mb-4">
                {item.title}
              </h2>
              <p className="text-sm font-light leading-[1.9] text-[var(--si-muted)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Two-column split: uses + protection */}
      <section className="bg-[var(--si-cream)] px-6 sm:px-10 lg:px-20 xl:px-28 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="nn-label text-[var(--si-deep-brown)] mb-8">How We Use It</p>
            <ul className="space-y-4">
              {uses.map((use) => (
                <li
                  key={use}
                  className="flex gap-4 text-sm font-light leading-[1.9] text-[var(--si-muted)]"
                >
                  <span className="h-1 w-1 mt-2.5 shrink-0 rotate-45 bg-[var(--si-burnt-orange)]" />
                  {use}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 sm:p-10 bg-[var(--si-deep-brown)]">
            <p className="nn-label text-[var(--si-cream)]/70 mb-6">Protection</p>
            <p className="text-sm font-light leading-[1.95] text-[var(--si-cream)]/60">
              We use encryption and secure servers to safeguard your data. Your
              information is never sold, rented, or shared without consent — except
              when required to fulfil orders or comply with law.
            </p>
            <p className="mt-6 text-sm font-light leading-[1.95] text-[var(--si-cream)]/60">
              By using Velora, you consent to these practices. Policy
              updates will be posted on this page.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 py-14 text-center border-t border-[var(--si-mist)]">
        <p className="text-sm font-light text-[var(--si-muted)] mb-6">
          Questions about your data?
        </p>
        <Link href="/contact-us" className="nn-link-quiet">
          Contact Velora
        </Link>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
