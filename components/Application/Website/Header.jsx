"use client";

import {
  USER_DASHBOARD,
  WEBSITE_ABOUT,
  WEBSITE_CONTACT,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_SHOP,
  WEBSITE_CAKES,
  WEBSITE_CATERING,
  WEBSITE_LOCATIONS,
} from "../../../routes/WebsiteRoute";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { HiMiniBars3 } from "react-icons/hi2";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "../../ui/avatar";
import userIcon from "../../../public/assets/images/user.png";
import { usePathname, useSearchParams } from "next/navigation";
import Cart from "./Cart";
import Search from "./Search";
import Image from "next/image";

const navItems = [
  { label: "Home", href: WEBSITE_HOME },
  { label: "Our Story", href: WEBSITE_ABOUT },
  { label: "Products", href: WEBSITE_SHOP },
  { label: "Cakes", href: WEBSITE_CAKES },
  { label: "Catering", href: WEBSITE_CATERING },
  { label: "Locations", href: WEBSITE_LOCATIONS },
  { label: "Contact", href: WEBSITE_CONTACT },
];

const isNavActive = (pathname, href, searchParams) => {
  if (href.startsWith("/#")) return pathname === WEBSITE_HOME;
  const [path, queryString] = href.split("?");
  const hrefCategory = new URLSearchParams(queryString || "").get("category");
  const currentCategory = searchParams?.get("category") || "";

  if (path === WEBSITE_HOME) return pathname === WEBSITE_HOME;
  if (path === WEBSITE_SHOP) {
    if (pathname !== WEBSITE_SHOP) return false;
    if (hrefCategory) return currentCategory.toLowerCase() === hrefCategory.toLowerCase();
    return !currentCategory;
  }
  return pathname === path || pathname.startsWith(`${path}/`);
};

const Header = () => {
  const auth = useSelector((store) => store.authStore.auth);
  const isLoggedIn = Boolean(auth?._id);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setIsMobileMenu(false);
    setShowSearch(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenu]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[90] border-b border-[#f0e2d2] bg-[#FFF9F3] pt-[env(safe-area-inset-top,0px)] font-ui text-[#3d2415]">
        <div className="relative mx-auto flex h-[68px] w-full max-w-[1680px] items-center justify-between gap-1.5 px-2.5 sm:h-[76px] sm:gap-2 sm:px-4 xl:px-10">
          <button
            type="button"
            aria-label={isMobileMenu ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ead9c6] min-[400px]:h-10 min-[400px]:w-10 xl:hidden"
            onClick={() => setIsMobileMenu((v) => !v)}
          >
            {isMobileMenu ? <IoMdClose size={18} /> : <HiMiniBars3 size={18} />}
          </button>

          <Link href={WEBSITE_HOME} aria-label="Super Ideal Sweets & Bakers home" className="min-w-0 shrink">
            <Image
              src="/assets/images/logo.png"
              alt="Super Ideal Sweets & Bakers"
              width={1036}
              height={351}
              priority
              className="h-8 w-auto max-w-full object-contain object-left min-[400px]:h-10 sm:h-12"
            />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center xl:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active = isNavActive(pathname, item.href, searchParams);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`whitespace-nowrap px-2 py-2 text-[13.5px] font-semibold transition-colors ${
                    active ? "text-[#E45700]" : "text-[#4a3428] hover:text-[#E45700]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-1.5">
            <button
              type="button"
              data-search-toggle
              aria-label="Search"
              onClick={() => setShowSearch(true)}
              className="hidden h-10 w-10 items-center justify-center rounded-full text-[#3d2415] hover:bg-[#fff1e6] min-[420px]:inline-flex"
            >
              <IoIosSearch size={20} />
            </button>

            {!isLoggedIn ? (
              <Link
                href={WEBSITE_LOGIN}
                className="hidden h-10 w-10 items-center justify-center rounded-full text-[#3d2415] hover:bg-[#fff1e6] sm:inline-flex"
                aria-label="Sign in"
              >
                <VscAccount size={18} />
              </Link>
            ) : (
              <Link href={USER_DASHBOARD} className="hidden sm:inline-flex" aria-label="My account">
                <Avatar className="h-9 w-9 ring-1 ring-[#E45700]/30">
                  <AvatarImage src={auth?.avatar?.url || userIcon.src} />
                </Avatar>
              </Link>
            )}

            <span className="inline-flex">
              <Cart tone="dark" />
            </span>

            <Link
              href={WEBSITE_SHOP}
              className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-[#E45700] px-2.5 text-[12px] font-bold text-white shadow-[0_6px_14px_rgba(228,87,0,0.25)] hover:bg-[#cf4c00] min-[400px]:h-10 min-[400px]:px-3.5 min-[400px]:text-[13px] sm:px-5 sm:text-[14px]"
            >
              Order Now
            </Link>
          </div>
        </div>
      </header>

      <Search isShow={showSearch} onClose={() => setShowSearch(false)} />

      <div className="h-[calc(68px+env(safe-area-inset-top,0px))] sm:h-[calc(76px+env(safe-area-inset-top,0px))]" aria-hidden="true" />

      <div
        className={`fixed inset-x-0 bottom-0 top-[calc(68px+env(safe-area-inset-top,0px))] z-[70] bg-black/30 transition-opacity sm:top-[calc(76px+env(safe-area-inset-top,0px))] xl:hidden ${
          isMobileMenu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileMenu(false)}
        aria-hidden={!isMobileMenu}
      />

      <aside
        className={`fixed inset-x-3 top-[calc(76px+env(safe-area-inset-top,0px))] z-[80] overflow-hidden rounded-3xl border border-[#f0e2d2] bg-[#FFF9F3] font-ui text-[#3d2415] shadow-xl transition-all xl:hidden ${
          isMobileMenu ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMobileMenu}
      >
        <nav className="flex flex-col p-3" aria-label="Mobile">
          {navItems.map((item) => {
            const active = isNavActive(pathname, item.href, searchParams);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenu(false)}
                className={`rounded-2xl px-4 py-3 text-[16px] font-semibold ${
                  active ? "bg-[#fff1e6] text-[#E45700]" : "text-[#3d2415]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={isLoggedIn ? USER_DASHBOARD : WEBSITE_LOGIN}
            onClick={() => setIsMobileMenu(false)}
            className="mt-2 rounded-2xl px-4 py-3 text-[16px] font-semibold text-[#3d2415]"
          >
            {isLoggedIn ? auth.name || "Account" : "Sign in"}
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Header;
