import Link from "next/link";
import { sizes } from "@/lib/utils";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { buildPageMeta } from "@/lib/buildPageMeta";

export const metadata = {
  ...buildPageMeta({
    title: "Pack Guide",
    description:
      "Super Ideal pack sizes for sweets, biscuits, and gift boxes. Prices in Pakistani rupees.",
    path: "/wall-art-size-guide",
    keywords: "sweets pack size, 250g 500g 1kg, Super Ideal",
  }),
  robots: { index: false, follow: true },
};

export default function SizeGuidePage() {
  return (
    <div className="nn-cream-bg min-h-[70vh] px-6 py-16 sm:px-10 lg:px-28">
      <p className="nn-label mb-4 text-[var(--si-burnt-orange)]">Packs</p>
      <h1 className="nn-display text-4xl font-light text-[var(--si-deep-brown)] sm:text-5xl">
        Pack guide
      </h1>
      <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-[var(--si-muted)]">
        Sweets and biscuits are sold by weight. Cakes, trays, and gift boxes
        are sold as the pack shown on the product page.
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
              {size.value === "Gift"
                ? "Wrapped boxes and hampers"
                : size.value === "Tray"
                  ? "Counter and catering trays"
                  : "Sweets and biscuits"}
            </span>
          </li>
        ))}
      </ul>

      <Link href={WEBSITE_SHOP} className="nn-btn-primary mt-12 inline-flex">
        Shop sweets
      </Link>
    </div>
  );
}
