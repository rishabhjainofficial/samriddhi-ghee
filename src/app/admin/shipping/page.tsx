import { prisma } from "@/lib/prisma";
import { ShippingTable } from "./ShippingTable";

export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
    },
    include: {
      items: true,
      shippingAddress: true,
      shipment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Shipping Master (Shiprocket Ready)
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Fulfillment queue for paid orders, dead weight & dimension packaging calculators, and AWB generation.
        </p>
      </div>

      <ShippingTable initialOrders={orders} />
    </div>
  );
}
