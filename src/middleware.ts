import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAdminApi = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth/login");

  if (isAdminPage || isAdminApi) {
    const token =
      req.cookies.get("sanvrit_admin_token")?.value ||
      req.cookies.get("samriddhi_admin_token")?.value;

    // Reject missing or malformed token format immediately
    const hasValidFormat = Boolean(token && token.includes(".") && token.split(".").length === 2);

    if (!hasValidFormat) {
      if (isAdminApi) {
        return NextResponse.json(
          { error: "Unauthorized: Administrator session required." },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
