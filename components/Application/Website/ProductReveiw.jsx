"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoStar } from "react-icons/io5";
import ButtonLoading from "../ButtonLoading";
import { useSelector } from "react-redux";
import { Rating } from "@mui/material";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { showToast } from "@/lib/showToast";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import ReviewList from "./ReviewList";
import useFetch from "@/hooks/useFetch";

const ProductReveiw = ({ productId }) => {
  const queryClient = useQueryClient();
  const auth = useSelector((store) => store.authStore.auth);
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isReview, setIsReview] = useState(false);
  const [reviewCount, setReviewCount] = useState();

  const { data: reviewDetails } = useFetch(
    `/api/review/details?productId=${productId}`
  );

  useEffect(() => {
    if (reviewDetails && reviewDetails.success) {
      setReviewCount(reviewDetails.data);
    }
  }, [reviewDetails]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const formSchema = zSchema.pick({
    product: true,
    userId: true,
    rating: true,
    title: true,
    review: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: productId,
      userId: auth?._id,
      rating: 0,
      title: "",
      review: "",
    },
  });

  useEffect(() => {
    form.setValue("userId", auth?._id);
  }, [auth, form]);

  const handleReviewSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.post("/api/review/create", values);
      if (!response.success) {
        throw new Error(response.message);
      }

      form.reset();
      showToast("success", response.message);
      queryClient.invalidateQueries(["product-review"]);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReview = async (pageParam) => {
    const { data: getReviewData } = await axios.get(
      `/api/review/get?productId=${productId}&page=${pageParam}`
    );
    if (!getReviewData.success) {
      throw new Error(getReviewData.message || "Failed to fetch reviews");
    }

    return getReviewData.data;
  };

  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["product-review", productId],
    queryFn: async ({ pageParam }) => await fetchReview(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

  return (
    <div>
      <div className="mb-14 max-w-xl">
        <div className="nn-hairline-gold mb-7 w-12" />
        <p className="nn-label mb-4 text-[0.5rem] tracking-[0.34em] text-[var(--si-deep-brown)]">
          Client voices
        </p>
        <h2 className="nn-display text-3xl font-light leading-[1.1] text-[var(--si-deep-brown)] sm:text-4xl lg:text-[2.75rem]">
          What collectors{" "}
          <span className="nn-display-italic text-[var(--si-burnt-orange)]">
            say
          </span>
        </h2>
      </div>

      <div>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex w-full flex-col gap-10 md:flex-row md:items-center md:gap-12 lg:w-[62%]">
            <div className="shrink-0 text-center md:w-48 md:text-left">
              <p className="nn-display text-6xl font-light leading-none text-[var(--si-deep-brown)] sm:text-7xl">
                {reviewCount?.averageRating || "0"}
              </p>
              <div className="mt-3 flex justify-center gap-1 text-[var(--si-burnt-orange)] md:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IoStar key={i} size={13} />
                ))}
              </div>
              <p className="mt-3 text-[0.7rem] font-light tracking-[0.12em] text-[var(--si-muted)]">
                {reviewCount?.totalReview || 0} ratings
              </p>
            </div>

            <div className="w-full flex-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="mb-3 flex items-center gap-3">
                  <div className="flex w-10 items-center gap-1 text-xs text-[var(--si-muted)]">
                    <span>{rating}</span>
                    <IoStar className="text-[var(--si-burnt-orange)]" size={10} />
                  </div>
                  <Progress
                    value={reviewCount?.percentage?.[rating] || 0}
                    className="h-px flex-1 rounded-none bg-[var(--si-mist)] [&_[data-slot=progress-indicator]]:bg-[var(--si-burnt-orange)]"
                  />
                  <span className="w-6 text-right text-xs font-light text-[var(--si-muted)]">
                    {reviewCount?.rating?.[rating] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:text-right">
            <button
              type="button"
              onClick={() => setIsReview(!isReview)}
              className="nn-btn-outline w-full !py-3.5 lg:w-auto"
            >
              {isReview ? "Close Form" : "Leave a Note"}
            </button>
          </div>
        </div>

        {isReview && (
          <div className="mt-10 border-t border-[var(--si-mist)] pt-8">
            <p className="nn-label mb-2 text-[0.5rem] text-[var(--si-burnt-orange)]">
              Your note
            </p>
            <h4 className="nn-display mb-6 text-2xl font-light text-[var(--si-deep-brown)]">
              Write a review
            </h4>

            {!auth ? (
              <div>
                <p className="mb-4 text-sm font-light text-[var(--si-muted)]">
                  Please login to submit a review.
                </p>
                <Link
                  href={`${WEBSITE_LOGIN}?callback=${currentUrl}`}
                  className="nn-btn-primary inline-flex"
                >
                  Login
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleReviewSubmit)}>
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Rating value={field.value} size="large" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="nn-label text-[0.5rem] text-[var(--si-muted)]">
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Review title"
                              className="rounded-none border-[var(--si-mist)] bg-[var(--si-cream)] shadow-none focus-visible:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="review"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="nn-label text-[0.5rem] text-[var(--si-muted)]">
                            Review
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your experience with this piece..."
                              className="min-h-28 rounded-none border-[var(--si-mist)] bg-[var(--si-cream)] shadow-none focus-visible:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <ButtonLoading
                    loading={loading}
                    type="submit"
                    text="Submit Review"
                    className="nn-btn-primary !rounded-none cursor-pointer"
                  />
                </form>
              </Form>
            )}
          </div>
        )}

        <div className="mt-12 border-t border-[var(--si-mist)] pt-8">
          <h5 className="nn-display text-xl font-light text-[var(--si-deep-brown)]">
            {data?.pages?.[0]?.totalReview || 0} Reviews
          </h5>

          <div className="mt-8">
            {data?.pages?.map((page) =>
              page?.reviews?.map((review) => (
                <div className="mb-6 border-b border-[var(--si-mist)] pb-6 last:border-0" key={review._id}>
                  <ReviewList review={review} />
                </div>
              ))
            )}

            {hasNextPage && (
              <div className="mt-6 flex justify-center">
                <ButtonLoading
                  text="Load More"
                  type="button"
                  loading={isFetching}
                  onClick={fetchNextPage}
                  className="nn-btn-outline !rounded-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReveiw;
