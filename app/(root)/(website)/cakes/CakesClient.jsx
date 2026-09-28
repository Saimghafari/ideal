"use client";

import ProductBox from "@/components/Application/Website/ProductBox";
import useFetch from "@/hooks/useFetch";
import { SHOP_CATEGORIES } from "@/lib/staticCatalog";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STYLE_ART = {
  "chocolate-cakes": "/assets/home/si-fudge-cake.png",
  "fruit-cakes": "/assets/home/si-fruit-cake.png",
};

const STYLE_NOTE = {
  "chocolate-cakes": "Dense chocolate cakes finished at the counter.",
  "fruit-cakes": "Fresh cream cakes with seasonal fruit.",
};

const FALLBACK_CAKES = SHOP_CATEGORIES.find((item) => item.slug === "cakes");

const productKeys = (product) =>
  [product?.category?.slug, product?.category?.parentSlug, ...(product?.tags || [])]
    .filter(Boolean)
    .map((item) => String(item).trim().toLowerCase());

const matchesStyle = (product, slug) => productKeys(product).includes(String(slug).toLowerCase());

const CakeSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-[18px] border border-[#f1e3d4] bg-white">
    <div className="aspect-square bg-[#f3e6d8]" />
    <div className="space-y-2 px-3 py-3">
      <div className="h-2.5 w-16 rounded-full bg-[#f3e6d8]" />
      <div className="h-4 w-4/5 rounded-full bg-[#f3e6d8]" />
      <div className="h-3 w-1/3 rounded-full bg-[#f3e6d8]" />
      <div className="h-8 rounded-full bg-[#f3e6d8]" />
    </div>
  </div>
);

const CakesClient = () => {
  const { data: categoryResponse } = useFetch("/api/category/get-category");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStyle, setActiveStyle] = useState("all");

  const categories =
    categoryResponse?.success && categoryResponse.data?.length
      ? categoryResponse.data
      : SHOP_CATEGORIES;

  const cakesCategory =
    categories.find((item) => String(item.slug || "").toLowerCase() === "cakes") || FALLBACK_CAKES;

  const styles = cakesCategory?.children || [];

  useEffect(() => {
    let ignore = false;

    const loadCakes = async () => {
      setLoading(true);
      setError("");
      try {
        const collected = [];
        let page = 0;

        for (let guard = 0; guard < 30; guard += 1) {
          const { data } = await axios.get(
            `/api/shop?page=${page}&limit=24&sort=default_sorting&category=cakes`
          );
          if (!data?.success) {
            throw new Error(data?.message || "Could not load cakes");
          }
          collected.push(...(data.data?.products || []));
          const next = data.data?.nextPage;
          if (next == null) break;
          page = next;
        }

        if (!ignore) setProducts(collected);
      } catch (err) {
        if (!ignore) setError(err.message || "Could not load cakes");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadCakes();
    return () => {
      ignore = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const used = new Set();
    const sections = styles.map((style) => {
      const items = products.filter((product) => matchesStyle(product, style.slug));
      items.forEach((product) => used.add(product._id));
      return { ...style, products: items };
    });
    const other = products.filter((product) => !used.has(product._id));
    return { sections, other };
  }, [products, styles]);

  const visibleSections = useMemo(() => {
    if (activeStyle === "all") {
      const named = grouped.sections.filter((section) => section.products.length > 0);
      if (grouped.other.length) {
        named.push({
          name: "More from the counter",
          slug: "more-cakes",
          products: grouped.other,
        });
      }
      if (!named.length && products.length) {
        return [{ name: "All cakes", slug: "all-cakes", products }];
      }
      return named;
    }

    const selected = grouped.sections.find((section) => section.slug === activeStyle);
    return selected ? [selected] : [];
  }, [activeStyle, grouped, products]);

  const countFor = (slug) =>
    slug === "all" ? products.length : products.filter((product) => matchesStyle(product, slug)).length;

  const artFor = (style) => {
    const section = grouped.sections.find((item) => item.slug === style.slug);
    return (
      STYLE_ART[style.slug] ||
      section?.products?.[0]?.media?.[0]?.secure_url ||
      cakesCategory?.image ||
      "/assets/home/si-fudge-cake.png"
    );
  };

  const productGrid = "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-4";

  return (
    <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
      <header>
        <div className="relative h-[200px] overflow-hidden sm:h-[250px] lg:h-[280px]">
          <Image
            src="/assets/home/si-fudge-cake.png"
            alt="Chocolate celebration cake from Super Ideal Sweets and Bakers"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_32%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(43,24,16,0.82)_0%,rgba(43,24,16,0.55)_38%,rgba(43,24,16,0.12)_68%)]" />
          <div className="relative mx-auto flex h-full w-full max-w-[1680px] flex-col justify-end px-4 pb-6 pt-5 sm:justify-center sm:px-6 sm:pb-8 xl:px-10">
            <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-white/75 sm:mb-3">
              <Link href={WEBSITE_HOME} className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">›</span>
              <span className="font-medium text-white">Cakes</span>
            </nav>
            <h1 className="font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[2.6rem] lg:text-[3rem]">
              Cakes
            </h1>
            <p className="mt-2 max-w-[460px] text-[13.5px] leading-relaxed text-white/85 sm:text-[15px]">
              Celebration cakes from the Super Ideal counter, arranged by style.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1680px] px-4 pb-2 pt-6 sm:px-6 sm:pt-8 xl:px-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-script text-[1.65rem] leading-none text-[#E45700] sm:text-[1.9rem]">From the counter</p>
            <h2 className="mt-1 font-display text-[1.4rem] font-semibold tracking-[-0.02em] sm:text-[1.7rem]">
              Cake styles
            </h2>
          </div>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-[#8a6754]">
            Only cakes are shown here. Choose a style, or stay on the full counter.
          </p>
        </div>

        <div className="mt-5 overflow-x-auto overscroll-x-contain pb-2 pt-1" aria-label="Cake styles">
          <div className="flex w-max gap-3 px-1">
          <button
            type="button"
            onClick={() => setActiveStyle("all")}
            aria-pressed={activeStyle === "all"}
            className={`flex h-[168px] w-[168px] shrink-0 flex-col justify-end rounded-[22px] bg-[#4B2E1E] p-4 text-left text-white shadow-[0_10px_24px_rgba(75,46,30,0.12)] sm:h-[188px] sm:w-[220px] lg:h-[200px] lg:w-[250px] xl:w-[280px] ${
              activeStyle === "all" ? "ring-2 ring-[#E45700]" : ""
            }`}
          >
            <span className="font-script text-[1.45rem] leading-none text-[#FFB347] sm:text-[1.7rem]">Entire counter</span>
            <span className="mt-2 font-display text-[1.25rem] font-semibold leading-none sm:text-[1.45rem]">All cakes</span>
            <span className="mt-2 text-[12px] text-white/75">
              {loading ? "Loading" : `${countFor("all")} ${countFor("all") === 1 ? "cake" : "cakes"}`}
            </span>
          </button>

          {styles.map((style) => {
            const active = activeStyle === style.slug;
            const count = countFor(style.slug);
            return (
              <button
                key={style.slug}
                type="button"
                onClick={() => setActiveStyle(style.slug)}
                aria-pressed={active}
                className={`group relative h-[168px] w-[168px] shrink-0 overflow-hidden rounded-[22px] text-left shadow-[0_10px_24px_rgba(75,46,30,0.08)] sm:h-[188px] sm:w-[220px] lg:h-[200px] lg:w-[250px] xl:w-[280px] ${
                  active ? "ring-2 ring-[#E45700]" : ""
                }`}
              >
                <Image
                  src={artFor(style)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(43,24,16,0.05)_20%,rgba(43,24,16,0.78)_100%)]" />
                <span className="relative flex h-full flex-col justify-end p-4">
                  <span className="font-display text-[1.15rem] font-semibold leading-tight text-white sm:text-[1.35rem]">
                    {style.name}
                  </span>
                  <span className="mt-1 text-[12px] text-white/80">
                    {loading ? "Loading" : `${count} ${count === 1 ? "cake" : "cakes"}`}
                  </span>
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] space-y-10 px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
        {loading && (
          <div className={productGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <CakeSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[22px] bg-white px-6 py-16 text-center">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#E45700]">Unavailable</p>
            <p className="mt-2 font-display text-[1.6rem] font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && visibleSections.length === 0 && (
          <div className="rounded-[22px] border border-[#f1e3d4] bg-white px-6 py-16 text-center">
            <h2 className="font-display text-[1.8rem] font-semibold">Nothing in this style yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-[14px] text-[#8a6754]">
              This cake style is on the menu. Ask at the Super Ideal counter for today’s finish.
            </p>
            <button
              type="button"
              onClick={() => setActiveStyle("all")}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[#E45700] px-6 text-[14px] font-bold text-white hover:bg-[#cf4c00]"
            >
              View all cakes
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          visibleSections.map((section) => (
            <div key={section.slug}>
              <div className="mb-4 flex flex-col gap-2 border-b border-[#f1e3d4] pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#E45700]">
                    {section.slug === "more-cakes" ? "Also on the counter" : "Subcategory"}
                  </p>
                  <h2 className="mt-1 font-display text-[1.35rem] font-semibold tracking-[-0.02em] sm:text-[1.6rem]">
                    {section.name}
                  </h2>
                  {STYLE_NOTE[section.slug] ? (
                    <p className="mt-1 max-w-md text-[13px] leading-relaxed text-[#8a6754]">{STYLE_NOTE[section.slug]}</p>
                  ) : null}
                </div>
                <p className="text-[13px] font-semibold text-[#8a6754]">
                  {section.products.length} {section.products.length === 1 ? "cake" : "cakes"}
                </p>
              </div>
              {section.products.length > 0 ? (
                <div className={productGrid}>
                  {section.products.map((product) => (
                    <ProductBox key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="rounded-[18px] border border-dashed border-[#ead9c6] bg-white px-4 py-8 text-center text-[14px] text-[#8a6754]">
                  No cakes in this style are listed right now.
                </p>
              )}
            </div>
          ))}
      </section>
    </div>
  );
};

export default CakesClient;
