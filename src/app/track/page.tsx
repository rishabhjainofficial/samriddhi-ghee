"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, AlertCircle, Loader2 } from "lucide-react";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const initialOrderNumber = searchParams.get("orderNumber") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);

  const fetchTracking = async (params: { orderId?: string; orderNumber?: string; phone?: string }) => {
    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params.orderId) query.set("orderId", params.orderId);
    if (params.orderNumber) query.set("orderNumber", params.orderNumber);
    if (params.phone) query.set("phone", params.phone);

    try {
      const res = await fetch(`/api/track?${query.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No order found matching these details.");
      }

      setOrderData(data);
      if (data.orderNumber) setOrderNumber(data.orderNumber);
    } catch (err: any) {
      setError(err.message || "Failed to find order. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch immediately if redirected from order success page with params
  useEffect(() => {
    if (initialOrderId || initialOrderNumber) {
      fetchTracking({
        orderId: initialOrderId,
        orderNumber: initialOrderNumber,
        phone: initialPhone,
      });
    }
  }, [initialOrderId, initialOrderNumber, initialPhone]);

  const handleManualTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError("Please enter your Order Number.");
      return;
    }
    fetchTracking({ orderNumber: orderNumber.trim(), phone: phone.trim() });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Track Your Delivery
        </h1>
        <p className="text-xs text-stone-500 mt-2">
          Real-time courier milestones for your pure Vedic Bilona Ghee parcel.
        </p>
      </div>

      {/* Auto-loading indicator */}
      {loading && !orderData && (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center mb-8 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-xs font-semibold text-stone-700">
            Fetching your order tracking status...
          </p>
        </div>
      )}

      {/* Results Timeline Card */}
      {orderData && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-stone-100 gap-2">
            <div>
              <span className="text-xs text-stone-400 block font-mono">
                Order #{orderData.orderNumber}
              </span>
              <span className="font-serif text-xl font-bold text-stone-900">
                Status: {orderData.status}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {orderData.shipment ? "Dispatched via Courier" : "Processing in Warehouse"}
              </span>
            </div>
          </div>

          {/* Courier details if manifested */}
          {orderData.shipment && (
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-amber-600" />
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    {orderData.shipment.courierName}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    AWB: {orderData.shipment.awbCode}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900">
                {orderData.shipment.status}
              </span>
            </div>
          )}

          {/* Milestone Timeline */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Tracking Milestones</span>
            </h3>

            <div className="space-y-4 pl-3 border-l-2 border-amber-500/40 ml-2">
              {(orderData.timeline || []).map((step: any, idx: number) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-[19px] top-0 w-3 h-3 rounded-full bg-amber-600 ring-4 ring-white" />
                  <div className="text-xs font-bold text-stone-900">{step.stage}</div>
                  <div className="text-xs text-stone-600 mt-0.5">{step.description}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5 font-mono">
                    {step.location} • {new Date(step.timestamp).toLocaleDateString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual Search Form (Shown below results or when searching without URL params) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <h3 className="font-serif font-bold text-sm text-stone-900 mb-3">
          {orderData ? "Look up another order" : "Search by Order Details"}
        </h3>
        <form onSubmit={handleManualTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Order Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SG-123456"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              10-Digit Mobile No.
            </label>
            <input
              type="tel"
              maxLength={10}
              placeholder="e.g. 9876543210 (Optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:bg-stone-300"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "Searching..." : "Track"}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="flex-1 py-12 sm:py-16 bg-cream">
        <Suspense
          fallback={
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-500 mt-2">Loading tracking...</p>
            </div>
          }
        >
          <TrackingContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
