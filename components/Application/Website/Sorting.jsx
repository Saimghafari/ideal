import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortings } from "@/lib/utils";

const Sorting = ({
  limit,
  setLimit,
  sorting,
  setSorting,
  mobileFilterOpen,
  setMobileFilterOpen,
  resultLabel,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
      {resultLabel ? (
        <p className="mr-auto text-sm font-light text-[var(--si-muted)] lg:mr-0">
          {resultLabel}
        </p>
      ) : null}

      <ul className="hidden items-center gap-1 sm:flex">
        {[9, 12, 18, 24].map((limitNumber) => {
          const active = limitNumber === limit;
          return (
            <li key={limitNumber}>
              <button
                type="button"
                onClick={() => setLimit(limitNumber)}
                aria-pressed={active}
                className={`px-1.5 text-[0.68rem] tracking-[0.08em] ${
                  active
                    ? "text-[var(--si-deep-brown)]"
                    : "text-[var(--si-muted)] hover:text-[var(--si-deep-brown)]"
                }`}
              >
                {limitNumber}
              </button>
            </li>
          );
        })}
      </ul>

      <Select value={sorting} onValueChange={(value) => setSorting(value)}>
        <SelectTrigger className="h-9 w-[11rem] rounded-none border-0 bg-transparent px-0 text-xs font-light tracking-wide text-[var(--si-deep-brown)] shadow-none focus:ring-0">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent className="rounded-none border-[var(--si-mist)] bg-[var(--si-cream)]">
          {sortings.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-none text-sm font-light focus:bg-[var(--si-cream)]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        type="button"
        className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)]"
        onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
      >
        Size & price
      </button>
    </div>
  );
};

export default Sorting;
