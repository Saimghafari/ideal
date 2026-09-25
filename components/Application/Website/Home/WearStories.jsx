import Image from "next/image";
import React from "react";

const unsplash = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const THUMBS = [
  {
    id: "loafers",
    src: unsplash("photo-1614252235316-8c857d38b5f4", 480),
    alt: "Leather loafers",
    className: "ml-9 h-[6.5rem] w-[5.9rem] sm:ml-11 sm:h-[7.1rem] sm:w-[6.4rem]",
  },
  {
    id: "sneakers",
    src: unsplash("photo-1560769629-975ec94e6a86", 480),
    alt: "Color sneakers",
    className: "-ml-1 h-[5.7rem] w-[6.6rem] sm:h-[6.2rem] sm:w-[7.15rem]",
  },
  {
    id: "sandals",
    src: unsplash("photo-1603487742131-4160ec999306", 480),
    alt: "Sandals",
    className: "ml-9 h-[6.9rem] w-[5.9rem] sm:ml-11 sm:h-[7.4rem] sm:w-[6.4rem]",
  },
];

const FEATURE = {
  src: unsplash("photo-1552374196-1ab2a1c593e8", 900),
  alt: "Wearing V",
};

const QUOTES = [
  "Finally found a pair I can wear all day without thinking twice.",
  "Wore them once... now I’m hooked.",
  "V understood the assignment.",
];

const WearStories = () => {
  return (
    <section
      aria-labelledby="wear-stories-heading"
      className="bg-[#e8e8e8]"
    >
      <div className="mx-auto grid w-full max-w-[1120px] items-end gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-x-16 lg:px-8 lg:py-[4.75rem] xl:gap-x-24">
        <div className="flex items-end justify-center gap-4 sm:gap-[1.15rem] lg:justify-start">
          <div className="flex flex-col gap-8 sm:gap-[2.15rem]">
            {THUMBS.map((image) => (
              <div
                key={image.id}
                className={`relative overflow-hidden rounded-[1.05rem] bg-[#d2d2d2] ${image.className}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="114px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="relative h-[14.55rem] w-[12.1rem] overflow-hidden rounded-[1.15rem] bg-[#d2d2d2] sm:h-[15.75rem] sm:w-[13.1rem]">
            <Image
              src={FEATURE.src}
              alt={FEATURE.alt}
              fill
              sizes="210px"
              className="object-cover object-[center_18%]"
            />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[28rem] flex-col justify-between gap-6 lg:mx-0 lg:max-w-none">
          <h2
            id="wear-stories-heading"
            className="text-[1.85rem] font-medium leading-[0.95] tracking-[-0.04em] text-black sm:text-[2.35rem] lg:text-[2.55rem] xl:text-[3.15rem]"
          >
            Stories From The Ones Who Wear V
          </h2>

          {QUOTES.map((quote) => (
            <blockquote
              key={quote}
              className="max-w-[27rem] text-[0.98rem] font-normal leading-[1.55] text-black sm:text-[1.05rem]"
            >
              “{quote}”
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WearStories;
