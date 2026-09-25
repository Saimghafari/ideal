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
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

const inputClass =
  "h-11 rounded-none border border-[var(--si-mist)] bg-[var(--si-cream)] px-4 text-sm font-light text-[var(--si-deep-brown)] shadow-none placeholder:text-[var(--si-fog)] focus-visible:ring-0 focus-visible:border-[var(--si-burnt-orange)] transition-colors duration-300";

const labelClass =
  "text-[0.62rem] tracking-[0.2em] uppercase font-medium text-[var(--si-muted)]";

const UpdatePassword = ({ email }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);

  const formSchema = zSchema
    .pick({
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
      email: email,
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordUpdate = async (values) => {
    try {
      setLoading(true);
      const { data: passwordUpdate } = await axios.put(
        "/api/auth/reset-password/update-password",
        values
      );
      if (!passwordUpdate.success) {
        throw new Error(passwordUpdate.message);
      }

      form.reset();
      showToast("success", passwordUpdate.message);
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <p className="nn-label text-[var(--si-deep-brown)] mb-4">Security</p>
        <h1 className="nn-display text-3xl sm:text-4xl font-light text-[var(--si-deep-brown)]">
          New Password
        </h1>
        <div className="nn-hairline-gold w-12 mx-auto mt-6 mb-5" />
        <p className="text-sm font-light leading-[1.9] text-[var(--si-muted)]">
          Choose a strong password for your Velora account.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePasswordUpdate)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className={labelClass}>Password</FormLabel>
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Confirm Password</FormLabel>
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

          <ButtonLoading
            loading={loading}
            type="submit"
            text="Update Password"
            className="w-full nn-btn-primary h-auto rounded-none cursor-pointer disabled:opacity-60"
          />
        </form>
      </Form>
    </>
  );
};

export default UpdatePassword;
