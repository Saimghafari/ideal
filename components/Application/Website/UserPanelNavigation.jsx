"use client";

import { showToast } from "@/lib/showToast";
import {
  USER_DASHBOARD,
  USER_ORDERS,
  USER_PROFILE,
  WEBSITE_LOGIN,
} from "@/routes/WebsiteRoute";
import { logout } from "@/store/reducer/authReducer";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

const navItems = [
  { href: USER_DASHBOARD, label: "Dashboard", match: (path) => path === USER_DASHBOARD || path.startsWith(`${USER_DASHBOARD}/`) },
  { href: USER_PROFILE, label: "Profile", match: (path) => path.startsWith(USER_PROFILE) },
  { href: USER_ORDERS, label: "Orders", match: (path) => path.startsWith(USER_ORDERS) },
];

const UserPanelNavigation = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { data: logoutResponse } = await axios.post("/api/auth/logout");
      if (!logoutResponse.success) {
        throw new Error(logoutResponse.message);
      }

      dispatch(logout());
      showToast("success", logoutResponse.message);
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <nav className="nn-animate-fade-up-delay-1">
      <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-5">
        Account
      </p>

      <ul className="flex flex-row lg:flex-col gap-x-6 gap-y-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
        {navItems.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={`relative block py-2.5 lg:py-3 nn-label text-[0.58rem] tracking-[0.22em] transition-colors duration-300 ${
                  active
                    ? "text-[var(--si-deep-brown)]"
                    : "text-[var(--si-fog)] hover:text-[var(--si-deep-brown)]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute left-0 right-0 bottom-1.5 lg:bottom-2 h-px bg-[var(--si-burnt-orange)]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="nn-hairline my-6 hidden lg:block w-full max-w-[8rem]" />

      <button
        type="button"
        onClick={handleLogout}
        className="nn-label mt-2 lg:mt-0 text-[0.52rem] tracking-[0.22em] text-[var(--si-muted)] hover:text-[var(--si-deep-brown)] transition-colors cursor-pointer"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default UserPanelNavigation;
