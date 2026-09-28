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
  setMobileFilterOpen,
  resultLabel,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {resultLabel ? (
        <p className="mr-auto text-[13.5px] font-semibold text-[#8a6754]">{resultLabel}</p>
      ) : (
        <span className="mr-auto" />
      )}

      <ul className="hidden items-center gap-1 sm:flex">
        {[12, 18, 24].map((limitNumber) => {
          const active = limitNumber === limit;
          return (
            <li key={limitNumber}>
              <button
                type="button"
                onClick={() => setLimit(limitNumber)}
                aria-pressed={active}
                className={`h-8 min-w-8 rounded-full px-2 text-[12px] font-bold ${
                  active ? "bg-[#3a2416] text-white" : "text-[#8a6754] hover:bg-[#fff1e6]"
                }`}
              >
                {limitNumber}
              </button>
            </li>
          );
        })}
      </ul>

      <Select value={sorting} onValueChange={(value) => setSorting(value)}>
        <SelectTrigger className="h-10 w-[11.5rem] rounded-full border border-[#f0dcc4] bg-white px-4 text-[13px] font-semibold text-[#3a2416] shadow-none focus:ring-[#E45700]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-[#f1e3d4] bg-white">
          {sortings.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-xl text-sm font-medium focus:bg-[#fff4ea]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        type="button"
        className="inline-flex h-10 items-center rounded-full border border-[#E45700] bg-white px-4 text-[13px] font-bold text-[#E45700] hover:bg-[#E45700] hover:text-white lg:hidden"
        onClick={() => setMobileFilterOpen(true)}
      >
        Filters
      </button>
    </div>
  );
};

export default Sorting;
