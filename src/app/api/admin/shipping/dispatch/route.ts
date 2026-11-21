import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getShippingProvider } from "@/lib/services/shipping";
import { getAdminFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Valid administrator session required." },
        { status: 401 }
      );
    }

    const { orderId, dimensions } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, shippingAddress: true, shipment: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.shipment) {
      return NextResponse.json({ success: true, shipment: order.shipment });
    }

    const totalWeight = order.items.reduce(
      (sum, i) => sum + (i.weightInGrams || 800) * i.quantity,
      0
    );

    const dims = dimensions || { lengthCm: 22, breadthCm: 18, heightCm: 15 };

    // 1. Call Pluggable Shipping Provider
    const shippingProvider = getShippingProvider();
    const shipmentResult = await shippingProvider.createShipment({
      orderId: order.id,
      orderItems: order.items.map((i) => ({
        name: i.title,
        sku: "SKU",
        qty: i.quantity,
        price: i.price,
      })),
      shippingAddress: {
        name: order.shippingAddress?.recipientName || order.customerName,
        phone: order.shippingAddress?.phone || order.customerPhone,
        address: order.shippingAddress?.addressLine1 || "",
        landmark: order.shippingAddress?.landmark || undefined,
        city: order.shippingAddress?.city || "",
        state: order.shippingAddress?.state || "",
        pincode: order.shippingAddress?.pincode || "",
      },
      totalWeightInGrams: totalWeight,
      dimensions: dims,
    });

    // 2. Save Shipment & update Order status in database
    const shipment = await prisma.shipment.create({
      data: {
        orderId: order.id,
        provider: "MOCK",
        shipmentId: shipmentResult.shipmentId,
        awbCode: shipmentResult.awbCode,
        courierName: shipmentResult.courierName,
        status: "MANIFESTED",
        weightInGrams: totalWeight,
        lengthCm: dims.lengthCm,
        breadthCm: dims.breadthCm,
        heightCm: dims.heightCm,
        labelUrl: shipmentResult.labelUrl,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "SHIPPED" },
    });

    return NextResponse.json({ success: true, shipment });
  } catch (err: any) {
    console.error("Dispatch API error:", err);
    return NextResponse.json({ error: err.message || "Dispatch failed" }, { status: 500 });
  }
}
