"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoStar } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";

const testimonials = [
  {
    name: "Ayesha Khan",
    review:
      "The soan halwa tasted just like the counter in Faisalabad. Packed fresh and still warm in the tin.",
    rating: 5,
  },
  {
    name: "Hassan Ali",
    review:
      "Butter biscuits with evening chai — crisp, rich, and gone the same day.",
    rating: 5,
  },
  {
    name: "Fatima Noor",
    review:
      "We ordered a fruit cream cake for a birthday. Light, fresh, and exactly as shown.",
    rating: 5,
  },
  {
    name: "Usman Raza",
    review:
      "The catering tray arrived on time for the mehndi. Guests kept asking which shop it was.",
    rating: 4,
  },
  {
    name: "Sana Malik",
    review:
      "Dry fruit gift box was beautiful. Perfect for a visit and packed with care.",
    rating: 5,
  },
  {
    name: "Bilal Ahmed",
    review:
      "Namak pare had the Super Ideal crunch. We picked up a second box the next day.",
    rating: 5,
  },
  {
    name: "Hira Shah",
    review:
      "Croissants from the morning bake were flaky and buttery. Worth the trip to Saddar.",
    rating: 4,
  },
  {
    name: "Omar Farooq",
    review:
      "Kunafa was warm and sweet, finished in store. Best eaten the same day, as they say.",
    rating: 5,
  },
  {
    name: "Zara Iqbal",
    review:
      "Gift boxes for Eid were ready on time. The family loved the mithai selection.",
    rating: 5,
  },
];

const Testimonial = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
      <h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold">
        Customer Review
      </h2>
      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <div key={index} className="p-5">
            <div className="border rounded-lg p-5">
              <BsChatQuote size={30} className="mb-3" />

              <p className="mb-5">{item.review}</p>
              <h4 className="font-semibold">{item.name}</h4>
              <div className="flex mt-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <IoStar
                    key={`star${i}`}
                    className="text-yellow-400"
                    size={20}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial;
