import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cookieStore = await cookies();
    const cookiePhone =
      cookieStore.get("sanvrit_customer_phone")?.value ||
      cookieStore.get("samriddhi_customer_phone")?.value;

    const phoneParam = searchParams.get("phone");
    const phone = phoneParam ? phoneParam.replace(/\D/g, "").slice(-10) : cookiePhone;

    if (!phone) {
      return NextResponse.json({ authenticated: false, orders: [] });
    }

    // Find customer & orders
    const customer = await prisma.customer.findUnique({
      where: { phone },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
            shippingAddress: true,
            shipment: true,
          },
        },
      },
    });

    if (!customer) {
      // Check if orders exist under this phone even if Customer record wasn't created
      const orders = await prisma.order.findMany({
        where: { customerPhone: phone },
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          shippingAddress: true,
          shipment: true,
        },
      });

      if (orders.length === 0) {
        return NextResponse.json({ authenticated: false, orders: [] });
      }

      return NextResponse.json({
        authenticated: true,
        customer: {
          name: orders[0].customerName,
          phone,
          email: orders[0].customerEmail,
          addressLine1: orders[0].shippingAddress?.addressLine1 || "",
          city: orders[0].shippingAddress?.city || "",
          state: orders[0].shippingAddress?.state || "",
          pincode: orders[0].shippingAddress?.pincode || "",
        },
        orders,
      });
    }

    return NextResponse.json({
      authenticated: true,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        addressLine1: customer.addressLine1,
        landmark: customer.landmark,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      },
      orders: customer.orders,
    });
  } catch (err: any) {
    console.error("Customer orders error:", err);
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}
