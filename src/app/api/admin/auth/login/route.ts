import { NextResponse } from "next/server";
import { authenticateAdmin, createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(admin);

    const response = NextResponse.json({
      success: true,
      admin: { name: admin.name, email: admin.email, role: admin.role },
    });

    response.cookies.set("sanvrit_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 86400, // 7 days
      path: "/",
    });
    // Set legacy for seamless migration
    response.cookies.set("samriddhi_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 86400,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login error" }, { status: 500 });
  }
}
