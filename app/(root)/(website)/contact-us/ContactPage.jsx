"use client";

import ButtonLoading from "@/components/Application/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

const inquiryOptions = [
  { value: "general", label: "General" },
  { value: "order", label: "Order" },
  { value: "commission", label: "Size & fit" },
  { value: "visit", label: "Shipping" },
];

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(80, { message: "Name is too long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 7, {
      message: "Please enter a valid phone number",
    }),
  inquiryType: z.enum(["general", "order", "commission", "visit"], {
    required_error: "Please select a topic",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message is too long" }),
});

const inputClass =
  "h-11 rounded-none border border-[var(--si-mist)] bg-[var(--si-cream)] px-4 text-sm font-light text-[var(--si-deep-brown)] shadow-none placeholder:text-[var(--si-fog)] focus-visible:ring-0 focus-visible:border-[var(--si-burnt-orange)] transition-colors duration-300";

const labelClass =
  "text-[0.62rem] tracking-[0.2em] uppercase font-medium text-[var(--si-muted)] mb-2.5 block";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      inquiryType: "general",
      message: "",
    },
  });

  const inquiryType = form.watch("inquiryType");

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: res } = await axios.post("/api/contact", {
        name: values.name,
        email: values.email,
        phone: values.phone || "",
        inquiryType: values.inquiryType,
        message: values.message,
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to send message.");
      }

      showToast(
        "success",
        res.message ||
          "Thank you. Your message has been received — we will respond shortly."
      );
      form.reset({
        name: "",
        email: "",
        phone: "",
        inquiryType: "general",
        message: "",
      });
      setSubmitted(true);
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      showToast("error", apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--si-cream)] text-[var(--si-deep-brown)]">
      <header className="bg-[var(--si-deep-brown)] px-6 pb-14 pt-14 sm:px-10 sm:pb-16 sm:pt-20 lg:px-20 xl:px-28">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-[0.58rem] tracking-[0.22em] uppercase text-white/45"
        >
          <Link href={WEBSITE_HOME} className="hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="text-white">Contact</span>
        </nav>

        <p className="nn-label mb-5 text-[var(--si-cream)]">Velora</p>
        <h1 className="nn-display text-[2.75rem] font-light leading-[1.05] text-[var(--si-cream)] sm:text-[3.5rem] lg:text-[4rem]">
          Contact us
        </h1>
        <p className="mt-6 max-w-lg text-sm font-light leading-[1.95] text-white/55 sm:text-[0.95rem]">
          Questions about size, fabric, an order, or delivery. Write through the
          form — we reply within one to two business days.
        </p>
      </header>

      <section className="px-6 pb-20 pt-12 sm:px-10 sm:pb-28 sm:pt-16 lg:px-20 xl:px-28">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_260px] lg:gap-16">
          <div className="border border-[var(--si-mist)] bg-white p-8 sm:p-10 lg:p-12">
            <div className="mb-10 border-t-2 border-[var(--si-deep-brown)] pt-8 sm:mb-12">
              <h2 className="nn-display text-2xl font-light text-[var(--si-deep-brown)] sm:text-[1.75rem]">
                Send a message
              </h2>
              <p className="mt-2 text-xs font-light text-[var(--si-fog)]">
                We read every note. Please do not include payment details.
              </p>
            </div>

            {submitted ? (
              <div className="py-16 text-center sm:py-20">
                <p className="nn-display mb-3 text-2xl font-light text-[var(--si-deep-brown)]">
                  Message received
                </p>
                <p className="mx-auto mb-8 max-w-sm text-sm font-light leading-[1.9] text-[var(--si-muted)]">
                  Thank you for writing to Velora. We will reply to the email
                  you entered on the form.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="nn-link-quiet"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-7"
                  noValidate
                >
                  <FormField
                    control={form.control}
                    name="inquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>
                          I am writing about
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {inquiryOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => field.onChange(opt.value)}
                                className={`px-4 py-2 text-[0.62rem] font-light uppercase tracking-[0.18em] transition-colors ${
                                  inquiryType === opt.value
                                    ? "bg-[var(--si-deep-brown)] text-[var(--si-cream)]"
                                    : "border border-[var(--si-mist)] text-[var(--si-muted)] hover:text-[var(--si-deep-brown)]"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage className="mt-2 text-xs text-[var(--si-deep-brown)]" />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@email.com"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="sm:max-w-[calc(50%-0.75rem)]">
                        <FormLabel className={labelClass}>
                          Phone{" "}
                          <span className="normal-case font-light tracking-normal text-[var(--si-fog)]">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Your phone number"
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about the piece, size, or order you need help with."
                            rows={5}
                            className={`${inputClass} min-h-[130px] resize-none py-3 leading-[1.8]`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <ButtonLoading
                      type="submit"
                      text="Send Message"
                      loading={loading}
                      className="nn-btn-primary h-auto w-full cursor-pointer rounded-none disabled:opacity-60 sm:w-auto"
                    />
                  </div>
                </form>
              </Form>
            )}
          </div>

          <aside className="space-y-8 lg:pt-4">
            <div>
              <p className={labelClass}>Help</p>
              <p className="text-sm font-light leading-relaxed text-[var(--si-muted)]">
                Size, orders, and delivery answers are on our FAQ and care
                pages. Use the form for anything else.
              </p>
            </div>

            <ul className="space-y-3 border-t border-[var(--si-mist)] pt-6">
              <li>
                <Link href="/faq" className="text-sm text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/wall-art-size-guide"
                  className="text-sm text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)]"
                >
                  Size guide
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-delivery"
                  className="text-sm text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)]"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns-refunds"
                  className="text-sm text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)]"
                >
                  Returns
                </Link>
              </li>
            </ul>

          </aside>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
