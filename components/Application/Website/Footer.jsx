import Link from "next/link";
import {
  WEBSITE_ABOUT,
  WEBSITE_CONTACT,
  WEBSITE_HOME,
  WEBSITE_SHOP,
  WEBSITE_CAKES,
  WEBSITE_CATERING,
  WEBSITE_LOCATIONS,
} from "@/routes/WebsiteRoute";
import Image from "next/image";

const quickLinks = [
  { label: "Home", href: WEBSITE_HOME },
  { label: "Our Story", href: WEBSITE_ABOUT },
  { label: "Products", href: WEBSITE_SHOP },
  { label: "Cakes", href: WEBSITE_CAKES },
  { label: "Catering", href: WEBSITE_CATERING },
  { label: "Locations", href: WEBSITE_LOCATIONS },
  { label: "Contact", href: WEBSITE_CONTACT },
];

const products = [
  { label: "Sweets", href: `${WEBSITE_SHOP}?category=sweets` },
  { label: "Bakery", href: `${WEBSITE_SHOP}?category=bakery` },
  { label: "Cakes", href: WEBSITE_CAKES },
  { label: "Snacks", href: `${WEBSITE_SHOP}?category=snacks` },
  { label: "Gift Boxes", href: `${WEBSITE_SHOP}?category=gift%20boxes` },
  { label: "Pizzas", href: `${WEBSITE_SHOP}?category=pizzas` },
];

const socials = [
  { label: "Facebook", path: "M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v9h4v-9h3.2l.8-4H13V9c0-.6.4-1 1-1Z" },
  { label: "Instagram", path: "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm-4 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2ZM17.2 7.1a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" },
  { label: "WhatsApp", path: "M12 3.2A8.7 8.7 0 0 0 4.6 16.3L3.4 20.6l4.4-1.1A8.8 8.8 0 1 0 12 3.2Zm4.8 12.3c-.2.6-1.2 1.1-1.7 1.1-.4.1-.9.1-1.5-.1-.3-.1-.8-.3-1.4-.6-2.4-1-4-3.5-4.1-3.7-.2-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4.5-.4.7-.4h.5c.2 0 .4 0 .5.4.2.6.7 2 .7 2.1s.1.3 0 .5-.2.4-.4.6-.3.4-.5.6-.2.4 0 .7c.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5s.5.1.6-.1.7-.8.9-1.1.4-.2.6-.1 1.6.8 1.9.9.4.2.5.4.1.6 0 1.2Z" },
];

function SocialIcons({ className = "" }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {socials.map((item) => (
        <a
          key={item.label}
          href={WEBSITE_CONTACT}
          aria-label={item.label}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white hover:border-[#f0c36a] hover:text-[#f0c36a]"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d={item.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

const Footer = () => {
  const year = new Date().getFullYear();
  const linkClass = "block text-[13px] leading-snug text-[#f6e7d6]/75 transition-colors hover:text-white sm:text-[14px]";

  return (
    <footer className="bg-[#3B2416] font-ui text-[#f6e7d6]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-2 gap-x-6 gap-y-5 px-4 py-7 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-8 lg:py-14 xl:px-10">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <Image
              src="/assets/home/logo-light.png"
              alt="Super Ideal Sweets & Bakers"
              width={1036}
              height={351}
              className="h-11 w-auto sm:h-14"
            />
            <SocialIcons className="lg:hidden" />
          </div>
          <p className="mt-3 max-w-[220px] font-script text-[1.65rem] leading-none text-[#f0c36a] sm:mt-5 sm:text-[2.15rem]">
            More than sweets it&apos;s a feeling
          </p>
          <SocialIcons className="mt-4 hidden lg:flex" />
        </div>

        <div>
          <p className="mb-2 text-[14px] font-bold text-white sm:mb-4 sm:text-[15px]">Quick Links</p>
          <ul className="space-y-1.5 sm:space-y-2.5">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-[14px] font-bold text-white sm:mb-4 sm:text-[15px]">Our Products</p>
          <ul className="space-y-1.5 sm:space-y-2.5">
            {products.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <p className="mb-2 text-[14px] font-bold text-white sm:mb-4 sm:text-[15px]">Contact Us</p>
          <ul className="space-y-1 text-[13px] leading-snug text-[#f6e7d6]/75 sm:space-y-2.5 sm:text-[14px] sm:leading-relaxed">
            <li>
              <a href="tel:+923001234567" className="hover:text-white">
                +92 300 1234567
              </a>
            </li>
            <li>
              <a href="mailto:info@superideal.com" className="hover:text-white">
                info@superideal.com
              </a>
            </li>
            <li>Saddar Road, Faisalabad, Pakistan</li>
            <li>Mon – Sat: 9:00 AM – 10:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-1 px-4 py-3 text-[12px] text-[#f6e7d6]/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 sm:text-[12.5px] xl:px-10">
          <p>© {year} Super Ideal Sweets & Bakers. All Rights Reserved.</p>
          <p>A Sweetsmith · Warmly crafted</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
