import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  IndianRupee,
  ShoppingBag,
  Truck,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Aggregate Metrics
  const totalOrders = await prisma.order.count();
  const paidOrders = await prisma.order.findMany({
    where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
  });

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const averageOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

  const pendingShipments = await prisma.order.count({
    where: { status: "PAID", shipment: null },
  });

  const totalProducts = await prisma.product.count({ where: { isActive: true } });

  // Low stock variants (< 10 units)
  const lowStockVariants = await prisma.productVariant.findMany({
    where: { stockQuantity: { lte: 15 }, isActive: true },
    include: { product: true },
    take: 5,
  });

  // Recent 6 orders
  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { items: true, shipment: true },
  });

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Store Overview & Operations
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time analytics for Sanvrit Ghee sales, shipments, and inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Manage Orders
          </Link>
          <Link
            href="/admin/shipping"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Dispatch Shipments
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-stone-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Avg. Order Value: ₹{averageOrderValue.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            {totalOrders}
          </div>
          <div className="text-[11px] text-stone-500">
            {paidOrders.length} paid & confirmed orders
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Dispatches</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            {pendingShipments}
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            Orders awaiting courier AWB generation
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Catalog Items</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            {totalProducts}
          </div>
          <div className="text-[11px] text-stone-500">
            Active products listed on storefront
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Feed */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-stone-100 flex justify-between items-center">
            <h2 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Recent Orders</span>
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100 overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No orders recorded yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-100">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        <Link href={`/admin/orders`} className="hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900">{order.customerName}</div>
                        <div className="text-[11px] text-stone-500">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        {order.items.length} {order.items.length === 1 ? "jar" : "jars"}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            order.status === "PAID"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "PROCESSING"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "SHIPPED"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Low Stock Watch */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Low Stock Watch</span>
          </div>
          <p className="text-xs text-stone-500">
            Jars with low quantities that will need fresh bilona batch churning soon.
          </p>

          <div className="space-y-3 pt-1">
            {lowStockVariants.length === 0 ? (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                ✓ All ghee variants have healthy stock levels.
              </div>
            ) : (
              lowStockVariants.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-serif font-bold text-xs text-stone-900 block truncate max-w-44">
                      {v.product.title}
                    </span>
                    <span className="text-[11px] text-stone-500">{v.title}</span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                      v.stockQuantity < 5
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {v.stockQuantity} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
