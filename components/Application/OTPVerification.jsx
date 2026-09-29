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
import {
  AuthHeading,
  authButtonClass,
  authLabelClass,
  authMessageClass,
} from "./authUi";

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOtpVerification)}>
        <AuthHeading
          eyebrow="Verification"
          title="Enter your code"
          text={`A six-digit code is on its way to ${email}. It stays valid for 10 minutes.`}
        />
        <p className="-mt-4 mb-6 text-center text-[13px] leading-relaxed text-[#9a8170] sm:text-left">
          If it is not in your inbox, check spam or junk.
        </p>

        <div className="mb-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${authLabelClass} block text-center sm:text-left`}>
                  One-time code
                </FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field} containerClassName="justify-center sm:justify-start">
                    <InputOTPGroup className="gap-1 sm:gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-11 w-9 rounded-xl border border-[#f1e3d4] bg-[#FFF8F2] text-[16px] font-bold text-[#3a2416] shadow-none first:rounded-xl first:border last:rounded-xl sm:h-[3.15rem] sm:w-11 sm:rounded-2xl sm:first:rounded-2xl sm:last:rounded-2xl data-[active=true]:z-10 data-[active=true]:border-[#E45700] data-[active=true]:ring-0"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className={`${authMessageClass} text-center sm:text-left`} />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading
          loading={loading}
          type="submit"
          text="Verify code"
          className={authButtonClass}
        />

        <div className="mt-5 text-center">
          {isResendingOtp ? (
            <span className="text-[14px] font-semibold text-[#8a6754]">Sending a new code…</span>
          ) : (
            <button
              onClick={resendOTP}
              type="button"
              className="cursor-pointer text-[14px] font-bold text-[#E45700] hover:text-[#c2410c]"
            >
              Resend code
            </button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default OTPVerification;
