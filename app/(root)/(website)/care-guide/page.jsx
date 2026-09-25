import Link from "next/link";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { buildPageMeta } from "@/lib/buildPageMeta";

export const metadata = buildPageMeta({
  title: "Care Guide",
  description:
    "How to care for Velora clothing — silk, wool, cashmere, and leather.",
  path: "/care-guide",
});

const notes = [
  {
    title: "Silk",
    text: "Cool hand wash or dry clean. Hang to dry. Keep away from sharp jewellery.",
  },
  {
    title: "Wool & cashmere",
    text: "Fold knits. Dry clean or wash cool and flat. Never tumble dry.",
  },
  {
    title: "Cotton & linen",
    text: "Warm wash, low iron. Linen looks better with a little crease.",
  },
  {
    title: "Leather",
    text: "Keep dry. Wipe with a soft cloth. Condition once or twice a year.",
  },
];

export default function CareGuidePage() {
  return (
    <div className="nn-cream-bg min-h-[70vh] px-6 py-16 sm:px-10 lg:px-28">
      <p className="nn-label mb-4 text-[var(--si-burnt-orange)]">Looking after it</p>
      <h1 className="nn-display text-4xl font-light sm:text-5xl">Care guide</h1>
      <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-[var(--si-muted)]">
        Follow the label in each garment. These notes cover the fabrics we use
        most.
      </p>
      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        {notes.map((item) => (
          <div key={item.title}>
            <h2 className="nn-display text-2xl font-light">{item.title}</h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-[var(--si-muted)]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
      <Link href={WEBSITE_SHOP} className="nn-btn-primary mt-14 inline-flex">
        Shop clothing
      </Link>
    </div>
  );
}
