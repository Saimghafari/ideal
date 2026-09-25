import Image from "next/image";
import Link from "next/link";
import React from "react";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { LOOKBOOK_IMAGE } from "@/lib/staticCatalog";

export const metadata = {
  title: { absolute: "Our Story | Velora Clothing" },
  description:
    "Velora is a clothing brand. Silk, wool, cashmere, and leather pieces — priced in Pakistani rupees.",
  alternates: { canonical: "https://www.dectorre.com/about-us" },
};

const values = [
  {
    title: "Considered cloth",
    text: "Silk, merino, wool, and leather chosen for how they feel and how they last.",
  },
  {
    title: "A small edit",
    text: "We keep the collection short — coats, knits, shirts, and a few finishing pieces.",
  },
  {
    title: "Honest fit",
    text: "Sizes from XS to XXL, with one-size accessories. Try your usual size first.",
  },
  {
    title: "Rupees only",
    text: "Every price on the site is in Pakistani rupees. No dollar conversion.",
  },
];

const OurStoryPage = () => {
  return (
    <div className="bg-[var(--si-cream)] text-[var(--si-deep-brown)]">
      <section className="relative isolate min-h-[70vh] overflow-hidden bg-[var(--si-deep-brown)]">
        <Image
          src={LOOKBOOK_IMAGE}
          alt="Velora clothing"
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--si-deep-brown)]/45" />
        <div className="relative z-10 flex min-h-[70vh] items-end px-6 pb-16 sm:px-10 lg:px-28">
          <div className="max-w-xl text-[var(--si-cream)]">
            <p className="nn-label mb-4 text-[var(--si-cream)]">Our story</p>
            <h1 className="nn-display text-5xl font-light leading-[1.05] sm:text-6xl">
              A clothing brand,
              <br />
              <span className="nn-display-italic">cut quietly.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-[var(--si-cream)]/70">
              Velora makes ready-to-wear for people who want less noise —
              good cloth, a clear size, and a price in rupees.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-28">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <div key={item.title}>
              <h2 className="nn-display text-2xl font-light">{item.title}</h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-[var(--si-muted)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <Link href={WEBSITE_SHOP} className="nn-btn-primary">
            Shop clothing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OurStoryPage;
