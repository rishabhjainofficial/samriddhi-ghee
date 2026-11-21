import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentGateway } from "@/lib/services/payment";

export async function POST(req: Request) {
  try {
    const { orderId, gatewayPaymentId, method } = await req.json();

    if (!orderId || !gatewayPaymentId) {
      return NextResponse.json(
        { error: "Order ID and payment ID are required." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Idempotency: If order is already PAID, return success without duplicate inventory decrements
    if (order.status === "PAID") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        status: "PAID",
        alreadyVerified: true,
      });
    }

    // 1. Verify Payment with Payment Adapter
    const gateway = getPaymentGateway();
    const verification = await gateway.verifyPayment({
      orderId,
      gatewayPaymentId,
    });

    if (!verification.isSuccessful) {
      // Log failed payment transaction
      await prisma.paymentTransaction.create({
        data: {
          orderId,
          gatewayProvider: "MOCK",
          gatewayPaymentId,
          amount: order.totalAmount,
          status: "FAILED",
          method: method || "UPI",
          rawPayload: JSON.stringify(verification.rawResponse),
        },
      });

      return NextResponse.json(
        { success: false, error: "Payment verification failed or was declined by user." },
        { status: 400 }
      );
    }

    // 2. Verified Payment: Execute atomic database transaction
    await prisma.$transaction(async (tx) => {
      // Update order status to PAID
      await tx.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });

      // Log successful transaction
      await tx.paymentTransaction.create({
        data: {
          orderId,
          gatewayProvider: "MOCK",
          gatewayPaymentId: verification.transactionId,
          amount: order.totalAmount,
          status: "SUCCESS",
          method: method || "UPI",
          rawPayload: JSON.stringify(verification.rawResponse),
        },
      });

      // Decrement inventory stock safely
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }
    });

    return NextResponse.json({
      success: true,
      orderId,
      status: "PAID",
      transactionId: verification.transactionId,
    });
  } catch (err: any) {
    console.error("Payment verification route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process payment verification." },
      { status: 500 }
    );
  }
}
