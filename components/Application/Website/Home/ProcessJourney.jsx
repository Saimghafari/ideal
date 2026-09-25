import React from "react";

const steps = [
  {
    num: "01",
    title: "The Thread",
    desc: "We select premium silk and cotton threads — warm, rich, and made to hold colour for years.",
  },
  {
    num: "02",
    title: "The Design",
    desc: "Every embroidery design begins as a sketch. Motifs are refined until balance and beauty align.",
  },
  {
    num: "03",
    title: "The Stitch",
    desc: "Layered stitchwork builds texture and depth — creating distinctive thread art for the wall.",
  },
  {
    num: "04",
    title: "The Frame",
    desc: "Finished panels are mounted as framed embroidery — gallery-ready decorative wall art.",
  },
];

const ProcessJourney = () => {
  return (
    <section className="bg-[var(--si-deep-brown)] px-6 sm:px-10 lg:px-28 xl:px-36 py-28 sm:py-36 relative overflow-hidden">
      {/* Faint decorative line */}
      <div className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-transparent via-[var(--si-burnt-orange)]/10 to-transparent hidden lg:block" />

      <div className="max-w-3xl mb-20 sm:mb-24">
        <div className="nn-hairline-light w-20 mb-8" />
        <p className="nn-label text-[var(--si-burnt-orange)] mb-5">The Craft</p>
        <h2 className="nn-display text-5xl sm:text-6xl lg:text-[4.5rem] font-light text-[var(--si-cream)] leading-[0.95]">
          From thread
          <br />
          <span className="nn-display-italic text-[var(--si-burnt-orange)]">to wall</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
        {steps.map((step, index) => (
          <div
            key={step.num}
            className={`p-8 lg:p-10 border-[var(--si-burnt-orange)]/10
              ${index < 3 ? "lg:border-r" : ""}
              ${index % 2 === 0 ? "max-lg:border-b sm:border-b" : "max-sm:border-b"}
              ${index < 2 ? "sm:border-b lg:border-b-0" : ""}
            `}
          >
            <p className="nn-display text-[3rem] font-light text-[var(--si-burnt-orange)]/20 leading-none mb-6">
              {step.num}
            </p>
            <h3 className="nn-display text-[1.4rem] text-[var(--si-cream)] mb-4">
              {step.title}
            </h3>
            <p className="text-sm font-light leading-[1.85] text-[var(--si-cream)]/55">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessJourney;
