import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import Link from "next/link";
import React from "react";

/**
 * Page intro shared across account and content pages.
 * Forest banner matches shop / FAQ chrome.
 */
const WebsiteBreadcrumb = ({ props }) => {
  const title = props?.title || "";
  const links = props?.links || [];
  const eyebrow = props?.eyebrow || "Your Account";
  const subtitle = props?.subtitle;

  const words = title.trim().split(/\s+/);
  const lead = words.length > 1 ? words.slice(0, -1).join(" ") : "";
  const accent = words.length > 1 ? words[words.length - 1] : title;

  return (
    <div className="bg-[var(--si-deep-brown)] text-[var(--si-cream)]">
      <div className="px-6 pb-12 pt-10 sm:px-10 sm:pb-14 sm:pt-12 lg:px-28 xl:px-36">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[0.58rem] tracking-[0.22em] uppercase text-white/45">
          <Link href={WEBSITE_HOME} className="hover:text-white">
            Home
          </Link>
          {links.map((item, index) => (
            <React.Fragment key={index}>
              <span className="text-[var(--si-cream)]/50">/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="max-w-2xl">
          <p className="nn-label mb-3 text-[var(--si-cream)]">{eyebrow}</p>
          <h1 className="nn-display text-4xl font-light leading-[0.95] sm:text-5xl lg:text-[3.4rem]">
            {lead ? (
              <>
                {lead}{" "}
                <span className="nn-display-italic text-[var(--si-cream)]">
                  {accent}
                </span>
              </>
            ) : (
              <span className="nn-display-italic text-[var(--si-cream)]">
                {accent}
              </span>
            )}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/55">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteBreadcrumb;
