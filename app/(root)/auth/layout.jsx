import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/components/Application/Website/BrandLogo";
import { SITE_URL } from "@/lib/siteMeta";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

export const metadata = {
  title: "Account",
  description:
    "Sign in or create a Super Ideal Sweets & Bakers account to order sweets, bakery, and gift boxes.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/auth/login` },
};

const notes = [
  "Fresh trays each morning",
  "Gift boxes and celebration cakes",
  "Trusted in Faisalabad since 1969",
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-dvh bg-[#FFF8F2] font-ui text-[#3a2416]">
      <div className="lg:grid lg:min-h-dvh lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
        <aside className="relative h-[148px] overflow-hidden sm:h-[190px] lg:h-auto lg:min-h-dvh">
          <Image
            src="/assets/home/si-storefront.png"
            alt="Super Ideal Sweets and Bakers storefront"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 54vw"
            className="object-cover object-[center_72%] lg:object-[center_78%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(58,36,22,0.18)_0%,rgba(58,36,22,0.28)_38%,rgba(58,36,22,0.82)_100%)] lg:bg-[linear-gradient(180deg,rgba(58,36,22,0.12)_0%,rgba(58,36,22,0.22)_42%,rgba(42,24,14,0.88)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-8 sm:pb-7 lg:px-12 lg:pb-12">
            <p className="font-script text-[1.7rem] leading-none text-[#FFD7A8] sm:text-[2.1rem] lg:text-[2.6rem]">
              More than sweets
            </p>
            <p className="mt-1 font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[1.7rem] lg:mt-2 lg:text-[2.35rem]">
              it&apos;s a feeling
            </p>
            <ul className="mt-3 hidden max-w-md flex-col gap-2 lg:mt-7 lg:flex">
              {notes.map((note) => (
                <li key={note} className="flex items-center gap-2.5 text-[14px] font-semibold text-[#FFF2E1]">
                  <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#E45700] text-[11px] text-white">
                    ✓
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="flex min-h-[calc(100dvh-148px)] flex-col sm:min-h-[calc(100dvh-190px)] lg:min-h-dvh">
          <header className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-8 sm:pt-6 lg:px-10 lg:pt-8">
            <BrandLogo size="auth" />
            <Link
              href={WEBSITE_HOME}
              className="shrink-0 text-[13px] font-bold text-[#E45700] hover:text-[#c2410c]"
            >
              Back to shop
            </Link>
          </header>

          <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
            <div className="w-full max-w-[460px] rounded-[28px] border border-[#f1e3d4] bg-white px-5 py-7 shadow-[0_16px_40px_rgba(75,46,30,0.07)] sm:px-8 sm:py-9">
              {children}
            </div>
          </main>

          <p className="px-4 pb-5 text-center text-[12px] font-semibold tracking-[0.04em] text-[#9a8170] sm:pb-6">
            Super Ideal Sweets &amp; Bakers · Faisalabad · Since 1969
          </p>
        </section>
      </div>
    </div>
  );
}
