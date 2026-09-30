import cloudinary, { isCloudinaryConfigured } from "@/lib/cloudinary";
import { catchError } from "@/lib/helperFunction";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    if (!isCloudinaryConfigured) {
      return NextResponse.json(
        { success: false, message: "Cloudinary is not configured." },
        { status: 503 }
      );
    }

    const payload = await request.json();
    const { paramsToSign } = payload;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.NEXT_PUBLIC_CLOUDINARY_SECRET_KEY
    );

    return NextResponse.json({ signature });
  } catch (error) {
    return catchError(error);
  }
}
