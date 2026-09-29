import Link from "next/link";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { buildPageMeta } from "@/lib/buildPageMeta";

export const metadata = buildPageMeta({
  title: "Freshness Guide",
  description:
    "How to store Super Ideal sweets, biscuits, cakes, and fresh bakery.",
  path: "/care-guide",
});

const notes = [
  {
    title: "Dry sweets",
    text: "Keep mithai and halwa in a sealed box, away from heat and moisture. Finish within a few days.",
  },
  {
    title: "Biscuits",
    text: "Store in an airtight tin. They stay crisp longest when the lid is closed after each serving.",
  },
  {
    title: "Fresh bakery",
    text: "Croissants and pastries are best the day they are baked. Do not refrigerate flaky pastry.",
  },
  {
    title: "Cakes & kunafa",
    text: "Keep cream cakes and kunafa chilled. Eat the same day they leave the counter.",
  },
];

export default function CareGuidePage() {
  return (
    <div className="nn-cream-bg min-h-[70vh] px-6 py-16 sm:px-10 lg:px-28">
      <p className="nn-label mb-4 text-[var(--si-burnt-orange)]">Keeping it fresh</p>
      <h1 className="nn-display text-4xl font-light sm:text-5xl">Freshness guide</h1>
      <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-[var(--si-muted)]">
        Super Ideal sweets and bakery are made to be eaten fresh. These notes
        cover how to store what you take home.
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
        Shop sweets
      </Link>
    </div>
  );
}
