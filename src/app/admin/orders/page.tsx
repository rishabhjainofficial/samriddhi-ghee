import { prisma } from "@/lib/prisma";
import { OrderMasterTable } from "./OrderMasterTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      shippingAddress: true,
      shipment: true,
      paymentTransactions: true,
    },
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Order Master
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete ledger of guest customer orders, status transitions, and printable invoices.
        </p>
      </div>

      <OrderMasterTable initialOrders={orders} />
    </div>
  );
}
