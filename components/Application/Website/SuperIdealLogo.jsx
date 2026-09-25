import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

export default function SuperIdealLogo({
  tone = "brand",
  className = "",
  link = true,
}) {
  const ink = tone === "light" ? "#F8E7D2" : "#C2410C";
  const sub = tone === "light" ? "#F3D7B5" : "#9A3412";

  const mark = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 64 72"
        aria-hidden="true"
        className="h-8 w-7 shrink-0 sm:h-11 sm:w-10"
      >
        <path
          d="M32 2.5c7 5.2 12.4 6.6 18.2 6.6 1.2 8.4.4 16.8-2.2 24.2-2.8 8-8 15.2-16 20.7-8-5.5-13.2-12.7-16-20.7-2.6-7.4-3.4-15.8-2.2-24.2C19.6 9.1 25 7.7 32 2.5Z"
          fill="none"
          stroke={ink}
          strokeWidth="2.2"
        />
        <path
          d="M18 22c2.4-1 5.2-1.6 8.2-1.6M46 22c-2.4-1-5.2-1.6-8.2-1.6"
          fill="none"
          stroke={ink}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M14 30c3.2 6.4 6.6 10.2 10.2 12.4M50 30c-3.2 6.4-6.6 10.2-10.2 12.4"
          fill="none"
          stroke={ink}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M32 16c2.2 3.4 3.4 6.6 3.4 9.6 0 4.6-1.6 8.2-3.4 11.2-1.8-3-3.4-6.6-3.4-11.2 0-3 1.2-6.2 3.4-9.6Z"
          fill={ink}
        />
        <circle cx="32" cy="22.5" r="2.1" fill={tone === "light" ? "#3B2416" : "#FFF8F1"} />
      </svg>
      <span className="leading-none">
        <span
          className="block font-display text-[13px] font-semibold tracking-[0.03em] sm:text-[17px]"
          style={{ color: ink }}
        >
          SUPER IDEAL
        </span>
        <span
          className="mt-1 block text-[8px] font-semibold tracking-[0.22em] sm:text-[9px]"
          style={{ color: sub }}
        >
          SWEETS & BAKERS
        </span>
      </span>
    </span>
  );

  if (!link) return mark;

  return (
    <Link href={WEBSITE_HOME} aria-label="Super Ideal Sweets & Bakers home" className="inline-flex">
      {mark}
    </Link>
  );
}
