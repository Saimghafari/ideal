"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/assets/home/si-hero.png",
    position: "object-[62%_center]",
  },
  {
    src: "/assets/home/si-storefront.png",
    position: "object-center",
  },
  {
    src: "/assets/home/si-gift-box.png",
    position: "object-center",
  },
  {
    src: "/assets/home/si-pastries.png",
    position: "object-center",
  },
];

const INTERVAL_MS = 4500;

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || SLIDES.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {SLIDES.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${slide.position} ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
