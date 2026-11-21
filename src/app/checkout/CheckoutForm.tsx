"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { calculateOrderTotals } from "@/lib/utils/pricing";
import { lookupPincode } from "@/lib/utils/pincode";
import { ShieldCheck, Truck, Lock, ArrowRight, Loader2 } from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoFilledCustomer, setAutoFilledCustomer] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    notes: "",
  });

  // Query customer profile by phone or email
  const lookupCustomerDetails = async (query: string) => {
    if (!query || query.length < 5) return;
    setLookingUp(true);
    try {
      const res = await fetch(`/api/customer/lookup?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.found && data.customer) {
        const c = data.customer;
        setFormData((prev) => ({
          ...prev,
          name: prev.name || c.name || "",
          phone: prev.phone || c.phone || "",
          email: prev.email || c.email || "",
          address: c.address || prev.address,
          landmark: c.landmark || prev.landmark,
          pincode: c.pincode || prev.pincode,
          city: c.city || prev.city,
          state: c.state || prev.state,
        }));
        setAutoFilledCustomer(c.name || "Customer");
      }
    } catch (err) {
      console.warn("Autofill lookup error:", err);
    } finally {
      setLookingUp(false);
    }
  };

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);

    // Check if phone cookie exists to prefill on mount
    const match =
      document.cookie.match(/sanvrit_customer_phone=([^;]+)/) ||
      document.cookie.match(/samriddhi_customer_phone=([^;]+)/);
    if (match && match[1]) {
      lookupCustomerDetails(match[1]);
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: raw }));
    if (raw.length === 10) {
      lookupCustomerDetails(raw);
    }
  };

  const handleEmailBlur = () => {
    if (formData.email && formData.email.includes("@")) {
      lookupCustomerDetails(formData.email);
    }
  };

  // Auto-fill City & State on 6-digit Pincode entry
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      const match = lookupPincode(pin);
      if (match) {
        setFormData((prev) => ({
          ...prev,
          city: match.city,
          state: match.state,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty. Please add items before checkout.");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      setError("Please fill in all required delivery fields.");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (formData.pincode.length !== 6) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
          },
          shippingAddress: {
            address: formData.address,
            landmark: formData.landmark,
            city: formData.city || "Direct Hub",
            state: formData.state || "India",
            pincode: formData.pincode,
          },
          notes: formData.notes,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Route to simulated payment page
      router.push(`/payment/${data.orderId}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-md mx-auto text-center border border-stone-200">
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
          Your cart is currently empty
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Add fresh Vedic Bilona Ghee to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="px-6 py-2.5 bg-amber-600 text-white rounded-full text-xs font-semibold"
        >
          Browse Ghee Selection
        </button>
      </div>
    );
  }

  const totals = calculateOrderTotals(subtotal, {
    enableShippingFee: false, // Default is free shipping
  });

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Customer & Address Information */}
      <div className="lg:col-span-7 space-y-6">
        {/* Contact info box */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <span>1. Customer Details (Guest)</span>
            </h2>
            {lookingUp && (
              <span className="text-[11px] text-amber-700 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Looking up profile...
              </span>
            )}
          </div>

          {autoFilledCustomer && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
              <span>
                ✨ Welcome back, <strong>{autoFilledCustomer}</strong>! Your delivery details were automatically filled.
              </span>
              <button
                type="button"
                onClick={() => setAutoFilledCustomer(null)}
                className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkout-phone" className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile Number (10 digits) *
              </label>
              <input
                id="checkout-phone"
                type="tel"
                required
                maxLength={10}
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50 font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Type mobile number to auto-fill saved address
              </span>
            </div>

            <div>
              <label htmlFor="checkout-name" className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name *
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                placeholder="e.g. Ramesh Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="checkout-email" className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address (For invoice & tracking updates) *
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                placeholder="ramesh@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={handleEmailBlur}
                className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>
          </div>
        </div>

        {/* Shipping address box */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3 flex items-center justify-between">
            <span>2. Delivery Address</span>
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> All India Safe Glass Jar Delivery
            </span>
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="checkout-address" className="block text-xs font-semibold text-stone-700 mb-1">
                Flat / House No., Building, Street *
              </label>
              <input
                id="checkout-address"
                type="text"
                required
                placeholder="e.g. Flat 302, Gokul Heights, MG Road"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>

            <div>
              <label htmlFor="checkout-landmark" className="block text-xs font-semibold text-stone-700 mb-1">
                Landmark / Area (Optional)
              </label>
              <input
                id="checkout-landmark"
                type="text"
                placeholder="e.g. Near Metro Station / Behind Temple"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="checkout-pincode" className="block text-xs font-semibold text-stone-700 mb-1">
                  PIN Code *
                </label>
                <input
                  id="checkout-pincode"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 110001"
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50 font-mono"
                />
              </div>

              <div>
                <label htmlFor="checkout-city" className="block text-xs font-semibold text-stone-700 mb-1">
                  City *
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                />
              </div>

              <div>
                <label htmlFor="checkout-state" className="block text-xs font-semibold text-stone-700 mb-1">
                  State *
                </label>
                <input
                  id="checkout-state"
                  type="text"
                  required
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-notes" className="block text-xs font-semibold text-stone-700 mb-1">
                Order Delivery Instructions (Optional)
              </label>
              <textarea
                id="checkout-notes"
                rows={2}
                placeholder="e.g. Please leave with security if unavailable."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full text-base sm:text-sm px-3.5 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-5">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5 sticky top-28">
          <h2 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
            Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
          </h2>

          {/* Line items list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.variantId} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-stone-800 bg-stone-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {i.quantity}×
                  </span>
                  <div>
                    <span className="font-medium text-stone-900 block truncate max-w-44">
                      {i.productTitle}
                    </span>
                    <span className="text-stone-500">{i.variantTitle}</span>
                  </div>
                </div>
                <span className="font-semibold text-stone-900">
                  ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="border-t border-stone-100 pt-3 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-stone-900">
                ₹{totals.subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
              <span>Total Payable</span>
              <span className="font-serif text-lg text-amber-700">
                ₹{totals.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 text-right">
              All taxes & delivery charges included
            </p>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2"
            >
              <span className="font-semibold">Notice:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Proceed to Secure Payment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Prepaid Order • 100% Purity Guarantee</span>
          </div>
        </div>
      </div>
    </form>
  );
}
