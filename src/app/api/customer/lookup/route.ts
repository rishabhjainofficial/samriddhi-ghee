import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple in-memory rate limiter per IP: max 15 lookups per 60 seconds
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 });
    return false;
  }

  if (entry.count >= 15) {
    return true;
  }

  entry.count++;
  return false;
}

export async function GET(req: Request) {
  try {
    // 1. Rate limiting by IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many lookup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    if (!query || query.length < 5) {
      return NextResponse.json({ found: false });
    }

    const cleanPhone = query.replace(/\D/g, "");

    // Validate query shape: either valid 10-digit phone or valid email format
    const isValidPhone = cleanPhone.length === 10;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);

    if (!isValidPhone && !isValidEmail) {
      return NextResponse.json({ found: false });
    }

    // Search by exact 10-digit phone or exact lowercased email
    let customer = null;
    if (isValidPhone) {
      customer = await prisma.customer.findUnique({
        where: { phone: cleanPhone },
      });
    } else if (isValidEmail) {
      customer = await prisma.customer.findUnique({
        where: { email: query.toLowerCase() },
      });
    }

    if (!customer) {
      return NextResponse.json({ found: false });
    }

    // Partially mask email for privacy protection
    let maskedEmail = "";
    if (customer.email) {
      const [user, domain] = customer.email.split("@");
      maskedEmail =
        user.length > 2
          ? `${user[0]}***${user[user.length - 1]}@${domain}`
          : `${user[0]}***@${domain}`;
    }

    return NextResponse.json({
      found: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: maskedEmail || customer.email || "",
        phone: customer.phone,
        address: customer.addressLine1 || "",
        landmark: customer.landmark || "",
        pincode: customer.pincode || "",
        city: customer.city || "",
        state: customer.state || "",
      },
    });
  } catch (err: any) {
    console.error("Customer lookup error:", err);
    return NextResponse.json({ found: false }, { status: 500 });
  }
}
