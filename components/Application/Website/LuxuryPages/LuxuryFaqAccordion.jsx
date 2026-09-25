"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LuxuryFaqAccordion = ({ categories }) => {
  return (
    <div className="space-y-14 sm:space-y-16">
      {categories.map((category) => (
        <div key={category.id} id={category.id} className="scroll-mt-28">
          <div className="flex items-baseline gap-4 sm:gap-6 mb-8 sm:mb-10">
            <span className="nn-display text-2xl sm:text-3xl text-[var(--si-burnt-orange)]/45 leading-none">
              {category.number}
            </span>
            <div>
              <p className="nn-label text-[var(--si-deep-brown)] mb-2">
                {category.label}
              </p>
              <h2 className="nn-display text-2xl sm:text-[1.75rem] font-light text-[var(--si-deep-brown)]">
                {category.title}
              </h2>
            </div>
          </div>

          <Accordion type="single" collapsible className="divide-y divide-[var(--si-mist)]">
            {category.questions.map((item, index) => (
              <AccordionItem
                key={index}
                value={`${category.id}-${index}`}
                className="border-[var(--si-mist)]"
              >
                <AccordionTrigger className="py-6 sm:py-7 text-[0.95rem] sm:text-base font-light text-[var(--si-deep-brown)] hover:no-underline hover:text-[var(--si-deep-brown)] transition-colors duration-400 [&>svg]:text-[var(--si-burnt-orange)]/60 [&>svg]:size-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 sm:pb-7">
                  <p className="text-sm sm:text-[0.9rem] font-light leading-[1.95] text-[var(--si-muted)] max-w-2xl">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default LuxuryFaqAccordion;
