import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import config from "@/app/lib/server/config";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const authenticatedRoutes = [pathname.startsWith("/dashboard")];

  if (authenticatedRoutes.includes(true)) {
    const cookie = request.cookies.get("jwt-token");

    if (!cookie || !cookie?.value) {
      const url = request.nextUrl.clone();

      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(cookie.value, secret);
    } catch (error) {
      console.error(error);
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
}
