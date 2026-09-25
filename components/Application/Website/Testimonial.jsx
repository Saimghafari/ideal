"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoStar } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";

const testimonials = [
  {
    name: "Sophia Patel",
    review:
      "Our framed embroidery panel became the quiet centrepiece of the lounge. Exceptional texture and a truly refined finish.",
    rating: 5,
  },
  {
    name: "James Thompson",
    review:
      "The detail in this thread art is remarkable. Packaging was careful, and the piece feels like luxury wall decor.",
    rating: 4,
  },
  {
    name: "Emily Chen",
    review:
      "A distinctive statement wall art piece. Modern, elegant, and perfectly scaled for our dining space.",
    rating: 5,
  },
  {
    name: "Liam Rodriguez",
    review:
      "We commissioned a custom panel — the embroidery design exceeded expectations. Timeless and beautifully composed.",
    rating: 4,
  },
  {
    name: "Ava Johnson",
    review:
      "From unboxing to hanging, everything felt premium. This is artistic wall decor we will keep for years.",
    rating: 5,
  },
  {
    name: "Noah Davis",
    review:
      "Subtle colour and rich stitchwork. Exactly the modern wall decor our hallway needed.",
    rating: 4,
  },
  {
    name: "Isabella Martinez",
    review:
      "Elegant embroidery wall art with presence. Guests always ask where we found it.",
    rating: 5,
  },
  {
    name: "William Lee",
    review:
      "Quality finish, thoughtful framing, and a calm luxury feel. Highly recommended.",
    rating: 4,
  },
  {
    name: "Mia Anderson",
    review:
      "The panel arrived ready to hang. Soft texture, strong design — premium interior decor.",
    rating: 4,
  },
  {
    name: "Ethan Clark",
    review:
      "One of the most considered pieces we own. True embroidery artwork for a modern home.",
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
