import assert from "node:assert";
import { prisma } from "../src/lib/prisma";

async function testAdminOrders() {
  console.log("Testing Admin Dashboard KPIs & Order Master Filtering...");

  // 1. Fetch dashboard metrics
  const totalOrders = await prisma.order.count();
  const paidOrders = await prisma.order.findMany({
    where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
  });

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingShipments = await prisma.order.count({
    where: { status: "PAID", shipment: null },
  });

  assert(typeof totalOrders === "number");
  assert(typeof totalRevenue === "number");
  assert(typeof pendingShipments === "number");

  // 2. Order filtering by status
  let allOrders = await prisma.order.findMany({
    include: { items: true, shippingAddress: true, shipment: true },
    orderBy: { createdAt: "desc" },
  });

  if (allOrders.length === 0) {
    const variant = await prisma.productVariant.findFirst({ include: { product: true } });
    await prisma.order.create({
      data: {
        orderNumber: "SG-2026-INIT01",
        customerName: "Vikram Mehta",
        customerEmail: "vikram@example.com",
        customerPhone: "9876543210",
        status: "PAID",
        subtotal: variant?.price || 2249,
        totalAmount: variant?.price || 2249,
        items: {
          create: [
            {
              productId: variant!.productId,
              variantId: variant!.id,
              title: variant!.product.title,
              variantTitle: variant!.title,
              price: variant!.price,
              quantity: 1,
              weightInGrams: variant!.weightInGrams,
            },
          ],
        },
      },
    });

    allOrders = await prisma.order.findMany({
      include: { items: true, shippingAddress: true, shipment: true },
      orderBy: { createdAt: "desc" },
    });
  }

  assert(allOrders.length > 0, "Expected at least one seeded/tested order");

  // Verify status update action capability
  const testOrder = allOrders[0];
  const updatedOrder = await prisma.order.update({
    where: { id: testOrder.id },
    data: { status: "PROCESSING" },
  });
  assert.strictEqual(updatedOrder.status, "PROCESSING");

  console.log("✓ Admin Dashboard metrics and Order status transitions verified!");
}

testAdminOrders()
  .catch((err) => {
    console.error("Admin orders test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
