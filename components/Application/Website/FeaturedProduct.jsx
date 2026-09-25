"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import ProductBox from "./ProductBox";
import { ProductSkeletonGrid } from "@/app/(root)/(website)/shop/ShopClient";

const FeaturedProduct = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/product/get-featured-product`,
          {
            timeout: 10000,
          }
        );
        setProductData(data);
        setError(null);
      } catch (error) {
        console.error("Featured Products API Error:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="lg:px-32 px-4 sm:py-10">
        <div className="text-center py-10">
          <h2 className="sm:text-4xl text-2xl font-semibold mb-4">
            Featured Products
          </h2>
          <ProductSkeletonGrid count={6} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lg:px-32 px-4 sm:py-10">
        <div className="text-center py-10">
          <h2 className="sm:text-4xl text-2xl font-semibold mb-4">
            Featured Products
          </h2>
          <p className="text-gray-500">
            Unable to load featured products at the moment.
          </p>
        </div>
      </section>
    );
  }

  if (
    !productData ||
    !productData.success ||
    !productData.data ||
    productData.data.length === 0
  ) {
    return (
      <section className="lg:px-32 px-4 sm:py-10">
        <div className="text-center py-10">
          <h2 className="sm:text-4xl text-2xl font-semibold mb-4">
            Featured Products
          </h2>
          <p className="text-gray-500">No featured products available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:px-32 px-4 sm:py-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="sm:text-4xl text-2xl font-semibold">
          Featured Products
        </h2>
        <Link
          href="/shop"
          className="flex items-center gap-2 underline underline-offset-4 hover:text-primary"
        >
          View All
          <IoIosArrowRoundForward />
        </Link>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2">
        {productData.success &&
          productData.data.map((product) => (
            <ProductBox key={product._id} product={product} />
          ))}
      </div>
      <Link
        href="/shop"
        className="flex my-10 justify-center items-center gap-2 underline underline-offset-4 hover:text-primary"
      >
        View All
        <IoIosArrowRoundForward />
      </Link>
    </section>
  );
};

export default FeaturedProduct;
