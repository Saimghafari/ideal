import React from "react";
import { testimonials } from "./homeData";

const HomeTestimonials = () => {
  return (
    <section className="bg-[var(--si-cream)] px-6 sm:px-10 lg:px-28 xl:px-36 py-28 sm:py-36">
      <div className="max-w-xl mb-20 sm:mb-24">
        <div className="nn-hairline w-20 mb-8" />
        <p className="nn-label text-[var(--si-deep-brown)] mb-5">From Our Collectors</p>
        <h2 className="nn-display text-5xl sm:text-6xl lg:text-[4.5rem] font-light text-[var(--si-deep-brown)] leading-[0.95]">
          Words of
          <br />
          <span className="nn-display-italic text-[var(--si-burnt-orange)]">warmth</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[var(--si-fog)]/50">
        {testimonials.map((item, index) => (
          <blockquote
            key={item.name}
            className={`pt-10 sm:pt-14 pb-10 sm:pb-14 pr-0 md:pr-10 lg:pr-14 
              ${index < 2 ? "md:border-r border-[var(--si-fog)]/50" : ""}
              ${index > 0 ? "md:pl-10 lg:pl-14" : ""}
            `}
          >
            <span className="nn-display text-[4rem] text-[var(--si-burnt-orange)] leading-none block mb-2 -mt-3">
              "
            </span>
            <p className="nn-display text-xl sm:text-[1.4rem] font-light leading-[1.6] text-[var(--si-deep-brown)]">
              {item.quote}
            </p>
            <footer className="mt-8 flex items-center gap-4">
              <div className="w-8 h-px bg-[var(--si-burnt-orange)]/50" />
              <div>
                <p className="nn-label text-[var(--si-deep-brown)] text-[0.58rem]">
                  {item.name}
                </p>
                <p className="text-xs text-[var(--si-muted)] mt-0.5">{item.city}</p>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

export default HomeTestimonials;
