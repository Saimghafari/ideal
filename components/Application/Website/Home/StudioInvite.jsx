import Link from "next/link";
import React from "react";
import { WEBSITE_CONTACT } from "@/routes/WebsiteRoute";

const StudioInvite = () => {
  return (
    <section className="border-y border-[var(--si-fog)]/50 bg-[var(--si-cream)] px-6 py-20 sm:px-10 sm:py-24 lg:px-28 xl:px-36">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="nn-label mb-4 text-[var(--si-deep-brown)]">Velora</p>
          <h2 className="nn-display text-3xl font-light text-[var(--si-deep-brown)] sm:text-4xl">
            A piece for your wardrobe.
            <br />
            <span className="nn-display-italic text-[var(--si-burnt-orange)]">
              Or a question about fit.
            </span>
          </h2>
          <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-[var(--si-muted)]">
            Write to us about size, fabric, or an order. We reply through the
            contact form — not a mailing list.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:items-start">
          <Link
            href={WEBSITE_CONTACT}
            className="nn-btn-primary inline-flex w-full justify-center sm:w-auto"
          >
            Contact Velora
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StudioInvite;
