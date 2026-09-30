import { jwtVerify, SignJWT } from "jose";
import { SITE_HOST } from "@/lib/siteMeta";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const TRUSTED_DEVICE_COOKIE = "trusted_device";

/** Signed-in session lasts 7 days. */
export const SESSION_JWT_EXPIRATION = "7d";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** Same browser can sign in with password only for 7 days after one OTP. */
export const TRUSTED_DEVICE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * After the first day, the next visit starts a fresh 7-day session.
 * A login on day 5 therefore expires 7 days after that login.
 */
export const SESSION_REFRESH_THRESHOLD_SECONDS = 60 * 60 * 24 * 6;

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

function sessionSecret() {
  return new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY);
}

export async function signSessionToken(userData) {
  return new SignJWT(userData)
    .setIssuedAt()
    .setExpirationTime(SESSION_JWT_EXPIRATION)
    .setProtectedHeader({ alg: "HS256" })
    .sign(sessionSecret());
}

export async function signTrustedDevice({ _id, email }) {
  return new SignJWT({
    _id,
    email,
    purpose: "trusted_device",
  })
    .setIssuedAt()
    .setExpirationTime(SESSION_JWT_EXPIRATION)
    .setProtectedHeader({ alg: "HS256" })
    .sign(sessionSecret());
}

export async function readTrustedDevice(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    if (payload.purpose !== "trusted_device" || !payload._id || !payload.email) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function trustedDeviceCookieOptions({
  maxAge = TRUSTED_DEVICE_MAX_AGE_SECONDS,
} = {}) {
  return {
    ...accessTokenCookieOptions({ maxAge }),
    name: TRUSTED_DEVICE_COOKIE,
  };
}

export async function applyTrustedDeviceCookie(cookieTarget, user) {
  const token = await signTrustedDevice(user);
  cookieTarget.set({
    ...trustedDeviceCookieOptions(),
    value: token,
  });
}

export function shouldRefreshSession(payload) {
  if (!payload?.exp) return false;
  const remaining = payload.exp - Math.floor(Date.now() / 1000);
  return remaining > 0 && remaining <= SESSION_REFRESH_THRESHOLD_SECONDS;
}

/** Move the 7-day window forward from this visit, including the saved browser. */
export async function slideSessionCookies(cookieTarget, payload, trustedToken) {
  if (!shouldRefreshSession(payload)) return false;

  const token = await signSessionToken({
    _id: payload._id,
    role: payload.role,
    name: payload.name,
    avatar: payload.avatar,
  });
  applySessionCookie(cookieTarget, token);

  const trusted = await readTrustedDevice(trustedToken);
  if (trusted && trusted._id === payload._id) {
    await applyTrustedDeviceCookie(cookieTarget, {
      _id: payload._id,
      email: trusted.email,
    });
  }

  return true;
}

export async function applySessionCookie(cookieTarget, token) {
  cookieTarget.set({
    ...accessTokenCookieOptions(),
    value: token,
  });
}
