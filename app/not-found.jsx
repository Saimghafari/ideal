import Link from "next/link";
import { WEBSITE_HOME, WEBSITE_SHOP } from "@/routes/WebsiteRoute";

export const metadata = {
  title: "Page not found | Velora",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[var(--si-deep-brown)] px-6 py-24 text-center">
      <div className="nn-hairline-gold mb-8 w-12" />
      <p className="nn-label mb-4 tracking-[0.34em] text-[var(--si-burnt-orange)]">
        404
      </p>
      <h1 className="nn-display text-3xl font-light text-[var(--si-cream)] sm:text-4xl">
        This page is not{" "}
        <span className="nn-display-italic text-[var(--si-burnt-orange)]">available</span>
      </h1>
      <p className="mt-5 max-w-sm text-sm font-light text-[var(--si-cream)]/50">
        The link may be outdated, or this piece is no longer in the collection.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href={WEBSITE_SHOP} className="nn-btn-ghost">
          Shop clothing
        </Link>
        <Link
          href={WEBSITE_HOME}
          className="text-[0.6rem] tracking-[0.24em] uppercase text-[var(--si-cream)]/45 hover:text-[var(--si-burnt-orange)]"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
