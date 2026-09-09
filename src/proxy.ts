import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public Home Landing Page ("/") - accessible to everyone
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Better Auth session cookie names (http and https secure prefix)
  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Redirect authenticated user away from login/register to dashboard
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated user to login for protected dashboard routes
  if (!sessionCookie && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match application paths:
     * - Root (/)
     * - Dashboard & features (/dashboard, /applications, /resumes, /cover-letters, /fit-analysis, /wishlist, /job-market, /users)
     * - Auth routes (/login, /register)
     *
     * Excludes:
     * - Static files (_next, favicon, icons, images, etc.)
     * - API routes (/api)
     */
    "/",
    "/dashboard/:path*",
    "/applications/:path*",
    "/resumes/:path*",
    "/cover-letters/:path*",
    "/fit-analysis/:path*",
    "/wishlist/:path*",
    "/job-market/:path*",
    "/users/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
