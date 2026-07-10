import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAdminPage = pathname.startsWith("/admin");
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  if (isAdminApi) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (isAdminPage && !isLoginPage && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginPage && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
