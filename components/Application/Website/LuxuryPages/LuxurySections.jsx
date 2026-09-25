import React from "react";

const LuxurySections = ({ sections, tocHint }) => {
  const tableOfContents = sections.map(({ id, number, title }) => ({
    id,
    number,
    title,
  }));

  return (
    <section className="px-6 sm:px-10 lg:px-20 xl:px-28 py-16 sm:py-20 lg:py-28 bg-[var(--si-cream)]">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28">
              <p className="nn-label text-[var(--si-deep-brown)] mb-6">Contents</p>
              <nav aria-label="Page sections">
                <ul className="space-y-1">
                  {tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="group flex items-baseline gap-3 py-2.5 text-[0.82rem] font-light text-[var(--si-muted)] transition-colors duration-400 hover:text-[var(--si-deep-brown)]"
                      >
                        <span className="nn-display text-sm text-[var(--si-burnt-orange)]/50 group-hover:text-[var(--si-burnt-orange)] transition-colors duration-400">
                          {item.number}
                        </span>
                        <span className="border-b border-transparent group-hover:border-[var(--si-burnt-orange)]/40 pb-0.5 transition-all duration-400">
                          {item.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              {tocHint && (
                <>
                  <div className="nn-hairline w-full mt-8" />
                  <p className="mt-6 text-[0.75rem] font-light leading-[1.8] text-[var(--si-fog)]">
                    {tocHint}
                  </p>
                </>
              )}
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="mb-10 sm:mb-12 lg:hidden">
              <p className="nn-label text-[var(--si-deep-brown)] mb-5">Contents</p>
              <nav aria-label="Page sections">
                <ul className="flex flex-wrap gap-2">
                  {tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="inline-flex items-center gap-2 border border-[var(--si-mist)] px-3 py-1.5 text-[0.65rem] tracking-[0.12em] uppercase font-light text-[var(--si-muted)] transition-all duration-400 hover:border-[var(--si-burnt-orange)]/50 hover:text-[var(--si-deep-brown)]"
                      >
                        <span className="text-[var(--si-burnt-orange)]/60">
                          {item.number}
                        </span>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <ul className="divide-y divide-[var(--si-mist)]">
              {sections.map((section) => (
                <li
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 py-10 sm:py-12 first:pt-0 last:pb-0"
                >
                  <div className="grid sm:grid-cols-[4rem_minmax(0,1fr)] gap-4 sm:gap-8">
                    <span
                      className="nn-display text-2xl sm:text-3xl text-[var(--si-burnt-orange)]/45 leading-none pt-1"
                      aria-hidden
                    >
                      {section.number}
                    </span>
                    <div>
                      <h2 className="nn-display text-2xl sm:text-[1.75rem] font-light text-[var(--si-deep-brown)] mb-5 sm:mb-6">
                        {section.title}
                      </h2>

                      {section.items && (
                        <ul className="space-y-5 sm:space-y-6">
                          {section.items.map((item, index) => (
                            <li key={index} className="flex gap-4 sm:gap-5">
                              <span
                                className="mt-2.5 h-1 w-1 shrink-0 rotate-45 border border-[var(--si-burnt-orange)]/50"
                                aria-hidden
                              />
                              <p className="text-sm sm:text-[0.9rem] font-light leading-[1.95] text-[var(--si-muted)]">
                                {item.label && (
                                  <span className="text-[var(--si-deep-brown)] font-normal">
                                    {item.label}:{" "}
                                  </span>
                                )}
                                {item.text}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.paragraphs && (
                        <div className="space-y-5">
                          {section.paragraphs.map((paragraph, index) => (
                            <p
                              key={index}
                              className="text-sm sm:text-[0.9rem] font-light leading-[1.95] text-[var(--si-muted)]"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxurySections;
