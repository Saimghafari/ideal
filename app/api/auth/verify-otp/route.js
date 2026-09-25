import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { cookies } from "next/headers";
import { applySessionCookie, signSessionToken } from "@/lib/authSession";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema.pick({
      otp: true,
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field.",
        validatedData.error
      );
    }

    const { email, otp } = validatedData.data;

    const getOtpData = await OTPModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 404, "Invalid or expired otp.");
    }

    const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();
    if (!getUser) {
      return response(false, 404, "User not found.");
    }

    const loggedInUserData = {
      _id: getUser._id.toString(),
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    };

    const token = await signSessionToken(loggedInUserData);
    const cookieStore = await cookies();
    applySessionCookie(cookieStore, token);

    // remove otp after validation
    await getOtpData.deleteOne();

    return response(true, 200, "Login successfull.", loggedInUserData);
  } catch (error) {
    return catchError(error);
  }
}
