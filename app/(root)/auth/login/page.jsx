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
import { useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import {
  AuthHeading,
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authMessageClass,
} from "@/components/Application/authUi";

const LoginPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
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

  const redirectAfterLogin = (role) => {
    if (searchParams.has("callback")) {
      return searchParams.get("callback");
    }
    return role === "admin" ? ADMIN_DASHBOARD : USER_DASHBOARD;
  };

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

      form.reset();
      showToast("success", logPKResponse.message);

      if (logPKResponse.data?._id) {
        dispatch(login(logPKResponse.data));
        window.location.href = redirectAfterLogin(logPKResponse.data.role);
        return;
      }

      setOtpEmail(values.email);
    } catch (error) {
      showToast("error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

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
      window.location.href = redirectAfterLogin(otpResponse.data.role);
    } catch (error) {
      showToast("error", getErrorMessage(error));
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  if (otpEmail) {
    return (
      <OTPVerification
        email={otpEmail}
        onSubmit={handleOtpVerification}
        loading={otpVerificationLoading}
      />
    );
  }

  return (
    <>
      <AuthHeading
        eyebrow="Super Ideal"
        title="Sign in"
        text="Open your account to track orders, save details, and checkout sweets and bakery."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-5">
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
                <div className="flex items-center justify-between gap-3">
                  <FormLabel className={authLabelClass}>Password</FormLabel>
                  <Link
                    href={WEBSITE_RESETPASSWORD}
                    className="text-[12.5px] font-bold text-[#8a6754] hover:text-[#E45700]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isTypePassword ? "password" : "text"}
                      placeholder="Enter your password"
                      className={`${authInputClass} pr-12`}
                      autoComplete="current-password"
                      {...field}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#b7a498] hover:text-[#3a2416]"
                      type="button"
                      onClick={() => setIsTypePassword(!isTypePassword)}
                      aria-label={isTypePassword ? "Show password" : "Hide password"}
                    >
                      {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className={authMessageClass} />
              </FormItem>
            )}
          />

          <ButtonLoading
            loading={loading}
            type="submit"
            text="Sign in"
            className={authButtonClass}
          />

          <p className="pt-1 text-center text-[14.5px] text-[#6b5142]">
            New here?{" "}
            <Link href={WEBSITE_REGISTER} className={authLinkClass}>
              Create an account
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default LoginPage;
