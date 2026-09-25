"use client";

import Image from "next/image";
import { useState } from "react";
import MediaModal from "@/components/Application/Admin/MediaModal";

const HomeMediaPicker = ({ value, onChange, label = "Select image" }) => {
  const [open, setOpen] = useState(false);
  const selected = value?._id ? [value] : [];

  return (
    <div className="rounded border border-dashed p-4 text-center">
      <MediaModal
        open={open}
        setOpen={setOpen}
        selectedMedia={selected}
        setSelectedMedia={(next) => onChange(next[0] || null)}
        isMultiple={false}
      />
      {value?.url ? (
        <div className="mx-auto mb-3 h-28 w-28 overflow-hidden border">
          <Image
            src={value.url}
            alt=""
            width={112}
            height={112}
            className="size-full object-cover"
          />
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto block w-[200px] cursor-pointer border bg-gray-50 p-3 text-sm font-semibold dark:bg-card"
      >
        {value?._id ? "Change image" : label}
      </button>
      {value?._id ? (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-2 text-xs text-muted-foreground underline"
        >
          Remove image
        </button>
      ) : null}
    </div>
  );
};

export default HomeMediaPicker;
