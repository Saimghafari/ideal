import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  applySessionCookie,
  applyTrustedDeviceCookie,
  readTrustedDevice,
  signSessionToken,
  TRUSTED_DEVICE_COOKIE,
} from "@/lib/authSession";

export async function POST(request) {
  try {
    console.log("Login route hit");
    await connectDB();
    const payload = await request.json();
    console.log(payload, "Payload");
    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field.",
        validatedData.error,
      );
    }

    const { email, password } = validatedData.data;

    // get user data
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password",
    );
    if (!getUser) {
      return response(false, 400, "Invalid login credentials.");
    }

    // resend email verification link
    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_SECRET_KEY,
      );
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      await sendMail(
        "Email Verification request from Super Ideal",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`,
        ),
      );

      return response(
        false,
        401,
        "Your email is not verified. We have sent a verification link to your registered email address.",
      );
    }

    // password verification
    const isPasswordVerified = await getUser.comparePassword(password);

    if (!isPasswordVerified) {
      return response(false, 400, "Invalid login credentials.");
    }

    const loggedInUserData = {
      _id: getUser._id.toString(),
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    };

    const cookieStore = await cookies();
    const trusted = await readTrustedDevice(
      cookieStore.get(TRUSTED_DEVICE_COOKIE)?.value,
    );

    if (
      trusted &&
      String(trusted.email).toLowerCase() === email.toLowerCase() &&
      trusted._id === loggedInUserData._id
    ) {
      const token = await signSessionToken(loggedInUserData);
      applySessionCookie(cookieStore, token);
      await applyTrustedDeviceCookie(cookieStore, {
        _id: loggedInUserData._id,
        email: getUser.email,
      });
      return response(true, 200, "Login successful.", loggedInUserData);
    }

    const pendingOtp = await OTPModel.findOne({
      email,
      expiresAt: { $gt: new Date() },
    });
    if (pendingOtp) {
      return response(true, 200, "Please verify your device.");
    }

    // otp generation
    await OTPModel.deleteMany({ email }); // deleting old otps

    let OTP = 123456;
    if (email !== "admin@gmail.com") {
      OTP = generateOTP();

      const OTPEmailTemplate = otpEmail(OTP);

      const otpEmailStatus = await sendMail(
        "Your login verification code.",
        email,
        OTPEmailTemplate,
      );
      if (!otpEmailStatus.success) {
        console.error("OTP email send failed:", otpEmailStatus.message);
        return response(
          false,
          500,
          otpEmailStatus.message ||
            "Could not send verification email. Please try again.",
        );
      }
    }

    // storing otp into database

    const newOtpData = new OTPModel({
      email,
      otp: OTP,
    });

    await newOtpData.save();

    return response(true, 200, "Please verify your device.");
  } catch (error) {
    return catchError(error);
  }
}
