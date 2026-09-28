import Image from "next/image";
import Link from "next/link";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLdBuilders";
import { absoluteUrl } from "@/lib/siteMeta";
import { WEBSITE_ABOUT, WEBSITE_HOME, WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const TITLE = "Our Story | Super Ideal Sweets & Bakers";
const DESCRIPTION =
  "Super Ideal Sweets & Bakers has prepared mithai, bakery, and celebration orders in Faisalabad since 1985.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords:
    "Super Ideal story, Super Ideal Sweets and Bakers, Faisalabad bakery since 1985, mithai",
  alternates: { canonical: absoluteUrl(WEBSITE_ABOUT) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(WEBSITE_ABOUT),
  },
};

const chapters = [
  {
    year: "1985",
    title: "The counter opens",
    text: "A shop in Faisalabad begins packing mithai and bakery for families who want the same taste each time they return.",
  },
  {
    year: "The bench",
    title: "Recipes learned by hand",
    text: "Desi ghee, dry fruit, and flour are prepared before the shutters go up. The method stays with the people who learned it here.",
  },
  {
    year: "Each morning",
    title: "Trays for the day",
    text: "Sweets and bakery are finished for that morning’s counter. Celebration cakes are completed in the shop for the order they belong to.",
  },
  {
    year: "Today",
    title: "The same return",
    text: "Eid boxes, wedding trays, birthdays, and an ordinary evening. The taste people come back for is the one set in 1985.",
  },
];

const habits = [
  {
    title: "Fresh for the morning",
    text: "The bench is reset for the day. What goes on the counter is prepared for that morning.",
  },
  {
    title: "Ingredients we will name",
    text: "Desi ghee, real dry fruit, and flour chosen for this shop. Nothing in the recipe is left unnamed.",
  },
  {
    title: "Closed like a gift",
    text: "Covered trays, a clean bench, and a box that leaves only when it is fit to hand over.",
  },
];

export default function OurStoryPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Our Story", url: WEBSITE_ABOUT },
  ]);

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Our Story",
    description: DESCRIPTION,
    url: absoluteUrl(WEBSITE_ABOUT),
    mainEntity: {
      "@type": "Bakery",
      name: "Super Ideal Sweets & Bakers",
      foundingDate: "1985",
      url: absoluteUrl("/"),
      image: absoluteUrl("/assets/home/si-storefront.png"),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Faisalabad",
        addressCountry: "PK",
      },
    },
  };

  return (
    <div className="overflow-x-hidden bg-[#FFF8F2] font-ui text-[#3a2416]">
      <SeoJsonLd data={breadcrumbJsonLd} />
      <SeoJsonLd data={aboutJsonLd} />

      <section className="lg:relative lg:min-h-[640px] lg:overflow-hidden">
        <div className="relative mt-[68px] h-[220px] sm:mt-[76px] sm:h-[280px] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
          <Image
            src="/assets/home/si-storefront.png"
            alt="Super Ideal Sweets and Bakers shopfront in Faisalabad"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_38%]"
          />
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#FFF8F2_0%,rgba(255,248,242,0.94)_30%,rgba(255,248,242,0.42)_54%,rgba(255,248,242,0)_74%)] lg:block" />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1680px] items-end px-4 pb-2 pt-6 sm:px-6 lg:min-h-[640px] lg:items-center lg:pb-16 lg:pt-24 xl:px-10">
          <div className="max-w-[560px]">
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[#6b5142]">
              <Link href={WEBSITE_HOME} className="hover:text-[#E45700]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-[#3a2416]">Our Story</span>
            </nav>
            <p className="font-script text-[2.15rem] leading-none text-[#E45700] sm:text-[2.6rem]">Since 1985</p>
            <h1 className="mt-1 font-display text-[3.1rem] font-semibold leading-[0.95] tracking-[-0.035em] text-[#2b1810] sm:text-[4.2rem] lg:text-[4.6rem]">
              Our Story
            </h1>
            <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed text-[#5c4336] sm:text-[16.5px]">
              A Faisalabad sweets and bakers house, still preparing mithai, bakery, and celebration orders the way the first counter did.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-8 w-full max-w-[1680px] px-4 sm:px-6 lg:-mt-16 xl:px-10">
        <div className="rounded-[22px] border border-[#f1e3d4] bg-white px-5 py-7 shadow-[0_18px_40px_rgba(75,46,30,0.07)] sm:px-8 sm:py-9 lg:px-12 lg:py-11">
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
            <p className="font-display text-[1.65rem] font-semibold leading-tight tracking-[-0.03em] text-[#2b1810] sm:text-[1.85rem]">
              Part of the family table since the first tray.
            </p>
            <div className="max-w-[46rem] space-y-4 text-[15px] leading-[1.8] text-[#5c4336] sm:text-[16px]">
              <p>
                Super Ideal Sweets &amp; Bakers opened in 1985 so families in Faisalabad could order sweets and bakery and find that taste again. The early years were spent at the bench: desi ghee in the pan, dry fruit prepared by hand, and trays ready before the shop opened.
              </p>
              <p>
                The recipes stayed with the people who learned them here. As the city kept asking for Super Ideal, the kitchen kept the same morning — preparation first, a full counter, and packing done with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 py-14 sm:px-6 sm:py-16 lg:py-20 xl:px-10">
        <div className="max-w-xl">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#E45700]">The house</p>
          <h2 className="mt-2 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[2.45rem]">
            From the first tray
          </h2>
        </div>

        <div className="relative mt-8 lg:mt-12">
          <div className="pointer-events-none absolute left-0 top-[5px] hidden h-px w-3/4 bg-[#ead9c6] lg:block" aria-hidden="true" />
          <ol className="lg:grid lg:grid-cols-4 lg:gap-8">
          {chapters.map((chapter, index) => (
            <li key={chapter.title} className="relative pb-8 pl-8 last:pb-0 lg:pb-0 lg:pl-0 lg:pt-8">
              <span
                className={`absolute left-[5px] top-2 w-px bg-[#ead9c6] lg:hidden ${index === chapters.length - 1 ? "h-2" : "bottom-0"}`}
                aria-hidden="true"
              />
              <span className="absolute left-0 top-[5px] z-[1] h-[11px] w-[11px] rounded-full bg-[#E45700] ring-4 ring-[#FFF8F2] lg:top-0" aria-hidden="true" />
              <p className="font-display text-[1.15rem] font-semibold text-[#E45700]">{chapter.year}</p>
              <h3 className="mt-1.5 font-display text-[1.25rem] font-semibold leading-tight">{chapter.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6b5142]">{chapter.text}</p>
            </li>
          ))}
          </ol>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-[1680px] items-center gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-14 lg:py-16 xl:px-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/assets/home/si-hero.png"
              alt="Sweets and bakery on the Super Ideal counter"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-[34rem]">
            <p className="font-script text-[2rem] leading-none text-[#E45700] sm:text-[2.25rem]">Before the doors</p>
            <h2 className="mt-2 font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2.5rem]">
              How a day in the shop begins
            </h2>
            <p className="mt-5 text-[15px] leading-[1.8] text-[#5c4336] sm:text-[16px]">
              Dough, syrup, and ghee are already in use when the counter opens. Biscuits and sweets are finished for that day. A celebration cake is completed for the family that ordered it, in the shop, for that occasion.
            </p>
            <p className="mt-4 text-[15px] leading-[1.8] text-[#5c4336] sm:text-[16px]">
              A box is closed when the packing is sound and the piece inside is the one that was asked for.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 py-14 sm:px-6 sm:py-16 lg:py-20 xl:px-10">
        <div className="max-w-xl">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#E45700]">What stayed</p>
          <h2 className="mt-2 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[2.45rem]">
            Three habits of the house
          </h2>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {habits.map((item) => (
            <article
              key={item.title}
              className="rounded-[22px] border border-[#f1e3d4] bg-white px-5 py-6 shadow-[0_8px_20px_rgba(75,46,30,0.04)]"
            >
              <span className="block h-1 w-10 rounded-full bg-[#E45700]" aria-hidden="true" />
              <h3 className="mt-4 font-display text-[1.35rem] font-semibold leading-tight">{item.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[#6b5142]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16 xl:px-10">
        <div className="relative mx-auto w-full max-w-[1680px] overflow-hidden rounded-[22px]">
          <div className="absolute inset-0">
            <Image
              src="/assets/home/si-hamper.png"
              alt=""
              fill
              sizes="(max-width: 1680px) 100vw, 1680px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#2b1810]/80" />
          </div>
          <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-xl">
              <p className="font-script text-[2.15rem] leading-none text-[#f0c36a] sm:text-[2.6rem]">More than sweets</p>
              <p className="mt-2 font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[2.55rem]">
                it&apos;s a feeling
              </p>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-white/75">
                Super Ideal Sweets &amp; Bakers, Faisalabad. The same counter standard since 1985.
              </p>
            </div>
            <Link
              href={WEBSITE_SHOP}
              className="inline-flex h-11 w-fit items-center rounded-full bg-[#E45700] px-6 text-[14px] font-bold text-white hover:bg-[#cf4c00]"
            >
              Order from the shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
