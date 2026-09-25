import Link from "next/link";
import { sizes } from "@/lib/utils";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { buildPageMeta } from "@/lib/buildPageMeta";

export const metadata = buildPageMeta({
  title: "Size Guide",
  description:
    "Velora clothing sizes from XS to XXL. Accessories are one size. Prices in Pakistani rupees.",
  path: "/wall-art-size-guide",
  keywords: "clothing size guide, XS S M L XL, Velora",
});

export default function SizeGuidePage() {
  return (
    <div className="nn-cream-bg min-h-[70vh] px-6 py-16 sm:px-10 lg:px-28">
      <p className="nn-label mb-4 text-[var(--si-burnt-orange)]">Fit</p>
      <h1 className="nn-display text-4xl font-light text-[var(--si-deep-brown)] sm:text-5xl">
        Size guide
      </h1>
      <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-[var(--si-muted)]">
        Most garments are cut in XS–XXL. If you are between sizes, take the
        larger one for coats and knits, and your usual size for shirts and
        trousers. Accessories are one size.
      </p>

      <ul className="mt-12 grid max-w-xl gap-4">
        {sizes.map((size) => (
          <li
            key={size.value}
            className="flex items-baseline justify-between border-b border-[var(--si-mist)] pb-3"
          >
            <span className="text-sm tracking-[0.16em] uppercase">
              {size.label}
            </span>
            <span className="text-sm font-light text-[var(--si-muted)]">
              {size.value === "One Size"
                ? "Scarves, totes, and selected extras"
                : "Ready to wear"}
            </span>
          </li>
        ))}
      </ul>

      <Link href={WEBSITE_SHOP} className="nn-btn-primary mt-12 inline-flex">
        Shop clothing
      </Link>
    </div>
  );
}
