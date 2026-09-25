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
import {
  USER_DASHBOARD,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD,
} from "@/routes/WebsiteRoute";
import axios from "axios";
import { getErrorMessage, showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";

const inputClass =
  "h-11 rounded-none border border-[var(--si-mist)] bg-[var(--si-cream)] px-4 text-sm font-light text-[var(--si-deep-brown)] shadow-none placeholder:text-[var(--si-fog)] focus-visible:ring-0 focus-visible:border-[var(--si-burnt-orange)] transition-colors duration-300";

const labelClass =
  "text-[0.62rem] tracking-[0.2em] uppercase font-medium text-[var(--si-muted)]";

const LoginPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const [otpEmail, setOtpEmail] = useState();
  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min("3", "Password field is required."),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: logPKResponse } = await axios.post(
        "/api/auth/login",
        values
      );
      if (!logPKResponse.success) {
        throw new Error(logPKResponse.message);
      }

      setOtpEmail(values.email);
      form.reset();
      showToast("success", logPKResponse.message);
    } catch (error) {
      showToast("error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // otp verification
  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post(
        "/api/auth/verify-otp",
        values
      );
      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }
      setOtpEmail("");
      showToast("success", otpResponse.message);

      dispatch(login(otpResponse.data));

      // Use setTimeout to ensure state updates are completed
      setTimeout(() => {
        if (searchParams.has("callback")) {
          const callbackUrl = searchParams.get("callback");
          window.location.href = callbackUrl;
        } else {
          const redirectUrl =
            otpResponse.data.role === "admin"
              ? ADMIN_DASHBOARD
              : USER_DASHBOARD;
          window.location.href = redirectUrl;
        }
      }, 100);
    } catch (error) {
      showToast("error", getErrorMessage(error));
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      <div className="border border-[var(--si-mist)] bg-white">
        <div className="h-0.5 bg-[var(--si-deep-brown)]" />

        <div className="px-8 sm:px-10 py-10 sm:py-12">
          {!otpEmail ? (
            <>
              <div className="text-center mb-10">
                <p className="nn-label text-[var(--si-burnt-orange)] mb-4">Velora</p>
                <h1 className="nn-display text-3xl sm:text-4xl font-light text-[var(--si-deep-brown)]">
                  Sign In
                </h1>
                <div className="nn-hairline-gold w-12 mx-auto mt-6 mb-5" />
                <p className="text-sm font-light leading-[1.9] text-[var(--si-muted)]">
                  Sign in to your Velora account to view orders and checkout.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleLoginSubmit)}
                  className="space-y-6"
                >
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

                  <div className="flex justify-end -mt-2">
                    <Link
                      href={WEBSITE_RESETPASSWORD}
                      className="text-[0.65rem] tracking-[0.12em] uppercase font-light text-[var(--si-muted)] hover:text-[var(--si-deep-brown)] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <ButtonLoading
                    loading={loading}
                    type="submit"
                    text="Sign In"
                    className="w-full nn-btn-primary h-auto rounded-none cursor-pointer disabled:opacity-60"
                  />

                  <p className="text-center text-sm font-light text-[var(--si-muted)] pt-2">
                    Don&apos;t have an account?{" "}
                    <Link
                      href={WEBSITE_REGISTER}
                      className="text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)] transition-colors underline underline-offset-4"
                    >
                      Create account
                    </Link>
                  </p>
                </form>
              </Form>
            </>
          ) : (
            <OTPVerification
              email={otpEmail}
              onSubmit={handleOtpVerification}
              loading={otpVerificationLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
