import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getShippingProvider } from "@/lib/services/shipping";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");

    if (!orderId && !orderNumber) {
      return NextResponse.json(
        { error: "Order Number or Order ID is required." },
        { status: 400 }
      );
    }

    let order = null;

    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId.trim() },
        include: {
          items: true,
          shippingAddress: true,
          shipment: true,
        },
      });
    } else if (orderNumber) {
      const whereClause: any = { orderNumber: orderNumber.trim() };
      if (phone) {
        whereClause.customerPhone = phone.trim();
      }

      order = await prisma.order.findFirst({
        where: whereClause,
        include: {
          items: true,
          shippingAddress: true,
          shipment: true,
        },
      });
    }

    if (!order) {
      return NextResponse.json(
        { error: "No order found matching the provided details." },
        { status: 404 }
      );
    }

    // Default timeline milestones based on order status
    let timeline = [
      {
        stage: "Order Placed",
        timestamp: order.createdAt.toISOString(),
        location: "Sanvrit Dispatch Center, Udaipur, Rajasthan",
        description: "Order confirmed with customer.",
      },
    ];

    if (order.status === "PAID" || order.status === "PROCESSING") {
      timeline.push({
        stage: "Payment Received & Churn Processing",
        timestamp: order.updatedAt.toISOString(),
        location: "Sanvrit Dairy Hub, Hiran Magri, Udaipur",
        description: "Batch quality approved and packaged into glass jar box.",
      });
    }

    if (order.shipment) {
      const shippingProvider = getShippingProvider();
      const tracking = await shippingProvider.trackShipment(order.shipment.awbCode);
      if (tracking && tracking.statusTimeline) {
        timeline = tracking.statusTimeline;
      }
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.customerName,
      createdAt: order.createdAt,
      shipment: order.shipment,
      timeline,
    });
  } catch (err: any) {
    console.error("Tracking API error:", err);
    return NextResponse.json(
      { error: "Failed to look up tracking details." },
      { status: 500 }
    );
  }
}
