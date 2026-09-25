import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

export default function ShopMasthead({
  eyebrow = "The Collection",
  h1,
  intro,
  breadcrumb = "Shop",
}) {
  return (
    <header className="border-b border-[var(--si-mist)] bg-[var(--si-cream)]">
      <div className="grid gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:px-14 lg:py-20 xl:px-20">
        <div>
          <nav className="mb-6 flex items-center gap-2 text-[0.58rem] tracking-[0.22em] uppercase text-[var(--si-muted)]">
            <Link href={WEBSITE_HOME} className="hover:text-[var(--si-deep-brown)]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--si-deep-brown)]">{breadcrumb}</span>
          </nav>
          <p className="nn-label mb-3 text-[var(--si-burnt-orange)]">{eyebrow}</p>
          <h1 className="nn-display text-4xl font-light leading-[0.95] text-[var(--si-deep-brown)] sm:text-5xl lg:text-[3.4rem]">
            {h1}
          </h1>
        </div>
        {intro ? (
          <p className="max-w-xs text-sm font-light leading-relaxed text-[var(--si-muted)] lg:pb-1">
            {intro}
          </p>
        ) : null}
      </div>
    </header>
  );
}
