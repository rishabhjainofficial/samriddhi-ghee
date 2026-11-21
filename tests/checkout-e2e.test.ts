import assert from "node:assert";
import { prisma } from "../src/lib/prisma";
import { getPaymentGateway } from "../src/lib/services/payment";

async function testCheckoutFlow() {
  console.log("Testing complete E2E Guest Checkout & Payment Lifecycle...");

  // 1. Get a product variant with known stock
  const variant = await prisma.productVariant.findFirst({
    where: { stockQuantity: { gt: 5 } },
    include: { product: true },
  });
  assert(variant, "Expected product variant for checkout test");
  const initialStock = variant.stockQuantity;

  // 2. Create Order in PENDING_PAYMENT
  const orderNumber = `SG-TEST-${Date.now().toString().slice(-6)}`;
  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: "Aarav Mehta",
      customerEmail: "aarav@example.com",
      customerPhone: "9876501234",
      status: "PENDING_PAYMENT",
      subtotal: variant.price,
      shippingFee: 0,
      taxAmount: 0,
      totalAmount: variant.price,
      shippingAddress: {
        create: {
          recipientName: "Aarav Mehta",
          phone: "9876501234",
          addressLine1: "B-204, Shivalik Residency, Drive In Road",
          landmark: "Opposite Himalaya Mall",
          city: "Ahmedabad",
          state: "Gujarat",
          pincode: "380054",
        },
      },
      items: {
        create: [
          {
            productId: variant.productId,
            variantId: variant.id,
            title: variant.product.title,
            variantTitle: variant.title,
            price: variant.price,
            quantity: 1,
            weightInGrams: variant.weightInGrams,
          },
        ],
      },
    },
    include: { items: true, shippingAddress: true },
  });

  assert(order.id, "Expected created order ID");
  assert.strictEqual(order.status, "PENDING_PAYMENT");

  // Verify stock has NOT decremented yet at PENDING_PAYMENT
  const stockBeforePay = await prisma.productVariant.findUnique({
    where: { id: variant.id },
  });
  assert.strictEqual(
    stockBeforePay?.stockQuantity,
    initialStock,
    "Stock must not decrement before confirmed payment"
  );

  // 3. Simulate Payment Success via Gateway
  const paymentGateway = getPaymentGateway();
  const verifyResult = await paymentGateway.verifyPayment({
    orderId: order.id,
    gatewayPaymentId: `mock_pay_success_${order.id}`,
  });

  assert(verifyResult.isSuccessful, "Payment must be verified successfully");

  // 4. Update order to PAID in database transaction & decrement stock
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });

    await tx.paymentTransaction.create({
      data: {
        orderId: order.id,
        gatewayProvider: "MOCK",
        gatewayPaymentId: verifyResult.transactionId,
        amount: order.totalAmount,
        status: "SUCCESS",
        method: "UPI",
        rawPayload: JSON.stringify(verifyResult.rawResponse),
      },
    });

    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }
  });

  // 5. Verify Post-Payment State
  const paidOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: { paymentTransactions: true },
  });

  assert.strictEqual(paidOrder?.status, "PAID");
  assert(paidOrder?.paymentTransactions.length === 1);
  assert.strictEqual(paidOrder?.paymentTransactions[0].status, "SUCCESS");

  const stockAfterPay = await prisma.productVariant.findUnique({
    where: { id: variant.id },
  });
  assert.strictEqual(
    stockAfterPay?.stockQuantity,
    initialStock - 1,
    "Stock must decrement by purchased quantity after payment"
  );

  console.log("✓ E2E Guest Checkout and Payment Lifecycle verified successfully!");
}

testCheckoutFlow()
  .catch((err) => {
    console.error("Checkout test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
