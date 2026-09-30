import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { catchError, response } from "@/lib/helperFunction";
import { slideSessionCookies, TRUSTED_DEVICE_COOKIE } from "@/lib/authSession";

export async function GET() {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) {
      return response(false, 401, "Not authenticated.");
    }

    const access_token = cookieStore.get("access_token");
    const { payload } = await jwtVerify(
      access_token.value,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY)
    );

    await slideSessionCookies(
      cookieStore,
      payload,
      cookieStore.get(TRUSTED_DEVICE_COOKIE)?.value,
    );

    return response(true, 200, "Authenticated.");
  } catch (error) {
    return catchError(error);
  }
}
