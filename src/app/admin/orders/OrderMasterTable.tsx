"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Eye,
  FileText,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  X,
} from "lucide-react";

interface OrderMasterTableProps {
  initialOrders: any[];
}

export function OrderMasterTable({ initialOrders }: OrderMasterTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [printingOrder, setPrintingOrder] = useState<any | null>(null);

  // Status transitions
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? "bg-amber-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No orders match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 font-mono">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{order.customerName}</div>
                      <div className="text-[11px] text-stone-500">{order.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {order.items.map((i: any) => `${i.title} (${i.variantTitle}) x${i.quantity}`).join(", ")}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "PROCESSING"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "SHIPPED"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "DELIVERED"
                            ? "bg-emerald-200 text-emerald-900"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => setPrintingOrder(order)}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
          />

          <div className="relative w-screen max-w-lg bg-white shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs text-stone-400 font-mono">
                  Order #{selectedOrder.orderNumber}
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Order Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Updater */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                Update Order Status:
              </label>
              <div className="flex flex-wrap gap-2">
                {["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                      selectedOrder.status === st
                        ? "bg-amber-600 text-white"
                        : "bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Customer Information
              </h4>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1">
                <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                <div><strong>Mobile:</strong> {selectedOrder.customerPhone}</div>
                <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.shippingAddress && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Shipping Address
                </h4>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs leading-relaxed">
                  {selectedOrder.shippingAddress.addressLine1}
                  {selectedOrder.shippingAddress.landmark && `, ${selectedOrder.shippingAddress.landmark}`}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </div>
              </div>
            )}

            {/* Line Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                {selectedOrder.items.map((i: any) => (
                  <div key={i.id} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-stone-900 block">{i.title}</span>
                      <span className="text-stone-500">{i.variantTitle} × {i.quantity}</span>
                    </div>
                    <span className="font-semibold text-stone-900">
                      ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right text-xs space-y-1">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Delivery:</span>
                  <span>{selectedOrder.shippingFee === 0 ? "FREE" : `₹${selectedOrder.shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-200">
                  <span>Total Amount:</span>
                  <span className="font-serif text-amber-700">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Sanvrit"
                  width={110}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <div>
                  <span className="font-serif font-bold text-stone-900 block leading-tight">Sanvrit Ghee Invoice</span>
                  <span className="text-[11px] text-stone-400 font-mono">Invoice #{printingOrder.orderNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setPrintingOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-stone-700 block mb-1">Billed To:</span>
                <p className="text-stone-600 font-medium">{printingOrder.customerName}</p>
                <p className="text-stone-500">{printingOrder.customerPhone}</p>
                {printingOrder.shippingAddress && (
                  <p className="text-stone-500 mt-1">
                    {printingOrder.shippingAddress.addressLine1}, {printingOrder.shippingAddress.city},{" "}
                    {printingOrder.shippingAddress.state} - {printingOrder.shippingAddress.pincode}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="font-bold text-stone-700 block mb-1">Dispatch Origin:</span>
                <p className="text-stone-600 font-semibold">Dharmasya Food Products Pvt. Ltd.</p>
                <p className="text-stone-500">Sanvrit Dairy, Udaipur, RJ - 313001</p>
                <p className="text-stone-500 text-[10px]">FSSAI Lic: 22225088000714</p>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full text-xs text-left border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Rate</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {printingOrder.items.map((i: any) => (
                  <tr key={i.id}>
                    <td className="p-3">
                      <strong>{i.title}</strong>
                      <span className="text-stone-500 block text-[11px]">{i.variantTitle}</span>
                    </td>
                    <td className="p-3 font-mono">{i.quantity}</td>
                    <td className="p-3 font-mono">₹{i.price.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right font-mono font-bold">
                      ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right text-xs space-y-1">
              <div>Subtotal: ₹{printingOrder.subtotal.toLocaleString("en-IN")}</div>
              <div>Delivery Charges: {printingOrder.shippingFee === 0 ? "FREE" : `₹${printingOrder.shippingFee}`}</div>
              <div className="text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                Total Paid: ₹{printingOrder.totalAmount.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] text-stone-400">All applicable taxes included</div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
