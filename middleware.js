import { NextResponse } from "next/server";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoute";
import { jwtVerify } from "jose";
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute";
import {
  accessTokenCookieOptions,
  slideSessionCookies,
  TRUSTED_DEVICE_COOKIE,
} from "./lib/authSession";
import { CURRENCY_COOKIE, CURRENCY_PKR } from "./lib/currency";

function clearAccessToken(response) {
  response.cookies.set({
    ...accessTokenCookieOptions({ maxAge: 0 }),
    value: "",
  });
  return response;
}

function applyCurrencyCookie(response) {
  response.cookies.set({
    name: CURRENCY_COOKIE,
    value: CURRENCY_PKR,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
  return response;
}

async function withSessionRefresh(response, payload, request) {
  await slideSessionCookies(
    response.cookies,
    payload,
    request.cookies.get(TRUSTED_DEVICE_COOKIE)?.value,
  );
  return response;
}

function isAuthGuardedPath(pathname) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/my-account") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/order-details") ||
    pathname.startsWith("/auth")
  );
}

async function handleAuth(request) {
  const pathname = request.nextUrl.pathname;
  const hasToken = request.cookies.has("access_token");

  // No token: allow auth pages, protect everything else matched by config
  if (!hasToken) {
    if (pathname.startsWith("/auth")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
  }

  try {
    const access_token = request.cookies.get("access_token").value;
    const { payload } = await jwtVerify(
      access_token,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY)
    );

    const role = payload.role;

    // Unknown/missing role — treat as unauthenticated
    if (role !== "admin" && role !== "user") {
      if (pathname.startsWith("/auth")) {
        return clearAccessToken(NextResponse.next());
      }
      return clearAccessToken(
        NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
      );
    }

    // Logged-in users should not see auth pages
    if (pathname.startsWith("/auth")) {
      const destination =
        role === "admin" ? ADMIN_DASHBOARD : USER_DASHBOARD;
      return withSessionRefresh(
        NextResponse.redirect(new URL(destination, request.nextUrl)),
        payload,
        request
      );
    }

    // Role guards — send users to their own dashboard (never back to login)
    // to avoid redirect loops with a still-valid token.
    if (pathname.startsWith("/admin") && role !== "admin") {
      return withSessionRefresh(
        NextResponse.redirect(new URL(USER_DASHBOARD, request.nextUrl)),
        payload,
        request
      );
    }

    if (
      (pathname.startsWith("/my-account") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/orders") ||
        pathname.startsWith("/order-details")) &&
      role !== "user"
    ) {
      return withSessionRefresh(
        NextResponse.redirect(new URL(ADMIN_DASHBOARD, request.nextUrl)),
        payload,
        request
      );
    }

    return withSessionRefresh(NextResponse.next(), payload, request);
  } catch (error) {
    // Invalid/expired token: clear it so we never redirect-loop on /auth/*
    console.log("Auth middleware token error:", error?.message || error);

    if (pathname.startsWith("/auth")) {
      return clearAccessToken(NextResponse.next());
    }

    return clearAccessToken(
      NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
    );
  }
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  let response;
  if (isAuthGuardedPath(pathname)) {
    response = await handleAuth(request);
  } else {
    response = NextResponse.next();
  }

  return applyCurrencyCookie(response);
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and Next internals.
     * Currency cookie is set on every page load via Vercel IP country.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
