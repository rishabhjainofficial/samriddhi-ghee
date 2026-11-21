import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    if (!query || query.length < 3) {
      return NextResponse.json({ found: false });
    }

    const cleanPhone = query.replace(/\D/g, "");

    // Search by phone or email
    let customer = null;
    if (cleanPhone.length === 10) {
      customer = await prisma.customer.findUnique({
        where: { phone: cleanPhone },
      });
    }

    if (!customer && query.includes("@")) {
      customer = await prisma.customer.findUnique({
        where: { email: query.toLowerCase() },
      });
    }

    if (!customer && cleanPhone.length >= 10) {
      customer = await prisma.customer.findFirst({
        where: { phone: { contains: cleanPhone.slice(-10) } },
      });
    }

    if (!customer) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email || "",
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
