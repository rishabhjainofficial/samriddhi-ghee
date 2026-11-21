import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, Package, MapPin, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      shippingAddress: true,
      shipment: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 sm:py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-8">
            {/* Success Hero Header */}
            <div className="text-center space-y-3 pb-6 border-b border-stone-100">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-stone-900">
                Order Confirmed!
              </h1>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <strong>{order.customerName}</strong>! Your pure Vedic Bilona Ghee order has been received and scheduled for batch dispatch.
              </p>
              <div className="inline-block mt-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold px-4 py-1.5 rounded-full">
                Order Number: {order.orderNumber}
              </div>
            </div>

            {/* Delivery & Status Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Estimated Delivery</span>
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  3 - 5 Business Days
                </p>
                <p className="text-[11px] text-stone-500">
                  Shipped via courier in double-cushioned protective transit packaging.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Delivering To</span>
                </div>
                {order.shippingAddress && (
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {order.shippingAddress.addressLine1},{" "}
                    {order.shippingAddress.landmark && `${order.shippingAddress.landmark}, `}
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                )}
              </div>
            </div>

            {/* Ordered Items Summary */}
            <div className="space-y-3">
              <h2 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                <span>Ordered Ghee Jars</span>
              </h2>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-bold text-stone-900 block">
                        {item.title}
                      </span>
                      <span className="text-xs text-stone-500">
                        {item.variantTitle} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-stone-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right">
                <span className="text-xs text-stone-500 mr-3">Total Paid (Prepaid):</span>
                <span className="font-serif text-xl font-bold text-amber-700">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-100">
              <Link
                href={`/track?orderId=${encodeURIComponent(order.id)}&orderNumber=${encodeURIComponent(order.orderNumber)}&phone=${encodeURIComponent(order.customerPhone)}`}
                className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl text-center shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Track Order Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/"
                className="flex-1 py-3.5 bg-cream hover:bg-stone-100 text-stone-800 font-semibold text-xs rounded-xl text-center border border-stone-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Confirmation SMS & Email sent to {order.customerPhone}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
