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
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";
import { getErrorMessage, showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPVerification";
import UpdatePassword from "@/components/Application/UpdatePassword";

const inputClass =
  "h-11 rounded-none border border-[var(--si-mist)] bg-[var(--si-cream)] px-4 text-sm font-light text-[var(--si-deep-brown)] shadow-none placeholder:text-[var(--si-fog)] focus-visible:ring-0 focus-visible:border-[var(--si-burnt-orange)] transition-colors duration-300";

const labelClass =
  "text-[0.62rem] tracking-[0.2em] uppercase font-medium text-[var(--si-muted)]";

const ResetPassword = () => {
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const formSchema = zSchema.pick({
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailVerification = async (values) => {
    try {
      setEmailVerificationLoading(true);
      const { data: sendOtpResponse } = await axios.post(
        "/api/auth/reset-password/send-otp",
        values
      );
      if (!sendOtpResponse.success) {
        throw new Error(sendOtpResponse.message);
      }
      setOtpEmail(values.email);
      showToast("success", sendOtpResponse.message);
    } catch (error) {
      showToast("error", getErrorMessage(error));
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post(
        "/api/auth/reset-password/verify-otp",
        values
      );
      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }
      showToast("success", otpResponse.message);
      setIsOtpVerified(true);
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
                <p className="nn-label text-[var(--si-deep-brown)] mb-4">Account</p>
                <h1 className="nn-display text-3xl sm:text-4xl font-light text-[var(--si-deep-brown)]">
                  Reset Password
                </h1>
                <div className="nn-hairline-gold w-12 mx-auto mt-6 mb-5" />
                <p className="text-sm font-light leading-[1.9] text-[var(--si-muted)]">
                  Enter your email and we&apos;ll send a one-time code to reset
                  your password.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleEmailVerification)}
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

                  <ButtonLoading
                    loading={emailVerificationLoading}
                    type="submit"
                    text="Send OTP"
                    className="w-full nn-btn-primary h-auto rounded-none cursor-pointer disabled:opacity-60"
                  />

                  <p className="text-center text-sm font-light text-[var(--si-muted)] pt-2">
                    Remember your password?{" "}
                    <Link
                      href={WEBSITE_LOGIN}
                      className="text-[var(--si-deep-brown)] hover:text-[var(--si-burnt-orange)] transition-colors underline underline-offset-4"
                    >
                      Back to sign in
                    </Link>
                  </p>
                </form>
              </Form>
            </>
          ) : !isOtpVerified ? (
            <OTPVerification
              email={otpEmail}
              onSubmit={handleOtpVerification}
              loading={otpVerificationLoading}
            />
          ) : (
            <UpdatePassword email={otpEmail} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
