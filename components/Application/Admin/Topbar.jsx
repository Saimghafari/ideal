"use client";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";
import BrandLogo from "@/components/Application/Website/BrandLogo";
import AdminMobileSearch from "./AdminMobileSearch";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center gap-3 border-b bg-white px-4 dark:bg-card md:left-64 md:px-8">
      <div className="flex min-w-0 items-center md:hidden">
        <BrandLogo size="header" className="text-[1.15rem]" />
      </div>
      <div className="hidden min-w-0 flex-1 md:block">
        <AdminSearch />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <AdminMobileSearch />
        <ThemeSwitch />
        <UserDropdown />
        <Button
          onClick={toggleSidebar}
          type="button"
          size="icon"
          className="ms-1 md:hidden"
        >
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
