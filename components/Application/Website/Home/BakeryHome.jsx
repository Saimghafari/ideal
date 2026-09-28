import Image from "next/image";
import Link from "next/link";
import { branches } from "@/lib/locations";
import { WEBSITE_ABOUT, WEBSITE_CAKES, WEBSITE_CATERING, WEBSITE_CONTACT, WEBSITE_LOCATIONS, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const categories = [
  { name: "Sweets", image: "/assets/home/si-cat-sweets.png" },
  { name: "Cakes", image: "/assets/home/si-fudge-cake.png" },
  { name: "Bakery", image: "/assets/home/si-cat-bakery.png" },
  { name: "Pizzas", image: "/assets/home/si-pizza.png" },
  { name: "Snacks", image: "/assets/home/si-namak-pare.png" },
  { name: "Gift Boxes", image: "/assets/home/si-gift-box.png" },
  { name: "Catering", image: "/assets/home/si-cat-catering.png" },
  { name: "Seasonal", image: "/assets/home/si-kunafa.png" },
];

const featured = [
  { name: "Namak Pare", slug: "namak-pare", category: "Sweets", price: "Rs. 450", was: "Rs. 560", off: "-20%", image: "/assets/home/si-namak-pare.png" },
  { name: "Butter Biscuits", slug: "butter-biscuits", category: "Biscuits", price: "Rs. 380", was: "Rs. 480", off: "-20%", image: "/assets/home/si-butter-biscuits.png" },
  { name: "Dry Fruit Basket", slug: "dry-fruit-basket", category: "Gift Boxes", price: "Rs. 2,450", was: "Rs. 2,890", off: "-15%", image: "/assets/home/si-dry-fruit.png" },
  { name: "Soan Halwa", slug: "soan-halwa", category: "Sweets", price: "Rs. 650", was: "Rs. 780", off: "-15%", image: "/assets/home/si-soan-halwa.png" },
  { name: "Atta Biscuits", slug: "atta-biscuits", category: "Bakery", price: "Rs. 320", was: "Rs. 400", off: "-20%", image: "/assets/home/si-atta-biscuits.png" },
  { name: "Coconut Biscuits", slug: "coconut-biscuits", category: "Biscuits", price: "Rs. 290", was: "Rs. 360", off: "-20%", image: "/assets/home/si-coconut-biscuits.png" },
];

const fresh = [
  { name: "Kunafa", slug: "kunafa", category: "Sweets & Ramadan", price: "Rs. 1,200", image: "/assets/home/si-kunafa.png", today: true },
  { name: "Chocolate Fudge Cake", slug: "chocolate-fudge-cake", category: "Cakes", price: "Rs. 2,800", image: "/assets/home/si-fudge-cake.png" },
  { name: "Butter Croissants", slug: "butter-croissants", category: "Bakery", price: "Rs. 180", image: "/assets/home/si-croissants.png" },
  { name: "Special Pizza", slug: "special-pizza", category: "Pizza", price: "Rs. 1,450", image: "/assets/home/si-pizza.png", today: true },
  { name: "Assorted Pastries", slug: "assorted-pastries", category: "Bakery", price: "Rs. 950", image: "/assets/home/si-pastries.png" },
  { name: "Fruit Cream Cake", slug: "fruit-cream-cake", category: "Cakes", price: "Rs. 2,200", image: "/assets/home/si-fruit-cake.png", today: true },
];

const reasons = [
  { title: "Freshly Baked Daily", text: "Every tray leaves the oven the same morning it is packed.", icon: "oven" },
  { title: "Premium Ingredients", text: "Desi ghee, real dry fruit, and flour chosen for the shop.", icon: "leaf" },
  { title: "Hygienically Prepared", text: "Covered trays, clean benches, and careful packing.", icon: "shield" },
  { title: "Wide Variety", text: "Sweets, bakery, snacks, pizzas, and celebration cakes.", icon: "grid" },
];

const offers = [
  { title: "Family Combo Pack", text: "A sharing box of sweets, biscuits, and namkeen.", price: "Rs. 1,850", was: "Rs. 2,400", image: "/assets/home/si-gift-box.png" },
  { title: "Gift Hampers", text: "Ready boxes for Eid, weddings, and thank-you visits.", price: "From Rs. 1,200", image: "/assets/home/si-hamper.png" },
  { title: "Celebration Cakes", text: "Custom cakes finished in store for birthdays and mehndi.", price: "Made to order", image: "/assets/home/si-fruit-cake.png" },
];

const trust = ["Freshly baked daily", "Premium ingredients", "Made with care", "Trusted since 1985"];

function SectionHead({ title, href = WEBSITE_SHOP, action = "View All" }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
      <h2 className="font-display text-[1.45rem] font-semibold tracking-[-0.02em] text-[#3a2416] sm:text-[1.85rem]">
        {title}
      </h2>
      <Link href={href} className="shrink-0 text-[13px] font-bold text-[#E45700] hover:text-[#c2410c]">
        {action} →
      </Link>
    </div>
  );
}

function ReasonIcon({ name }) {
  const common = "h-6 w-6";
  if (name === "leaf") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M5 19C14 19 19 12 19 5c-7 0-14 5-14 14Z" strokeLinejoin="round" />
        <path d="M8 14c2-2 4.5-3.5 8-4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3.5 19 6.5v5.2c0 4.2-2.8 7.2-7 8.8-4.2-1.6-7-4.6-7-8.8V6.5L12 3.5Z" />
        <path d="m9 12 2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "grid") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 14h12M7 14V9.5A5 5 0 0 1 17 9.5V14" strokeLinecap="round" />
      <path d="M5 17.5h14M8 17.5V19M16 17.5V19" strokeLinecap="round" />
    </svg>
  );
}

function ProductCard({ item, online }) {
  const href = WEBSITE_PRODUCT_DETAILS(item.slug);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#f1e3d4] bg-white shadow-[0_6px_18px_rgba(75,46,30,0.05)]">
      <Link href={href} className="relative block aspect-square bg-[#f7efe6]">
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 50vw, 16vw" className="object-cover" />
        {item.off ? (
          <span className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#E45700] text-[11px] font-extrabold text-white">
            {item.off}
          </span>
        ) : null}
        {item.today ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#E45700] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
            Only Today
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2.5 sm:px-3">
        <p className="text-[11px] text-[#9a8170]">{item.category}</p>
        <Link href={href}>
          <h3 className="mt-0.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-[#3a2416] sm:text-[14.5px]">
            {item.name}
          </h3>
        </Link>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[13.5px] font-extrabold text-[#E45700]">{item.price}</span>
          {item.was ? <span className="text-[11.5px] text-[#b7a498] line-through">{item.was}</span> : null}
        </p>
        {online ? (
          <Link
            href={WEBSITE_SHOP}
            className="mt-2.5 inline-flex h-8 items-center justify-center rounded-full border border-[#E45700] text-[12px] font-bold text-[#E45700] hover:bg-[#E45700] hover:text-white"
          >
            Add to Cart
          </Link>
        ) : (
          <div className="mt-2.5">
            <p className="flex h-8 items-center justify-center rounded-full border border-[#efc4c4] bg-[#fff8f8] px-1 text-center text-[10.5px] font-bold text-[#d32f2f] sm:text-[11.5px]">
              Not Available Online
            </p>
            <p className="mt-1 text-center text-[11px] text-[#9a8170]">Available in Store</p>
          </div>
        )}
      </div>
    </article>
  );
}

export default function BakeryHome() {
  return (
    <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
      <section className="relative min-h-[540px] overflow-hidden lg:min-h-[600px]">
        <Image
          src="/assets/home/si-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#f6e6d2_0%,rgba(246,230,210,0.88)_18%,rgba(246,230,210,0.2)_36%,rgba(246,230,210,0)_48%)]" />
        <div className="relative mx-auto flex min-h-[520px] w-full max-w-[1680px] items-center px-4 py-12 sm:px-6 xl:px-10 lg:min-h-[560px]">
          <div className="max-w-[520px]">
            <h1 className="font-display text-[2.7rem] font-semibold leading-[0.98] tracking-[-0.03em] text-[#3a2416] sm:text-[3.6rem] lg:text-[4.15rem]">
              More than sweets
              <span className="mt-1 block italic">it&apos;s a feeling</span>
            </h1>
            <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-[#6b5142] sm:text-[16px]">
              From oven-warm trays to family sweet boxes, Super Ideal brings happiness to every occasion.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={WEBSITE_SHOP} className="inline-flex h-11 items-center rounded-full bg-[#E45700] px-6 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(228,87,0,0.28)] hover:bg-[#cf4c00]">
                Order Now
              </Link>
              <Link href={WEBSITE_ABOUT} className="inline-flex h-11 items-center rounded-full border-2 border-[#E45700] bg-white/70 px-6 text-[14px] font-bold text-[#E45700] hover:bg-white">
                Explore Our Story
              </Link>
            </div>
            <ul className="mt-5 flex max-w-[560px] flex-wrap gap-x-4 gap-y-2">
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[12.5px] font-semibold text-[#5c4032]">
                  <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E45700] text-white">
                    <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="m3.5 8.2 2.7 2.7 6.3-6.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="font-script pointer-events-none absolute right-[6%] top-[14%] hidden text-[2.4rem] text-[#f6e2b0] drop-shadow-[0_2px_8px_rgba(50,24,8,0.45)] lg:block xl:text-[2.8rem]">
          Happiness tastes better
        </p>
      </section>

      <section id="categories" className="scroll-mt-24 mx-auto w-full max-w-[1680px] px-4 py-9 sm:px-6 sm:py-11 xl:px-10">
        <SectionHead title="Our Categories" />
        <div className="-mx-3 flex gap-2.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-8 sm:gap-x-5 sm:overflow-visible sm:px-0">
          {categories.map((item) => (
            <Link key={item.name} href={item.name === "Cakes" ? WEBSITE_CAKES : item.name === "Catering" ? WEBSITE_CATERING : `${WEBSITE_SHOP}?category=${item.name === "Gift Boxes" ? "gift-boxes" : item.name === "Pizzas" ? "pizzas" : item.name.toLowerCase()}`} className="w-[78px] shrink-0 text-center sm:w-auto">
              <span className="relative mx-auto block aspect-square w-[78px] overflow-hidden rounded-full border-[3px] border-white shadow-[0_6px_16px_rgba(75,46,30,0.12)] sm:w-full sm:max-w-[118px]">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </span>
              <span className="mt-2 block text-[13px] font-semibold">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 xl:px-10">
        <div className="grid items-center gap-5 rounded-[22px] border border-[#f0dcc4] bg-[#fff1e4] px-4 py-4 sm:px-6 lg:grid-cols-[150px_minmax(0,1fr)_300px] lg:py-5">
          <div className="mx-auto flex h-28 w-40 items-center justify-center bg-transparent">
            <img src="/assets/home/si-delivery.png" alt="" className="h-full w-full object-contain" />
          </div>
          <div>
            <h2 className="font-display text-[1.45rem] font-semibold leading-tight text-[#3a2416] sm:text-[1.75rem]">
              Online Delivery Available on Selected Products Only
            </h2>
            <p className="mt-2 max-w-[540px] text-[13.5px] leading-relaxed text-[#6b5142]">
              You can order Sweets, Bakery, Biscuits, Snacks, Pizzas and Gift Boxes for home delivery.
              Fresh items like Cakes, Catering and some cream products are available in-store only.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-[#b7e0c2] bg-white px-3 py-2.5">
              <p className="flex items-center gap-2 text-[12.5px] font-bold text-[#1b7f3a]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1b7f3a] text-[11px] text-white">✓</span>
                Available for Online Delivery
              </p>
              <p className="mt-1 pl-7 text-[12px] leading-snug text-[#6b5142]">Sweets, Biscuits, Bakery, Snacks, Pizzas, Gift Boxes</p>
            </div>
            <div className="rounded-2xl border border-[#f0c2c2] bg-white px-3 py-2.5">
              <p className="flex items-center gap-2 text-[12.5px] font-bold text-[#c62828]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#c62828] text-[11px] text-white">✕</span>
                Not Available for Online Delivery
              </p>
              <p className="mt-1 pl-7 text-[12px] leading-snug text-[#6b5142]">Cakes, Catering, Fresh Cream Items</p>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-24 mx-auto w-full max-w-[1680px] px-4 py-9 sm:px-6 sm:py-11 xl:px-10">
        <SectionHead title="Featured Products (Online Delivery)" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-4">
          {featured.map((item) => (
            <ProductCard key={item.name} item={item} online />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 pb-9 sm:px-6 sm:pb-11 xl:px-10">
        <SectionHead title="Fresh Delights (Not Available for Online Delivery)" href={WEBSITE_CONTACT} action="Visit Us" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-4">
          {fresh.map((item) => (
            <ProductCard key={item.name} item={item} online={false} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 pb-9 sm:px-6 sm:pb-11 xl:px-10">
        <div className="grid overflow-hidden rounded-[22px] bg-[#2b1810] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-6 py-9 sm:px-10">
            <h2 className="font-display text-[2rem] font-semibold leading-tight text-white sm:text-[2.35rem]">
              Order Your Favorite Sweets Online
            </h2>
            <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/75">
              Packed boxes of biscuits, sweets, and snacks, ready for delivery across Faisalabad.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={WEBSITE_SHOP} className="inline-flex h-11 items-center rounded-full bg-[#E45700] px-6 text-[14px] font-bold text-white hover:bg-[#cf4c00]">
                Shop Online
              </Link>
              <Link href={WEBSITE_CONTACT} className="inline-flex h-11 items-center rounded-full border border-white/80 px-6 text-[14px] font-bold text-white hover:bg-white hover:text-[#2b1810]">
                Send a Custom Order
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-[#3a2418] p-4 sm:p-5">
            <div className="relative min-h-[180px] overflow-hidden rounded-2xl sm:min-h-[240px]">
              <Image src="/assets/home/si-gift-box.png" alt="Packed sweets gift box" fill className="object-cover" sizes="30vw" />
            </div>
            <div className="relative min-h-[180px] overflow-hidden rounded-2xl sm:min-h-[240px]">
              <Image src="/assets/home/si-packed-biscuits.png" alt="Packed bakery biscuits" fill className="object-cover" sizes="30vw" />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 bg-[#fff4ea]">
        <div className="mx-auto grid w-full max-w-[1680px] items-center gap-8 px-4 py-10 sm:px-6 xl:px-10 lg:grid-cols-2 lg:py-14">
          <div className="relative min-h-[280px] overflow-hidden rounded-[22px] sm:min-h-[360px]">
            <Image src="/assets/home/si-storefront.png" alt="Super Ideal sweets and bakers storefront" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b1810]/75 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 font-display text-[1.7rem] font-semibold leading-none text-white">
              SUPER IDEAL
              <span className="mt-1.5 block font-ui text-[11px] font-semibold tracking-[0.22em]">SWEETS & BAKERS</span>
            </p>
          </div>
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#E45700]">The house</p>
            <h2 className="mt-2 font-display text-[2rem] font-semibold sm:text-[2.45rem]">Our Story</h2>
            <p className="mt-4 text-[15px] leading-7 text-[#6b5142]">
              Since 1985, Super Ideal Sweets & Bakers has been part of Faisalabad family celebrations. We still bake, fry, and pack the way the first shop did — with ghee, dry fruit, and patience — and we now send selected boxes to your door.
            </p>
            <dl className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["55+", "Years of trust"],
                ["100+", "Delicious varieties"],
                ["10K+", "Happy customers"],
                ["5", "Branches"],
              ].map(([value, label]) => (
                <div key={label} className="border-t-2 border-[#E45700] pt-2.5">
                  <dt className="font-display text-[1.65rem] font-semibold leading-none text-[#E45700]">{value}</dt>
                  <dd className="mt-1.5 text-[12px] leading-snug text-[#6b5142]">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 py-9 sm:px-6 sm:py-11 xl:px-10">
        <h2 className="mb-6 text-center font-display text-[1.85rem] font-semibold sm:text-[2.1rem]">Why Choose Us</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item) => (
            <article key={item.title} className="rounded-[22px] border border-[#f1e3d4] bg-white px-5 py-6 text-center shadow-[0_8px_20px_rgba(75,46,30,0.04)]">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1e6] text-[#E45700]">
                <ReasonIcon name={item.icon} />
              </span>
              <h3 className="mt-3 text-[15.5px] font-bold">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#6b5142]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 pb-9 sm:px-6 sm:pb-11 xl:px-10">
        <div className="relative overflow-hidden rounded-[22px]">
          <Image src="/assets/home/si-storefront.png" alt="" fill className="object-cover" sizes="1180px" />
          <div className="absolute inset-0 bg-[#2b1810]/75" />
          <div className="relative px-4 py-9 sm:px-8 sm:py-11">
            <p className="text-center font-script text-[2.35rem] leading-none text-[#f0c36a]">Special Offers</p>
            <h2 className="mt-1 text-center font-display text-[1.7rem] font-semibold text-white sm:text-[2rem]">
              Make Every Occasion Sweeter
            </h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {offers.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-2xl bg-white shadow-lg">
                  <div className="relative h-36">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="360px" />
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="text-[16px] font-bold">{item.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#6b5142]">{item.text}</p>
                    <p className="mt-2 text-[14px] font-extrabold text-[#E45700]">
                      {item.price}
                      {item.was ? <span className="ml-2 text-[12px] font-medium text-[#b7a498] line-through">{item.was}</span> : null}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="locations" className="scroll-mt-24 mx-auto w-full max-w-[1680px] px-4 pb-14 sm:px-6 xl:px-10">
        <SectionHead title="Our Locations" href={WEBSITE_LOCATIONS} action="View all branches" />
        <div className="grid gap-4 md:grid-cols-3">
          {branches.map((branch) => (
            <article key={branch.name} className="overflow-hidden rounded-[22px] border border-[#f1e3d4] bg-white shadow-[0_10px_24px_rgba(75,46,30,0.06)]">
              <div className="relative h-44">
                <Image src={branch.image} alt={branch.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="px-4 py-4">
                <h3 className="text-[16px] font-bold">{branch.name}</h3>
                <p className="mt-1 text-[13px] text-[#6b5142]">{branch.address}</p>
                <p className="mt-1 text-[13px] font-semibold text-[#8a5a32]">{branch.hours}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.name} ${branch.address}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex h-9 items-center rounded-full bg-[#E45700] px-4 text-[12.5px] font-bold text-white hover:bg-[#cf4c00]"
                >
                  Get Directions
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
