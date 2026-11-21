"use client";

import { useState } from "react";
import { Truck, Package, Printer, CheckCircle, Clock, X, ArrowRight, Loader2 } from "lucide-react";

interface ShippingTableProps {
  initialOrders: any[];
}

export function ShippingTable({ initialOrders }: ShippingTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeDispatchOrder, setActiveDispatchOrder] = useState<any | null>(null);
  const [labelModalOrder, setLabelModalOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Box dimensions preset state for active dispatch
  const [boxDimensions, setBoxDimensions] = useState({
    preset: "MEDIUM",
    lengthCm: 22,
    breadthCm: 18,
    heightCm: 15,
  });

  const handleOpenDispatch = (order: any) => {
    setActiveDispatchOrder(order);
    const totalGrams = order.items.reduce(
      (sum: number, i: any) => sum + (i.weightInGrams || 800) * i.quantity,
      0
    );

    // Auto-select suggested box tier
    if (totalGrams <= 900) {
      setBoxDimensions({ preset: "SMALL", lengthCm: 15, breadthCm: 15, heightCm: 15 });
    } else if (totalGrams <= 2500) {
      setBoxDimensions({ preset: "MEDIUM", lengthCm: 22, breadthCm: 18, heightCm: 15 });
    } else {
      setBoxDimensions({ preset: "LARGE", lengthCm: 30, breadthCm: 25, heightCm: 20 });
    }
  };

  const handleConfirmDispatch = async () => {
    if (!activeDispatchOrder) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/shipping/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: activeDispatchOrder.id,
          dimensions: {
            lengthCm: boxDimensions.lengthCm,
            breadthCm: boxDimensions.breadthCm,
            heightCm: boxDimensions.heightCm,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate shipment");

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === activeDispatchOrder.id
            ? { ...o, status: "SHIPPED", shipment: data.shipment }
            : o
        )
      );

      const dispatched = { ...activeDispatchOrder, shipment: data.shipment, status: "SHIPPED" };
      setActiveDispatchOrder(null);
      setLabelModalOrder(dispatched);
    } catch (err: any) {
      alert(err.message || "Dispatch error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer & Destination</th>
                <th className="py-3.5 px-4">Items & Dead Weight</th>
                <th className="py-3.5 px-4">AWB & Courier Partner</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {orders.map((order) => {
                const totalWeight = order.items.reduce(
                  (sum: number, i: any) => sum + (i.weightInGrams || 800) * i.quantity,
                  0
                );

                return (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{order.customerName}</div>
                      <div className="text-[11px] text-stone-500">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} ({order.shippingAddress?.pincode})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{order.items.length} {order.items.length === 1 ? "jar" : "jars"}</div>
                      <span className="font-mono text-[11px] text-amber-700 font-semibold">
                        ~{totalWeight} grams
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {order.shipment ? (
                        <div>
                          <span className="font-mono font-bold text-stone-900 block">
                            {order.shipment.awbCode}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {order.shipment.courierName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Not manifested yet</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.shipment
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.shipment ? order.shipment.status : "Awaiting Dispatch"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {!order.shipment ? (
                        <button
                          onClick={() => handleOpenDispatch(order)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch / AWB</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setLabelModalOrder(order)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Shipping Label</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Packaging Modal */}
      {activeDispatchOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Dispatch & Generate AWB
                </h3>
                <span className="text-xs text-stone-400 font-mono">
                  Order #{activeDispatchOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={() => setActiveDispatchOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Packaging Box Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Transit Packaging Box:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "SMALL", name: "Box S (1-2 Jars)", l: 15, b: 15, h: 15 },
                  { id: "MEDIUM", name: "Box M (3-4 Jars)", l: 22, b: 18, h: 15 },
                  { id: "LARGE", name: "Box L (Bulk Tins)", l: 30, b: 25, h: 20 },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() =>
                      setBoxDimensions({
                        preset: tier.id,
                        lengthCm: tier.l,
                        breadthCm: tier.b,
                        heightCm: tier.h,
                      })
                    }
                    className={`p-3 rounded-xl text-left border text-xs transition-all ${
                      boxDimensions.preset === tier.id
                        ? "border-amber-600 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-600"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <div className="font-bold">{tier.name}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {tier.l}×{tier.b}×{tier.h} cm
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Destination preview */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1">
              <div><strong>Recipient:</strong> {activeDispatchOrder.customerName} ({activeDispatchOrder.customerPhone})</div>
              <div><strong>Address:</strong> {activeDispatchOrder.shippingAddress?.addressLine1}, {activeDispatchOrder.shippingAddress?.city}, {activeDispatchOrder.shippingAddress?.state} - {activeDispatchOrder.shippingAddress?.pincode}</div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveDispatchOrder(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-800 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDispatch}
                disabled={loading}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 disabled:bg-stone-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Manifesting Courier...</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>Generate Shiprocket AWB</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Shipping Label Modal */}
      {labelModalOrder?.shipment && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border-2 border-stone-900">
            <div className="flex justify-between items-center border-b-2 border-stone-900 pb-3">
              <div>
                <span className="font-serif font-bold text-base text-stone-900 block">
                  SANVRIT GHEE DISPATCH
                </span>
                <span className="text-xs font-mono text-stone-500">
                  AWB: {labelModalOrder.shipment.awbCode}
                </span>
              </div>
              <button
                onClick={() => setLabelModalOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Courier & Barcode Simulator */}
            <div className="text-center p-4 bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl space-y-2">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest block">
                {labelModalOrder.shipment.courierName}
              </span>
              <div className="font-mono text-xl tracking-[0.3em] font-bold py-2 bg-white border border-stone-300 rounded">
                |||| | ||||| || ||||
              </div>
              <span className="font-mono text-xs text-stone-600 block">
                {labelModalOrder.shipment.awbCode}
              </span>
            </div>

            {/* Address Blocks */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg">
                <span className="font-bold text-stone-700 block mb-0.5">Ship To:</span>
                <p className="font-bold text-stone-900">{labelModalOrder.customerName}</p>
                <p>{labelModalOrder.shippingAddress?.addressLine1}</p>
                <p className="font-bold text-stone-900">
                  {labelModalOrder.shippingAddress?.city}, {labelModalOrder.shippingAddress?.state} - {labelModalOrder.shippingAddress?.pincode}
                </p>
                <p>Tel: {labelModalOrder.customerPhone}</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-500">
                <span className="font-bold text-stone-700 block mb-0.5">Shipper (Return Address):</span>
                <p>Sanvrit Central Dispatch (Dharmasya Food Products)</p>
                <p>128-129, S.M. Lodha Complex, Udaipur, Rajasthan - 313001</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Shipping Label</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
