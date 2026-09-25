"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { z } from "zod";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";
import { getErrorMessage, showToast } from "@/lib/showToast";

const inputClass =
  "h-11 rounded-none border border-[var(--si-mist)] bg-[var(--si-cream)] px-4 text-sm font-light text-[var(--si-deep-brown)] shadow-none placeholder:text-[var(--si-fog)] focus-visible:ring-0 focus-visible:border-[var(--si-burnt-orange)] transition-colors duration-300";

const labelClass =
  "text-[0.62rem] tracking-[0.2em] uppercase font-medium text-[var(--si-muted)]";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const formSchema = zSchema
    .pick({
      name: true,
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and confirm password must be same.",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegisterSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: registerResponse } = await axios.post(
        "/api/auth/register",
        values
      );
      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }

      form.reset();
      showToast("success", registerResponse.message);
    } catch (error) {
      showToast("error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      <div className="border border-[var(--si-mist)] bg-white">
        <div className="h-0.5 bg-[var(--si-deep-brown)]" />

        <div className="px-8 sm:px-10 py-10 sm:py-12">
          <div className="text-center mb-10">
            <p className="nn-label text-[var(--si-burnt-orange)] mb-4">Velora</p>
            <h1 className="nn-display text-3xl sm:text-4xl font-light text-[var(--si-deep-brown)]">
              Create Account
            </h1>
            <div className="nn-hairline-gold w-12 mx-auto mt-6 mb-5" />
            <p className="text-sm font-light leading-[1.9] text-[var(--si-muted)]">
              Register to shop Velora clothing, track orders, and save your details.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegisterSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="your name"
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
                        placeholder="example@gmail.com"
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
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className={labelClass}>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="***********"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className={labelClass}>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type={isTypePassword ? "password" : "text"}
                        placeholder="***********"
                        className={`${inputClass} pr-11`}
                        {...field}
                      />
                    </FormControl>
                    <button
                      className="absolute right-3 top-[2.15rem] cursor-pointer text-[var(--si-fog)] hover:text-[var(--si-deep-brown)] transition-colors"
                      type="button"
                      onClick={() => setIsTypePassword(!isTypePassword)}
                      aria-label={
                        isTypePassword ? "Show password" : "Hide password"
                      }
                    >
                      {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                    <FormMessage className="text-xs text-[var(--si-deep-brown)]" />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Create Account"
                  className="w-full nn-btn-primary h-auto rounded-none cursor-pointer disabled:opacity-60"
                />
              </div>

              <p className="text-center text-sm font-light text-[var(--si-muted)] pt-1">
                Already have an account?{" "}
                <Link
                  href={WEBSITE_LOGIN}
                  className="text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)] transition-colors underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
