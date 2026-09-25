import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ButtonLoading from "./ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { getErrorMessage, showToast } from "@/lib/showToast";
import axios from "axios";

const OTPVerification = ({ email, onSubmit, loading }) => {
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const formSchema = zSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  const handleOtpVerification = async (values) => {
    onSubmit(values);
  };

  const resendOTP = async () => {
    try {
      setIsResendingOtp(true);
      const { data: resendOtpResponse } = await axios.post(
        "/api/auth/resend-otp",
        { email }
      );
      if (!resendOtpResponse.success) {
        throw new Error(resendOtpResponse.message);
      }
      showToast("success", resendOtpResponse.message);
    } catch (error) {
      showToast("error", getErrorMessage(error));
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerification)}>
          <div className="text-center mb-8">
            <p className="nn-label text-[var(--si-deep-brown)] mb-4">Verification</p>
            <h1 className="nn-display text-2xl sm:text-3xl font-light text-[var(--si-deep-brown)] mb-4">
              Enter your OTP
            </h1>
            <div className="nn-hairline-gold w-12 mx-auto mb-5" />
            <p className="text-sm font-light leading-[1.9] text-[var(--si-muted)]">
              We have sent a one-time password to your email. It is valid for 10
              minutes only.
            </p>
            <p className="mt-4 text-xs font-light leading-[1.75] text-[var(--si-fog)]">
              If you do not see it shortly, please check your spam or junk folder.
            </p>
          </div>

          <div className="mb-6 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[0.62rem] tracking-[0.2em] uppercase font-medium text-[var(--si-muted)] text-center block w-full">
                    One-time Password
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            className="text-lg size-11 rounded-none border border-[var(--si-mist)] bg-[var(--si-cream)] shadow-none data-[active=true]:border-[var(--si-burnt-orange)] data-[active=true]:ring-0"
                            index={index}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-xs text-[var(--si-deep-brown)] text-center" />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-3">
            <ButtonLoading
              loading={loading}
              type="submit"
              text="Verify"
              className="w-full nn-btn-primary h-auto rounded-none cursor-pointer disabled:opacity-60"
            />
            <div className="text-center mt-6">
              {!isResendingOtp ? (
                <button
                  onClick={resendOTP}
                  type="button"
                  className="text-[0.65rem] tracking-[0.16em] uppercase font-light text-[var(--si-muted)] hover:text-[var(--si-deep-brown)] cursor-pointer transition-colors"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-sm font-light text-[var(--si-muted)]">
                  Resending….
                </span>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OTPVerification;
