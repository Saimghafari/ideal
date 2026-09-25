import Link from "next/link";
import { WEBSITE_CONTACT, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { buildPageMeta } from "@/lib/buildPageMeta";

export const metadata = buildPageMeta({
  title: "Custom Clothing",
  description:
    "Ask Velora about a custom size or fabric. We reply with a timeline and an invoice in Pakistani rupees.",
  path: "/commissions",
});

export default function CustomClothingPage() {
  return (
    <div className="nn-cream-bg min-h-[70vh] px-6 py-20 text-center sm:px-10">
      <p className="nn-label mb-4 text-[var(--si-burnt-orange)]">Made for you</p>
      <h1 className="nn-display text-4xl font-light sm:text-5xl">
        Custom clothing
      </h1>
      <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-[var(--si-muted)]">
        Need another size, a longer coat, or a fabric we do not list? Write to
        us with what you want. We reply with a timeline and a rupee invoice.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href={WEBSITE_CONTACT} className="nn-btn-primary">
          Contact the studio
        </Link>
        <Link href={WEBSITE_SHOP} className="nn-btn-outline">
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
