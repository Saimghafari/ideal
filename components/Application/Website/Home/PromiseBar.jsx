import React from "react";
import { Leaf, RotateCcw, ShieldCheck, Timer } from "lucide-react";
import { promises } from "./homeData";

const PROMISE_ICONS = {
  "Free returns": RotateCcw,
  "Thoughtful fabrics": Leaf,
  "Secure delivery": ShieldCheck,
  "Made to last": Timer,
};

const PromiseBar = () => {
  return (
    <div className="border-t border-[var(--si-mist)] bg-[var(--si-cream)]">
      <ul className="grid grid-cols-2 lg:grid-cols-4">
        {promises.map((item, index) => {
          const Icon = PROMISE_ICONS[item] || ShieldCheck;
          return (
            <li
              key={item}
              className={`flex flex-col items-center justify-center gap-2.5 px-5 py-7 text-center sm:gap-3 sm:px-8 sm:py-8 ${
                index % 2 === 0 ? "max-lg:border-r border-[var(--si-mist)]" : ""
              } ${index < 2 ? "max-lg:border-b border-[var(--si-mist)]" : ""} ${
                index < 3 ? "lg:border-r border-[var(--si-mist)]" : ""
              }`}
            >
              <Icon
                className="h-5 w-5 text-[var(--si-deep-brown)]/70 sm:h-[1.35rem] sm:w-[1.35rem]"
                strokeWidth={1.4}
                aria-hidden="true"
              />
              <p className="nn-label text-[0.58rem] text-[var(--si-muted)]">
                {item}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PromiseBar;
