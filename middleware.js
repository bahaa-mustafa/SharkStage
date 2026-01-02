// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get("token"); // ✅ actual httpOnly cookie set by backend

  // redirect /sign to /sign/in
  if (pathname === "/sign") {
    return NextResponse.redirect(`${origin}/sign/in`);
  }

  // if logged in → block access to sign pages
  if (token && pathname.startsWith("/sign")) {
    return NextResponse.redirect(`${origin}/`);
  }

  // if not logged in → block dashboard routes
  if (!token && pathname.startsWith("/account")) {
    return NextResponse.redirect(`${origin}/sign/in`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign", "/sign/:path*", "/account/:path*"],
};
