import Link from "next/link";
import React from "react";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import BrandLogo from "@/components/Application/Website/BrandLogo";
import { BRAND_NAME } from "@/lib/siteMeta";

export const metadata = {
  title: "Account",
  description: "Sign in or register for your Velora clothing account.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.dectorre.com/auth/login" },
};

const layout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[var(--si-cream)] text-[var(--si-deep-brown)]">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <header className="mb-10 flex items-center justify-between border-b border-[var(--si-mist)] pb-5">
          <BrandLogo size="auth" />
          <Link
            href={WEBSITE_HOME}
            className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)]"
          >
            Back to shop
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center pb-10">
          {children}
        </main>

        <p className="pb-2 text-center text-[0.65rem] tracking-[0.16em] uppercase text-[var(--si-muted)]">
          {BRAND_NAME} clothing
        </p>
      </div>
    </div>
  );
};

export default layout;
