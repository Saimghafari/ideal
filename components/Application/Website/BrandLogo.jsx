import Image from "next/image";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import { BRAND_NAME } from "@/lib/siteMeta";

const SIZES = {
  header: "h-8 sm:h-9 w-auto max-w-[170px] sm:max-w-[210px]",
  desktop: "h-12 lg:h-[3.35rem] w-auto max-w-[280px]",
  footer: "h-10 sm:h-12 w-auto max-w-[240px]",
  auth: "h-11 w-auto max-w-[220px]",
  loading: "h-12 w-auto max-w-[240px]",
};

export default function BrandLogo({
  size = "header",
  link = true,
  className = "",
  variant = "horizontal",
}) {
  const src =
    variant === "icon"
      ? "/assets/images/logo-icon.png"
      : "/assets/images/logo.png";

  const mark = (
    <Image
      src={src}
      alt={BRAND_NAME}
      width={1036}
      height={351}
      className={`${SIZES[size] || SIZES.header} object-contain object-left ${className}`}
      priority={size === "header" || size === "desktop"}
    />
  );

  if (!link) return mark;

  return (
    <Link
      href={WEBSITE_HOME}
      className="inline-flex items-center"
      aria-label={`${BRAND_NAME} home`}
    >
      {mark}
    </Link>
  );
}
