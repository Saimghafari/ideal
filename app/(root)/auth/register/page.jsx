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
import {
  AuthHeading,
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authMessageClass,
} from "@/components/Application/authUi";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    <>
      <AuthHeading
        eyebrow="Join Super Ideal"
        title="Create account"
        text="Save your details for sweets, bakery, gift boxes, and celebration orders."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authLabelClass}>Full name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Your name"
                    className={authInputClass}
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className={authMessageClass} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authLabelClass}>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@email.com"
                    className={authInputClass}
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className={authMessageClass} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authLabelClass}>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className={`${authInputClass} pr-12`}
                      autoComplete="new-password"
                      {...field}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#b7a498] hover:text-[#3a2416]"
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className={authMessageClass} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authLabelClass}>Confirm password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      className={`${authInputClass} pr-12`}
                      autoComplete="new-password"
                      {...field}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#b7a498] hover:text-[#3a2416]"
                      type="button"
                      onClick={() => setShowConfirm((value) => !value)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className={authMessageClass} />
              </FormItem>
            )}
          />

          <div className="pt-1">
            <ButtonLoading
              loading={loading}
              type="submit"
              text="Create account"
              className={authButtonClass}
            />
          </div>

          <p className="pt-1 text-center text-[14.5px] text-[#6b5142]">
            Already have an account?{" "}
            <Link href={WEBSITE_LOGIN} className={authLinkClass}>
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default RegisterPage;
