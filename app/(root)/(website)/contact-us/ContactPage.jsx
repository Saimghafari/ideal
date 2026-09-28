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
import {
  SHOP_EMAIL,
  SHOP_PHONE_DISPLAY,
  SHOP_PHONE_TEL,
  branches,
  directionsUrl,
} from "@/lib/locations";
import { showToast } from "@/lib/showToast";
import {
  WEBSITE_CAKES,
  WEBSITE_CATERING,
  WEBSITE_HOME,
  WEBSITE_LOCATIONS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inquiryOptions = [
  { value: "general", label: "General" },
  { value: "order", label: "Orders" },
  { value: "commission", label: "Cakes" },
  { value: "visit", label: "Shop visit" },
];

const helpLinks = [
  { label: "Locations", href: WEBSITE_LOCATIONS },
  { label: "Cakes", href: WEBSITE_CAKES },
  { label: "Catering", href: WEBSITE_CATERING },
  { label: "Products", href: WEBSITE_SHOP },
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

const labelClass = "mb-2 block text-[12.5px] font-bold text-[#3a2416]";

const inputClass =
  "h-12 rounded-xl border-[#ead9c6] bg-[#FFF8F2] px-4 text-[14.5px] text-[#3a2416] shadow-none placeholder:text-[#b39a88] focus-visible:border-[#E45700] focus-visible:ring-[#E45700]/20";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M8.2 4.8h2.1l1.1 2.7-1.4 1.1a12.4 12.4 0 0 0 5.4 5.4l1.1-1.4 2.7 1.1v2.1c0 .7-.5 1.3-1.2 1.4A14.2 14.2 0 0 1 6.8 6c.1-.7.7-1.2 1.4-1.2Z" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.2l2.6 1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="10.5" r="2.1" />
    </svg>
  );
}

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
    <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
      <header>
        <div className="relative h-[240px] overflow-hidden sm:h-[290px] lg:h-[340px]">
          <Image
            src="/assets/home/si-storefront.png"
            alt="Super Ideal bakery storefront"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_42%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(43,24,16,0.88)_0%,rgba(43,24,16,0.62)_46%,rgba(43,24,16,0.22)_78%)]" />
          <div className="relative mx-auto flex h-full w-full max-w-[1680px] flex-col justify-end px-4 pb-6 pt-5 sm:justify-center sm:px-6 sm:pb-8 xl:px-10">
            <nav
              aria-label="Breadcrumb"
              className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-white/75 sm:mb-3"
            >
              <Link href={WEBSITE_HOME} className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">›</span>
              <span className="font-medium text-white">Contact</span>
            </nav>
            <p className="font-script text-[1.85rem] leading-none text-[#f0c36a] sm:text-[2.25rem]">
              We would love to hear from you
            </p>
            <h1 className="mt-1 font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[2.7rem] lg:text-[3.2rem]">
              Contact Us
            </h1>
            <p className="mt-2 max-w-[34rem] text-[13.5px] leading-relaxed text-white/85 sm:text-[15.5px]">
              Orders, celebration cakes, catering, and shop visits. Write to the counter — we reply within one to two business days.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1680px] px-4 pb-14 pt-5 sm:px-6 sm:pt-7 xl:px-10">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href={`tel:${SHOP_PHONE_TEL}`}
            className="flex items-center gap-3 rounded-[18px] border border-[#ead9c6] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(75,46,30,0.05)] transition hover:border-[#E45700]"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1e6] text-[#E45700]">
              <PhoneIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a6754]">
                Call the shop
              </span>
              <span className="mt-0.5 block text-[15px] font-bold">{SHOP_PHONE_DISPLAY}</span>
            </span>
          </a>
          <a
            href={`mailto:${SHOP_EMAIL}`}
            className="flex items-center gap-3 rounded-[18px] border border-[#ead9c6] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(75,46,30,0.05)] transition hover:border-[#E45700]"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1e6] text-[#E45700]">
              <MailIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a6754]">
                Email
              </span>
              <span className="mt-0.5 block truncate text-[15px] font-bold">{SHOP_EMAIL}</span>
            </span>
          </a>
          <div className="flex items-center gap-3 rounded-[18px] border border-[#ead9c6] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(75,46,30,0.05)]">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1e6] text-[#E45700]">
              <ClockIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a6754]">
                Saddar Road hours
              </span>
              <span className="mt-0.5 block text-[15px] font-bold">Mon – Sat, 9 AM – 10 PM</span>
            </span>
          </div>
        </div>

        <div className="mt-5 grid items-start gap-5 lg:mt-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.72fr)] lg:gap-6">
          <div className="rounded-[22px] border border-[#f1e3d4] bg-white px-4 py-6 shadow-[0_12px_28px_rgba(75,46,30,0.06)] sm:px-7 sm:py-8 lg:px-9 lg:py-9">
            <p className="font-script text-[1.7rem] leading-none text-[#E45700] sm:text-[1.95rem]">
              Write to the counter
            </p>
            <h2 className="mt-1 font-display text-[1.45rem] font-semibold tracking-[-0.02em] sm:text-[1.75rem]">
              Send a message
            </h2>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-[#6b5142] sm:text-[14.5px]">
              Tell us the branch, the order, or the occasion. Please do not include card or payment details.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-[18px] border border-[#ead9c6] bg-[#FFF8F2] px-5 py-12 text-center sm:px-8 sm:py-16">
                <p className="font-script text-[2.1rem] leading-none text-[#E45700]">Thank you</p>
                <p className="mt-2 font-display text-[1.55rem] font-semibold">Message received</p>
                <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-[#6b5142]">
                  We have your note and will reply to the email you entered, usually within one to two business days.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[#ead9c6] bg-white px-6 text-[13.5px] font-bold text-[#3a2416] hover:border-[#E45700]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5" noValidate>
                  <FormField
                    control={form.control}
                    name="inquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>I am writing about</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {inquiryOptions.map((opt) => {
                              const active = inquiryType === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => field.onChange(opt.value)}
                                  className={`h-10 rounded-full px-4 text-[13px] font-bold transition ${
                                    active
                                      ? "bg-[#3B2416] text-white"
                                      : "border border-[#ead9c6] bg-[#FFF8F2] text-[#6b5142] hover:border-[#E45700] hover:text-[#3a2416]"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-[#E45700]" />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Full name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" className={inputClass} {...field} />
                          </FormControl>
                          <FormMessage className="text-xs text-[#E45700]" />
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
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-[#E45700]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="sm:max-w-[calc(50%-0.625rem)]">
                        <FormLabel className={labelClass}>
                          Phone <span className="font-semibold text-[#b39a88]">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="03xx xxxxxxx"
                            className={inputClass}
                            autoComplete="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-[#E45700]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Your message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us the branch, the cake, or the order you need help with."
                            rows={5}
                            className={`${inputClass} min-h-[140px] resize-none py-3 leading-relaxed`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-[#E45700]" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-1">
                    <ButtonLoading
                      type="submit"
                      text="Send message"
                      loading={loading}
                      className="h-12 w-full cursor-pointer rounded-full bg-[#E45700] px-8 text-[14px] font-bold text-white shadow-none hover:bg-[#cf4c00] disabled:opacity-60 sm:w-auto"
                    />
                  </div>
                </form>
              </Form>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[22px] bg-[#3B2416] px-5 py-6 text-[#f6e7d6] sm:px-6 sm:py-7">
              <p className="font-script text-[1.85rem] leading-none text-[#f0c36a]">Visit us</p>
              <h2 className="mt-1 font-display text-[1.35rem] font-semibold text-white">
                Super Ideal, Faisalabad
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#f6e7d6]/80">
                One phone line and one email for every branch. Mention which shop you mean.
              </p>
              <ul className="mt-5 space-y-3 text-[14.5px]">
                <li className="flex gap-3">
                  <span className="mt-0.5 text-[#f0c36a]">
                    <PinIcon />
                  </span>
                  <span>
                    <span className="block font-semibold text-white">Saddar Road, Faisalabad</span>
                    <span className="text-[13px] text-[#f6e7d6]/70">Pakistan</span>
                  </span>
                </li>
                <li>
                  <a href={`tel:${SHOP_PHONE_TEL}`} className="font-semibold text-white hover:text-[#f0c36a]">
                    {SHOP_PHONE_DISPLAY}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SHOP_EMAIL}`} className="break-all font-semibold text-white hover:text-[#f0c36a]">
                    {SHOP_EMAIL}
                  </a>
                </li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[13.5px]">
                {helpLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="underline decoration-white/30 underline-offset-4 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#f1e3d4] bg-white px-5 py-5 shadow-[0_8px_18px_rgba(75,46,30,0.04)] sm:px-6">
              <h2 className="font-display text-[1.25rem] font-semibold">Our branches</h2>
              <ul className="mt-4 divide-y divide-[#f1e3d4]">
                {branches.map((branch) => (
                  <li key={branch.id} className="py-3.5 first:pt-0 last:pb-0">
                    <p className="font-semibold">{branch.name}</p>
                    <p className="mt-0.5 text-[13.5px] text-[#6b5142]">{branch.address}</p>
                    <p className="mt-0.5 text-[13px] text-[#8a6754]">{branch.hours}</p>
                    <a
                      href={directionsUrl(branch)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 inline-flex text-[13px] font-bold text-[#E45700] hover:text-[#cf4c00]"
                    >
                      Get directions
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                href={WEBSITE_LOCATIONS}
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full border border-[#ead9c6] bg-[#FFF8F2] text-[13.5px] font-bold hover:border-[#E45700]"
              >
                View all locations
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
