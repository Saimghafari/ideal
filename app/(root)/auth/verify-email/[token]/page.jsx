"use client";
import axios from "axios";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { WEBSITE_HOME, WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { AuthHeading } from "@/components/Application/authUi";

const EmailVerification = ({ params }) => {
  const { token } = use(params);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    let active = true;
    const verify = async () => {
      try {
        const { data: verificationResponse } = await axios.post(
          "/api/auth/verify-email",
          { token }
        );
        if (!active) return;
        setStatus(verificationResponse.success ? "success" : "failed");
      } catch {
        if (active) setStatus("failed");
      }
    };

    verify();
    return () => {
      active = false;
    };
  }, [token]);

  if (status === "pending") {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-[#f1e3d4] border-t-[#E45700]" />
        <AuthHeading
          align="center"
          eyebrow="Email"
          title="Checking your link"
          text="We’re confirming this address for your Super Ideal account."
        />
      </div>
    );
  }

  const verified = status === "success";

  return (
    <div className="text-center sm:text-left">
      <div
        className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full sm:mx-0 ${
          verified ? "bg-[#FFF1E6] text-[#E45700]" : "bg-[#fff1f0] text-[#c2410c]"
        }`}
      >
        {verified ? (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="m8.2 12.2 2.4 2.4 5.2-5.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" strokeLinecap="round" />
            <circle cx="12" cy="16.2" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        )}
      </div>
      <AuthHeading
        eyebrow="Email"
        title={verified ? "Email confirmed" : "Link could not be confirmed"}
        text={
          verified
            ? "Your address is verified. Sign in to order sweets, bakery, and gift boxes."
            : "This link is invalid or has already been used. Request a new one from sign in, or continue to the shop."
        }
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={verified ? WEBSITE_LOGIN : WEBSITE_HOME}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-[#E45700] text-[15px] font-bold text-white shadow-[0_8px_18px_rgba(228,87,0,0.28)] hover:bg-[#cf4c00]"
        >
          {verified ? "Sign in" : "Continue shopping"}
        </Link>
        <Link
          href={verified ? WEBSITE_HOME : WEBSITE_LOGIN}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full border-2 border-[#E45700] text-[15px] font-bold text-[#E45700] hover:bg-[#FFF8F2]"
        >
          {verified ? "Visit the shop" : "Back to sign in"}
        </Link>
      </div>
    </div>
  );
};

export default EmailVerification;
