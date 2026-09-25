import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { catchError, response } from "@/lib/helperFunction";
import {
  applySessionCookie,
  shouldRefreshSession,
  signSessionToken,
} from "@/lib/authSession";

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

    if (shouldRefreshSession(payload)) {
      const token = await signSessionToken({
        _id: payload._id,
        role: payload.role,
        name: payload.name,
        avatar: payload.avatar,
      });
      applySessionCookie(cookieStore, token);
    }

    return response(true, 200, "Authenticated.");
  } catch (error) {
    return catchError(error);
  }
}
