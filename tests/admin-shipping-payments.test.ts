import assert from "node:assert";
import { prisma } from "../src/lib/prisma";
import { getShippingProvider } from "../src/lib/services/shipping";

async function testAdminShippingAndPayments() {
  console.log("Testing Shipping Master Fulfillment & Payment Master Ledger...");

  // 1. Payment transactions ledger check
  const transactions = await prisma.paymentTransaction.findMany({
    include: { order: true },
    orderBy: { createdAt: "desc" },
  });
  assert(Array.isArray(transactions), "Transactions must be an array");

  // 2. Shipping fulfillment pipeline: find or create an order ready for dispatch
  let targetOrder = await prisma.order.findFirst({
    where: { status: "PAID", shipment: null },
    include: { items: true, shippingAddress: true },
  });

  if (!targetOrder) {
    const variant = await prisma.productVariant.findFirst({ include: { product: true } });
    assert(variant, "Expected product variant");

    targetOrder = await prisma.order.create({
      data: {
        orderNumber: `SG-FULFILL-${Date.now().toString().slice(-6)}`,
        customerName: "Sneha Patel",
        customerEmail: "sneha@example.com",
        customerPhone: "9876543210",
        status: "PAID",
        subtotal: variant.price,
        totalAmount: variant.price,
        shippingAddress: {
          create: {
            recipientName: "Sneha Patel",
            phone: "9876543210",
            addressLine1: "12, Shanti Kunj",
            city: "Surat",
            state: "Gujarat",
            pincode: "395007",
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
              quantity: 2,
              weightInGrams: variant.weightInGrams,
            },
          ],
        },
      },
      include: { items: true, shippingAddress: true },
    });
  }

  // Calculate aggregated weight
  const totalWeight = targetOrder.items.reduce((sum, i) => sum + i.weightInGrams * i.quantity, 0);
  assert(totalWeight > 0, "Total aggregated weight must be positive");

  // Call Shipping Provider
  const shippingProvider = getShippingProvider();
  const shipmentResult = await shippingProvider.createShipment({
    orderId: targetOrder.id,
    orderItems: targetOrder.items.map((i) => ({
      name: i.title,
      sku: "SKU",
      qty: i.quantity,
      price: i.price,
    })),
    shippingAddress: {
      name: targetOrder.shippingAddress?.recipientName || targetOrder.customerName,
      phone: targetOrder.shippingAddress?.phone || targetOrder.customerPhone,
      address: targetOrder.shippingAddress?.addressLine1 || "",
      city: targetOrder.shippingAddress?.city || "",
      state: targetOrder.shippingAddress?.state || "",
      pincode: targetOrder.shippingAddress?.pincode || "",
    },
    totalWeightInGrams: totalWeight,
    dimensions: { lengthCm: 22, breadthCm: 18, heightCm: 15 },
  });

  assert(shipmentResult.awbCode.length > 0, "AWB Code must be generated");

  // Save Shipment in database
  const shipment = await prisma.shipment.create({
    data: {
      orderId: targetOrder.id,
      provider: "MOCK",
      shipmentId: shipmentResult.shipmentId,
      awbCode: shipmentResult.awbCode,
      courierName: shipmentResult.courierName,
      status: "MANIFESTED",
      weightInGrams: totalWeight,
      lengthCm: 22,
      breadthCm: 18,
      heightCm: 15,
      labelUrl: shipmentResult.labelUrl,
    },
  });

  assert(shipment.id, "Shipment record must be saved in database");

  // Update order status to SHIPPED
  const shippedOrder = await prisma.order.update({
    where: { id: targetOrder.id },
    data: { status: "SHIPPED" },
  });
  assert.strictEqual(shippedOrder.status, "SHIPPED");

  console.log("✓ Shipping Fulfillment and AWB creation lifecycle verified successfully!");
}

testAdminShippingAndPayments()
  .catch((err) => {
    console.error("Shipping test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
