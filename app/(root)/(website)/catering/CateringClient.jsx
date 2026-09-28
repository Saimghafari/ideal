"use client";

import ProductBox from "@/components/Application/Website/ProductBox";
import useFetch from "@/hooks/useFetch";
import { getStaticProducts, SHOP_CATEGORIES } from "@/lib/staticCatalog";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const FALLBACK_CATERING = SHOP_CATEGORIES.find((item) => item.slug === "catering");
const HERO_IMAGE = "/assets/home/si-cat-catering.png";

const dummyCateringProducts = () =>
  getStaticProducts().filter((item) =>
    (item.tags || []).some((tag) => String(tag).toLowerCase() === "catering")
  );

const isCateringCategory = (item) => {
  const slug = String(item?.slug || "").trim().toLowerCase();
  const name = String(item?.name || "").trim().toLowerCase();
  return slug === "catering" || slug === "caterings" || name === "catering" || name === "caterings";
};

const productKeys = (product) =>
  [product?.category?.slug, product?.category?.parentSlug, ...(product?.tags || [])]
    .filter(Boolean)
    .map((item) => String(item).trim().toLowerCase());

const matchesStyle = (product, slug) => productKeys(product).includes(String(slug).toLowerCase());

const CateringSkeleton = () => (
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

const CateringClient = () => {
  const { data: categoryResponse } = useFetch("/api/category/get-category");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [activeStyle, setActiveStyle] = useState("all");

  const categories =
    categoryResponse?.success && categoryResponse.data?.length
      ? categoryResponse.data
      : SHOP_CATEGORIES;

  const cateringRoots = useMemo(() => {
    const found = categories.filter(isCateringCategory);
    return found.length ? found : FALLBACK_CATERING ? [FALLBACK_CATERING] : [];
  }, [categories]);

  const styles = useMemo(() => {
    const fromMenu = cateringRoots.flatMap((root) =>
      (root.children || []).map((child) => ({
        ...child,
        parentName: root.name,
        parentImage: root.image,
      }))
    );
    if (!preview) return fromMenu;
    const seen = new Set(fromMenu.map((item) => item.slug));
    const samples = (FALLBACK_CATERING?.children || [])
      .filter((child) => !seen.has(child.slug))
      .map((child) => ({
        ...child,
        parentName: "Catering",
        parentImage: HERO_IMAGE,
      }));
    return [...fromMenu, ...samples];
  }, [cateringRoots, preview]);

  useEffect(() => {
    let ignore = false;

    const loadCatering = async () => {
      setLoading(true);
      setError("");
      try {
        const collected = [];
        let page = 0;

        for (let guard = 0; guard < 30; guard += 1) {
          const { data } = await axios.get(
            `/api/shop?page=${page}&limit=24&sort=default_sorting&category=catering`
          );
          if (!data?.success) {
            throw new Error(data?.message || "Could not load catering");
          }
          collected.push(...(data.data?.products || []));
          const next = data.data?.nextPage;
          if (next == null) break;
          page = next;
        }

        if (!ignore) {
          setPreview(collected.length === 0);
          setProducts(collected.length ? collected : dummyCateringProducts());
        }
      } catch (err) {
        if (!ignore) setError(err.message || "Could not load catering");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadCatering();
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
    const named = grouped.sections.map((section) => section);
    if (grouped.other.length) {
      named.push({
        name: "More catering",
        slug: "more-catering",
        products: grouped.other,
      });
    }
    if (!named.length && products.length) {
      return [{ name: "All catering", slug: "all-catering", products }];
    }
    return named;
  }, [grouped, products]);

  const countFor = (slug) => {
    if (slug === "all") return products.length;
    if (slug === "more-catering") return grouped.other.length;
    return products.filter((product) => matchesStyle(product, slug)).length;
  };

  const artFor = (style) => {
    const section = grouped.sections.find((item) => item.slug === style.slug);
    return (
      section?.products?.[0]?.media?.[0]?.secure_url ||
      style.parentImage ||
      cateringRoots[0]?.image ||
      HERO_IMAGE
    );
  };

  const selectStyle = (slug) => {
    setActiveStyle(slug);
    const target = document.getElementById(slug === "all" ? "catering-menu" : `catering-${slug}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const productGrid = "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-4";
  const menuItems = [
    { name: "Full menu", slug: "all", note: "Every catering item" },
    ...styles.map((style) => ({ name: style.name, slug: style.slug, note: style.parentName || "Catering" })),
    ...(grouped.other.length ? [{ name: "More catering", slug: "more-catering", note: "Also listed" }] : []),
  ];

  return (
    <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
      <header>
        <div className="relative h-[200px] overflow-hidden sm:h-[250px] lg:h-[280px]">
          <Image
            src={HERO_IMAGE}
            alt="Catering platter of sweets and savouries from Super Ideal Sweets and Bakers"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(43,24,16,0.82)_0%,rgba(43,24,16,0.55)_38%,rgba(43,24,16,0.12)_68%)]" />
          <div className="relative mx-auto flex h-full w-full max-w-[1680px] flex-col justify-end px-4 pb-6 pt-5 sm:justify-center sm:px-6 sm:pb-8 xl:px-10">
            <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-white/75 sm:mb-3">
              <Link href={WEBSITE_HOME} className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">›</span>
              <span className="font-medium text-white">Catering</span>
            </nav>
            <h1 className="font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[2.6rem] lg:text-[3rem]">
              Catering
            </h1>
            <p className="mt-2 max-w-[460px] text-[13.5px] leading-relaxed text-white/85 sm:text-[15px]">
              Celebration trays and event menus from Super Ideal, listed with every subcategory.
            </p>
          </div>
        </div>
      </header>

      <section id="catering-menu" className="scroll-mt-24 mx-auto w-full max-w-[1680px] px-4 pb-2 pt-6 sm:px-6 sm:pt-8 xl:px-10">
        <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-script text-[1.65rem] leading-none text-[#E45700] sm:text-[1.9rem]">For the table</p>
            <h2 className="mt-1 font-display text-[1.4rem] font-semibold tracking-[-0.02em] sm:text-[1.7rem]">
              Catering menu
            </h2>
          </div>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-[#8a6754]">
            Only catering is shown here, grouped by subcategory.
          </p>
        </div>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 sm:gap-4 [scrollbar-width:thin]" aria-label="Catering subcategories">
          {menuItems.map((item, index) => {
            const active = activeStyle === item.slug;
            const count = countFor(item.slug);
            const style = styles.find((entry) => entry.slug === item.slug);
            const image = item.slug === "all" || item.slug === "more-catering" ? HERO_IMAGE : artFor(style || item);
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => selectStyle(item.slug)}
                aria-pressed={active}
                className={`group relative w-[calc(50%-6px)] shrink-0 snap-start overflow-hidden rounded-[18px] text-left shadow-[0_8px_18px_rgba(75,46,30,0.08)] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] ${
                  active ? "ring-2 ring-[#E45700]" : "ring-1 ring-[#ead9c6]"
                }`}
              >
                <span className="relative block h-[132px] sm:h-[158px] lg:h-[172px]">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(43,24,16,0.08)_18%,rgba(43,24,16,0.78)_100%)]" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-extrabold tracking-[0.14em] text-[#E45700]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <span className="block font-display text-[1.05rem] font-semibold leading-tight text-white sm:text-[1.25rem]">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-[12px] text-white/80">
                      {loading ? "Loading" : `${count} ${count === 1 ? "item" : "items"}`}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] space-y-8 px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
        {loading && (
          <div className={productGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <CateringSkeleton key={index} />
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
            <h2 className="font-display text-[1.8rem] font-semibold">The catering menu is being set</h2>
            <p className="mx-auto mt-2 max-w-sm text-[14px] text-[#8a6754]">
              Subcategories will appear here as soon as they are added to catering.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          visibleSections.map((section) => (
            <article
              key={section.slug}
              id={`catering-${section.slug}`}
              className="scroll-mt-28 overflow-hidden rounded-[24px] border border-[#f1e3d4] bg-white"
            >
              <div className="flex flex-col gap-4 border-b border-[#f3e6d8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <span className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:block">
                    <Image
                      src={section.slug === "more-catering" || section.slug === "all-catering" ? HERO_IMAGE : artFor(section)}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#E45700]">
                      {section.slug === "more-catering" ? "Also on the menu" : "Subcategory"}
                    </p>
                    <h2 className="mt-1 font-display text-[1.35rem] font-semibold tracking-[-0.02em] sm:text-[1.6rem]">
                      {section.name}
                    </h2>
                  </div>
                </div>
                <p className="text-[13px] font-semibold text-[#8a6754]">
                  {section.products.length} {section.products.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="px-3 py-4 sm:px-5 sm:py-5">
                {section.products.length > 0 ? (
                  <div className={productGrid}>
                    {section.products.map((product) => (
                      <ProductBox key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-[18px] border border-dashed border-[#ead9c6] bg-[#FFF8F2] px-4 py-8 text-center text-[14px] text-[#8a6754]">
                    No catering items are listed in this subcategory right now.
                  </p>
                )}
              </div>
            </article>
          ))}
      </section>
    </div>
  );
};

export default CateringClient;
