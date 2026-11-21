import { NextResponse } from "next/server";
import { authenticateAdmin, createSessionToken } from "@/lib/auth";

// In-memory rate limiter for login protection against brute-force
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function checkRateLimit(key: string): { allowed: boolean; waitSeconds?: number } {
  const record = loginAttempts.get(key);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  if (record.lockedUntil <= now && record.count >= 5) {
    loginAttempts.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15-minute lock
  }
  loginAttempts.set(key, record);
}

function clearRateLimit(key: string) {
  loginAttempts.delete(key);
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const rateKey = email.trim().toLowerCase();
    const rateCheck = checkRateLimit(rateKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many failed login attempts. Account temporarily locked. Please try again in ${rateCheck.waitSeconds}s.` },
        { status: 429 }
      );
    }

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      recordFailedAttempt(rateKey);
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Reset rate limit on valid credentials
    clearRateLimit(rateKey);

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
