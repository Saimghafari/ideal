import Link from "next/link";
import { WEBSITE_CONTACT, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { buildPageMeta } from "@/lib/buildPageMeta";

export const metadata = buildPageMeta({
  title: "Custom Cakes",
  description:
    "Ask Super Ideal about a celebration cake or catering tray. We reply with a timeline and an invoice in Pakistani rupees.",
  path: "/commissions",
});

export default function CustomOrderPage() {
  return (
    <div className="nn-cream-bg min-h-[70vh] px-6 py-20 text-center sm:px-10">
      <p className="nn-label mb-4 text-[var(--si-burnt-orange)]">Made for the occasion</p>
      <h1 className="nn-display text-4xl font-light sm:text-5xl">
        Custom cakes
      </h1>
      <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-[var(--si-muted)]">
        Need a celebration cake, a larger mithai box, or a catering tray? Write
        to us with the date and what you want. We reply with a timeline and a
        rupee invoice.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href={WEBSITE_CONTACT} className="nn-btn-primary">
          Contact the shop
        </Link>
        <Link href={WEBSITE_SHOP} className="nn-btn-outline">
          Shop the counter
        </Link>
      </div>
    </div>
  );
}
