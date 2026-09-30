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
  {
    href: USER_DASHBOARD,
    label: "Dashboard",
    match: (path) =>
      path === USER_DASHBOARD || path.startsWith(`${USER_DASHBOARD}/`),
  },
  {
    href: USER_PROFILE,
    label: "Profile",
    match: (path) => path.startsWith(USER_PROFILE),
  },
  {
    href: USER_ORDERS,
    label: "Orders",
    match: (path) => path.startsWith(USER_ORDERS),
  },
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
    <nav className="rounded-[22px] border border-[#f1e3d4] bg-white p-3 shadow-[0_8px_22px_rgba(75,46,30,0.05)] sm:p-4">
      <p className="px-3 pb-2 pt-1 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#E45700]">
        Account
      </p>

      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {navItems.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href} className="shrink-0 lg:shrink">
              <Link
                href={item.href}
                className={`block rounded-full px-4 py-2.5 text-[13.5px] font-bold transition-colors ${
                  active
                    ? "bg-[#fff4ec] text-[#E45700]"
                    : "text-[#6b5142] hover:bg-[#FFF8F2] hover:text-[#3a2416]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mx-3 my-3 hidden h-px bg-[#f1e3d4] lg:block" />

      <button
        type="button"
        onClick={handleLogout}
        className="mt-1 w-full cursor-pointer rounded-full px-4 py-2.5 text-left text-[13.5px] font-bold text-[#8a6754] transition-colors hover:bg-[#FFF8F2] hover:text-[#3a2416] lg:mt-0"
      >
        Sign out
      </button>
    </nav>
  );
};

export default UserPanelNavigation;
