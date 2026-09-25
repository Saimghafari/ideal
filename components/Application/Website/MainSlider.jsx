"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import slider1 from "@/public/assets/images/slider-1.png";
import slider2 from "@/public/assets/images/slider-2.png";
import slider3 from "@/public/assets/images/sliders-min.png";
import Image from "next/image";
import { LuChevronRight } from "react-icons/lu";
import { LuChevronLeft } from "react-icons/lu";

const ArrowNext = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      type="button"
      className="max-sm:hidden w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white right-10"
    >
      <LuChevronRight size={25} className="text-gray-600" />
    </button>
  );
};
const ArrowPrev = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      type="button"
      className="max-sm:hidden w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white left-10"
    >
      <LuChevronLeft size={25} className="text-gray-600" />
    </button>
  );
};

const MainSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    nextArrow: <ArrowNext />,
    prevArrow: <ArrowPrev />,

    responsive: [
      {
        breakpoint: 480,
        settings: {
          dots: true,
          arrow: false,
        },
      },
    ],
  };
  return (
    <div className="w-[100%] lg:h-[75vh] overflow-hidden">
      <Slider {...settings}>
        <div className="lg:h-[75vh]">
          <Image
            src={slider1.src}
            width={slider1.width}
            height={slider1.height}
            alt="slider 1"
            className="w-full lg:h-full lg:object-cover "
          />
        </div>
        <div className="lg:h-[75vh]">
          <Image
            src={slider2.src}
            width={slider2.width}
            height={slider2.height}
            alt="slider 2"
            className="w-full lg:h-full lg:object-cover "
          />
        </div>
        <div className="lg:h-[75vh]">
          <Image
            src={slider3.src}
            width={slider3.width}
            height={slider3.height}
            alt="slider 3"
            className="w-full lg:h-full lg:object-cover "
          />
        </div>
      </Slider>
    </div>
  );
};

export default MainSlider;
