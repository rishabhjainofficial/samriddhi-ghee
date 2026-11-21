"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { ShieldCheck, CreditCard, Smartphone, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface PaymentSimulatorProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    status: string;
    items: Array<{
      id: string;
      title: string;
      variantTitle: string;
      price: number;
      quantity: number;
    }>;
  };
}

export function PaymentSimulator({ order }: PaymentSimulatorProps) {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  const [activeTab, setActiveTab] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [upiId, setUpiId] = useState("user@okaxis");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulatePayment = async (shouldSucceed: boolean) => {
    setLoading(true);
    setError(null);

    const paymentId = shouldSucceed
      ? `mock_pay_success_${order.id}_${Date.now()}`
      : `mock_pay_fail_${order.id}_${Date.now()}`;

    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          gatewayPaymentId: paymentId,
          method: activeTab,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Payment was rejected or failed.");
      }

      // Clear client cart and route to confirmation
      clearCart();
      router.push(`/order-success/${order.id}`);
    } catch (err: any) {
      setError(err.message || "Simulated payment failure.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 flex items-center justify-between">
        <div>
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">
            Payment Gateway Simulation
          </span>
          <h1 className="font-serif text-2xl font-bold mt-1">Sanvrit Ghee Checkout</h1>
          <p className="text-xs text-stone-400 mt-1">Order Ref: {order.orderNumber}</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-400 block">Payable Amount</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Method Tabs */}
        <div className="flex border-b border-stone-200 gap-6">
          <button
            onClick={() => setActiveTab("UPI")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "UPI"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          <button
            onClick={() => setActiveTab("CARD")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "CARD"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Debit / Credit Cards</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "UPI" && (
          <div className="space-y-4 bg-stone-50 p-5 rounded-2xl border border-stone-200">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Virtual Payment Address (VPA / UPI ID)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>
            <p className="text-[11px] text-stone-500">
              Simulating instant UPI payment response via Google Pay, PhonePe, or Paytm.
            </p>
          </div>
        )}

        {activeTab === "CARD" && (
          <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
            <input
              type="text"
              disabled
              value="4111 •••• •••• 1111 (Test Card)"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 bg-stone-100 text-stone-600 font-mono"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                disabled
                value="MM/YY: 12/28"
                className="text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-100 text-stone-600"
              />
              <input
                type="text"
                disabled
                value="CVV: 123"
                className="text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-100 text-stone-600"
              />
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Simulation Action Controls */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleSimulatePayment(true)}
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-stone-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Gateway Response...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Simulate Successful Payment (₹{order.totalAmount.toLocaleString("en-IN")})</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSimulatePayment(false)}
            disabled={loading}
            className="w-full py-3 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 font-semibold text-xs rounded-xl border border-stone-200 transition-colors"
          >
            Simulate Payment Decline / Failure
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-2 border-t border-stone-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Pluggable Adapter Ready for Razorpay / Cashfree</span>
        </div>
      </div>
    </div>
  );
}
