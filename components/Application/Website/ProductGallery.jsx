"use client";

import Image from "next/image";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { productImageAlt } from "@/lib/productImageAlt";

const ProductGallery = ({
  media = [],
  productName = "Product",
  layout = "stack",
}) => {
  const slides = media.length
    ? media
    : [{ _id: "placeholder", secure_url: imgPlaceholder.src }];

  if (layout === "stack") {
    return (
      <div aria-label={`${productName} gallery. Scroll to change images.`}>
        {slides.map((slide, index) => (
          <div
            key={slide._id || slide.secure_url || index}
            className="pd-image-slide h-dvh bg-[var(--si-cream)] pt-[var(--pd-header)]"
          >
            <div className="flex h-full w-full items-center justify-center px-6 pb-8 pt-2 sm:px-8 lg:px-10 lg:pb-10">
              <div className="relative aspect-[4/5] h-[min(30rem,calc(100dvh-var(--pd-header)-5rem))] w-auto max-w-[min(22rem,calc(100%-0.25rem))]">
                <Image
                  src={slide?.secure_url || imgPlaceholder.src}
                  alt={productImageAlt(slide, productName)}
                  fill
                  priority={index === 0}
                  quality={88}
                  sizes="(max-width: 1024px) 90vw, 28vw"
                  className="object-contain object-center select-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="h-[72dvh] snap-y snap-mandatory overflow-y-auto overscroll-y-contain bg-[var(--si-cream)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label={`${productName} gallery. Scroll vertically to change images.`}
    >
      {slides.map((slide, index) => (
        <div
          key={slide._id || slide.secure_url || index}
          className="flex h-[72dvh] w-full snap-start snap-always items-center justify-center bg-[var(--si-cream)] px-8 py-6"
        >
          <div className="relative aspect-[4/5] h-[min(30rem,calc(100%-2rem))] w-auto max-w-full">
            <Image
              src={slide?.secure_url || imgPlaceholder.src}
              alt={productImageAlt(slide, productName)}
              fill
              priority={index === 0}
              quality={88}
              sizes="90vw"
              className="object-contain object-center select-none"
              draggable={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGallery;
