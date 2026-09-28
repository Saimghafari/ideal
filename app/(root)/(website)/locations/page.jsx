import Image from "next/image";
import Link from "next/link";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { buildPageMeta } from "@/lib/buildPageMeta";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLdBuilders";
import {
  SHOP_EMAIL,
  SHOP_PHONE_DISPLAY,
  SHOP_PHONE_TEL,
  branches,
  directionsUrl,
} from "@/lib/locations";
import { absoluteUrl } from "@/lib/siteMeta";
import {
  WEBSITE_CAKES,
  WEBSITE_CATERING,
  WEBSITE_CONTACT,
  WEBSITE_HOME,
  WEBSITE_LOCATIONS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";

const TITLE = "Locations";
const DESCRIPTION =
  "Visit Super Ideal Sweets & Bakers in Faisalabad. Saddar Road, D Ground, and Clock Tower branches, with counter hours and directions.";

export const metadata = buildPageMeta({
  title: TITLE,
  description: DESCRIPTION,
  path: WEBSITE_LOCATIONS,
  keywords: "Super Ideal locations, Saddar Road, D Ground, Clock Tower, Faisalabad bakery",
});

const visitNotes = [
  {
    title: "Fresh counter",
    text: "Sweets, bakery, and biscuits are prepared for the shop each day.",
  },
  {
    title: "Celebration cakes",
    text: "Cakes are finished in store for birthdays, mehndi, and other orders.",
  },
  {
    title: "Selected delivery",
    text: "Packed boxes can be sent across Faisalabad. Ask which items travel.",
  },
];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="10.5" r="2.1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.2l2.6 1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LocationsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Locations", url: WEBSITE_LOCATIONS },
  ]);

  const placesJsonLd = {
    "@context": "https://schema.org",
    "@graph": branches.map((branch) => ({
      "@type": "Bakery",
      name: `Super Ideal Sweets & Bakers — ${branch.name}`,
      image: absoluteUrl(branch.image),
      url: absoluteUrl(`${WEBSITE_LOCATIONS}#${branch.id}`),
      telephone: SHOP_PHONE_TEL,
      email: SHOP_EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: branch.short,
        addressLocality: "Faisalabad",
        addressCountry: "PK",
      },
      parentOrganization: {
        "@type": "Organization",
        name: "Super Ideal Sweets & Bakers",
      },
    })),
  };

  return (
    <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
      <SeoJsonLd data={breadcrumbJsonLd} />
      <SeoJsonLd data={placesJsonLd} />

      <header>
        <div className="relative h-[220px] overflow-hidden sm:h-[270px] lg:h-[320px]">
          <Image
            src="/assets/home/si-storefront.png"
            alt="Super Ideal bakery storefront with cakes and sweets in the window"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_42%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(43,24,16,0.86)_0%,rgba(43,24,16,0.58)_42%,rgba(43,24,16,0.18)_72%)]" />
          <div className="relative mx-auto flex h-full w-full max-w-[1680px] flex-col justify-end px-4 pb-6 pt-5 sm:justify-center sm:px-6 sm:pb-8 xl:px-10">
            <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-white/75 sm:mb-3">
              <Link href={WEBSITE_HOME} className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">›</span>
              <span className="font-medium text-white">Locations</span>
            </nav>
            <p className="font-script text-[1.85rem] leading-none text-[#f0c36a] sm:text-[2.2rem]">Visit the counter</p>
            <h1 className="mt-1 font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[2.6rem] lg:text-[3.15rem]">
              Our Locations
            </h1>
            <p className="mt-2 max-w-[520px] text-[13.5px] leading-relaxed text-white/85 sm:text-[15.5px]">
              Three Super Ideal branches in Faisalabad. Same sweets, bakery, and cakes — different hours and streets.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1680px] px-4 pb-2 pt-6 sm:px-6 sm:pt-8 xl:px-10">
        <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-script text-[1.65rem] leading-none text-[#E45700] sm:text-[1.9rem]">Faisalabad</p>
            <h2 className="mt-1 font-display text-[1.4rem] font-semibold tracking-[-0.02em] sm:text-[1.7rem]">
              Choose a branch
            </h2>
          </div>
          <p className="max-w-md text-[13.5px] leading-relaxed text-[#8a6754]">
            Hours are the counter times for each shop. Call the shop line if you are collecting a cake.
          </p>
        </div>

        <nav aria-label="Branches" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {branches.map((branch, index) => (
            <a
              key={branch.id}
              href={`#${branch.id}`}
              className="group flex items-center gap-3 rounded-[18px] border border-[#ead9c6] bg-white px-4 py-3.5 shadow-[0_8px_18px_rgba(75,46,30,0.05)] transition hover:border-[#E45700] sm:block sm:px-4 sm:py-4"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1e6] text-[12px] font-extrabold tracking-[0.08em] text-[#E45700] sm:h-auto sm:w-auto sm:bg-transparent sm:p-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[1.05rem] font-semibold leading-tight group-hover:text-[#E45700] sm:mt-1 sm:text-[1.2rem]">
                  {branch.short}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-[#6b5142] sm:mt-1 sm:text-[13px]">{branch.hours}</span>
              </span>
            </a>
          ))}
        </nav>
      </section>

      <section className="mx-auto w-full max-w-[1680px] space-y-5 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8 xl:px-10">
        {branches.map((branch, index) => {
          const imageFirst = index % 2 === 0;
          return (
            <article
              key={branch.id}
              id={branch.id}
              className="scroll-mt-28 overflow-hidden rounded-[22px] border border-[#f1e3d4] bg-white shadow-[0_12px_28px_rgba(75,46,30,0.06)]"
            >
              <div className="grid lg:grid-cols-2">
                <div className={`relative min-h-[220px] sm:min-h-[280px] lg:min-h-[380px] ${imageFirst ? "" : "lg:order-2"}`}>
                  <Image
                    src={branch.image}
                    alt={`${branch.name}, Super Ideal Sweets and Bakers`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-extrabold tracking-[0.16em] text-[#E45700]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#E45700]">
                    Branch {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.05rem]">
                    {branch.name}
                  </h2>
                  <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[#6b5142] sm:text-[15px]">
                    {branch.summary}
                  </p>

                  <dl className="mt-5 space-y-3 text-[14px] sm:text-[15px]">
                    <div className="flex gap-3">
                      <dt className="mt-0.5 text-[#E45700]">
                        <PinIcon />
                        <span className="sr-only">Address</span>
                      </dt>
                      <dd>
                        <span className="block font-semibold">{branch.address}</span>
                        <span className="text-[13px] text-[#8a6754]">Pakistan</span>
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="mt-0.5 text-[#E45700]">
                        <ClockIcon />
                        <span className="sr-only">Hours</span>
                      </dt>
                      <dd>
                        <span className="block font-semibold">{branch.hours}</span>
                        <span className="text-[13px] text-[#8a6754]">Counter hours</span>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                    <a
                      href={directionsUrl(branch)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#E45700] px-5 text-[13.5px] font-bold text-white hover:bg-[#cf4c00]"
                    >
                      Get Directions
                    </a>
                    <a
                      href={`tel:${SHOP_PHONE_TEL}`}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-[#ead9c6] bg-[#FFF8F2] px-5 text-[13.5px] font-bold text-[#3a2416] hover:border-[#E45700]"
                    >
                      Call {SHOP_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 pb-6 sm:px-6 xl:px-10">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {visitNotes.map((item) => (
            <article key={item.title} className="rounded-[20px] border border-[#f1e3d4] bg-white px-5 py-5 shadow-[0_8px_18px_rgba(75,46,30,0.04)]">
              <h3 className="font-display text-[1.2rem] font-semibold">{item.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[#6b5142]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 pb-14 sm:px-6 xl:px-10">
        <div className="overflow-hidden rounded-[22px] bg-[#3B2416] px-5 py-8 text-[#f6e7d6] sm:px-8 sm:py-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="font-script text-[2rem] leading-none text-[#f0c36a] sm:text-[2.35rem]">Before you come</p>
              <h2 className="mt-1 font-display text-[1.7rem] font-semibold text-white sm:text-[2.1rem]">
                One shop line for every branch
              </h2>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[#f6e7d6]/80 sm:text-[15px]">
                Use the same number and email for Saddar Road, D Ground, and Clock Tower. Tell us which branch you are visiting.
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Link
                  href={WEBSITE_CONTACT}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#E45700] px-5 text-[13.5px] font-bold text-white hover:bg-[#cf4c00]"
                >
                  Contact the shop
                </Link>
                <Link
                  href={WEBSITE_SHOP}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 px-5 text-[13.5px] font-bold text-white hover:border-[#f0c36a] hover:text-[#f0c36a]"
                >
                  Browse products
                </Link>
              </div>
            </div>
            <ul className="space-y-3 text-[14.5px] sm:text-[15px]">
              <li>
                <a href={`tel:${SHOP_PHONE_TEL}`} className="font-semibold text-white hover:text-[#f0c36a]">
                  {SHOP_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${SHOP_EMAIL}`} className="break-all font-semibold text-white hover:text-[#f0c36a]">
                  {SHOP_EMAIL}
                </a>
              </li>
              <li className="text-[#f6e7d6]/75">Saddar Road, Faisalabad, Pakistan</li>
              <li className="flex flex-wrap gap-x-4 gap-y-1 text-[13.5px]">
                <Link href={WEBSITE_CAKES} className="underline decoration-white/30 underline-offset-4 hover:text-white">
                  Cakes
                </Link>
                <Link href={WEBSITE_CATERING} className="underline decoration-white/30 underline-offset-4 hover:text-white">
                  Catering
                </Link>
                <Link href={WEBSITE_SHOP} className="underline decoration-white/30 underline-offset-4 hover:text-white">
                  Products
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
