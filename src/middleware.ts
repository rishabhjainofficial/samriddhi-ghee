import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login and /admin/api/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token =
      req.cookies.get("sanvrit_admin_token")?.value ||
      req.cookies.get("samriddhi_admin_token")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
