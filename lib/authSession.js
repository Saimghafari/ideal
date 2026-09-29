import { SignJWT } from "jose";
import { SITE_HOST } from "@/lib/siteMeta";

export const ACCESS_TOKEN_COOKIE = "access_token";

/** Idle/absolute session length after login or last refresh. */
export const SESSION_JWT_EXPIRATION = "30d";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** Re-issue the cookie when fewer than 7 days remain so active users stay signed in. */
export const SESSION_REFRESH_THRESHOLD_SECONDS = 60 * 60 * 24 * 7;

export function accessTokenCookieOptions({
  maxAge = SESSION_MAX_AGE_SECONDS,
} = {}) {
  const isProd = process.env.NEXT_PUBLIC_NODE_ENV === "production";

  return {
    name: ACCESS_TOKEN_COOKIE,
    httpOnly: true,
    path: "/",
    secure: isProd,
    sameSite: "lax",
    maxAge,
    ...(isProd ? { domain: `.${SITE_HOST.replace(/^www\./, "")}` } : {}),
  };
}

export async function signSessionToken(userData) {
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY);

  return new SignJWT(userData)
    .setIssuedAt()
    .setExpirationTime(SESSION_JWT_EXPIRATION)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
}

export function shouldRefreshSession(payload) {
  if (!payload?.exp) return false;
  const remaining = payload.exp - Math.floor(Date.now() / 1000);
  return remaining < SESSION_REFRESH_THRESHOLD_SECONDS;
}

export async function applySessionCookie(cookieTarget, token) {
  cookieTarget.set({
    ...accessTokenCookieOptions(),
    value: token,
  });
}
