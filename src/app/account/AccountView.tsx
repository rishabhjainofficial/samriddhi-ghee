"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  MapPin,
  Clock,
  Truck,
  ArrowRight,
  Loader2,
  CheckCircle,
  Phone,
  Mail,
  LogOut,
} from "lucide-react";

export function AccountView() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (phoneInput?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = phoneInput
        ? `/api/customer/orders?phone=${encodeURIComponent(phoneInput)}`
        : `/api/customer/orders`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.authenticated && data.customer) {
        setCustomer(data.customer);
        setOrders(data.orders || []);
        setPhone(data.customer.phone);
      } else {
        setCustomer(null);
        setOrders([]);
      }
    } catch (err: any) {
      setError("Unable to load profile. Please try entering your mobile number.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.replace(/\D/g, "");
    if (clean.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    fetchOrders(clean);
  };

  const handleSignOut = () => {
    document.cookie = "sanvrit_customer_phone=; path=/; max-age=0;";
    document.cookie = "samriddhi_customer_phone=; path=/; max-age=0;";
    setCustomer(null);
    setOrders([]);
    setPhone("");
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
        <p className="text-xs text-stone-500">Loading your profile & past orders...</p>
      </div>
    );
  }

  // If customer is NOT yet identified / logged in
  if (!customer) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
          <User className="w-7 h-7" />
        </div>

        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            View Your Orders
          </h1>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
            Enter the 10-digit mobile number you used during checkout to view your past orders, delivery tracking, and saved profile.
          </p>
        </div>

        <form onSubmit={handlePhoneSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Mobile Number (10 digits)
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
          >
            Access My Orders
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-serif text-2xl font-bold shrink-0">
            {customer.name?.charAt(0) || "U"}
          </div>
          <div>
            <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider block">
              Customer Profile
            </span>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              {customer.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                {customer.phone}
              </span>
              {customer.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {customer.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="self-start sm:self-auto px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Orders History */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <span>Past Orders ({orders.length})</span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-3">
              <p className="text-sm text-stone-600">You haven't placed any orders yet.</p>
              <Link
                href="/products"
                className="inline-block px-5 py-2 bg-amber-600 text-white text-xs font-semibold rounded-full"
              >
                Browse Pure Ghee
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4 hover:border-amber-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-stone-100 gap-2">
                    <div>
                      <span className="font-mono font-bold text-stone-900 text-sm block">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
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

                      <span className="font-serif font-bold text-base text-stone-900">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-stone-100 text-xs">
                    {order.items.map((i: any) => (
                      <div key={i.id} className="py-2 flex justify-between items-center text-stone-700">
                        <div>
                          <span className="font-semibold text-stone-900">{i.title}</span>
                          <span className="text-stone-500 block text-[11px]">{i.variantTitle} × {i.quantity}</span>
                        </div>
                        <span className="font-mono font-semibold">
                          ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex justify-end gap-3 border-t border-stone-100">
                    <Link
                      href={`/track?orderId=${encodeURIComponent(order.id)}&orderNumber=${encodeURIComponent(order.orderNumber)}`}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Shipment</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Saved Delivery Address */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span>Saved Address</span>
          </h2>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-3">
            <span className="text-xs font-bold text-stone-900 block">
              Default Shipping Address
            </span>
            {customer.addressLine1 ? (
              <div className="text-xs text-stone-600 leading-relaxed space-y-1">
                <p className="font-semibold text-stone-900">{customer.name}</p>
                <p>{customer.addressLine1}</p>
                {customer.landmark && <p>Near: {customer.landmark}</p>}
                <p>
                  {customer.city}, {customer.state} - <strong>{customer.pincode}</strong>
                </p>
                <p className="text-stone-400 font-mono pt-1">Tel: {customer.phone}</p>
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">
                Address will be saved automatically upon your next checkout.
              </p>
            )}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Auto-fills instantly at next checkout</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
