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
import {
  AuthHeading,
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authMessageClass,
} from "@/components/Application/authUi";

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

  if (otpEmail && !isOtpVerified) {
    return (
      <OTPVerification
        email={otpEmail}
        onSubmit={handleOtpVerification}
        loading={otpVerificationLoading}
      />
    );
  }

  if (isOtpVerified) {
    return <UpdatePassword email={otpEmail} />;
  }

  return (
    <>
      <AuthHeading
        eyebrow="Account"
        title="Reset password"
        text="Enter the email on your account. We’ll send a one-time code so you can choose a new password."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEmailVerification)} className="space-y-5">
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

          <ButtonLoading
            loading={emailVerificationLoading}
            type="submit"
            text="Send code"
            className={authButtonClass}
          />

          <p className="pt-1 text-center text-[14.5px] text-[#6b5142]">
            Remember your password?{" "}
            <Link href={WEBSITE_LOGIN} className={authLinkClass}>
              Back to sign in
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default ResetPassword;
