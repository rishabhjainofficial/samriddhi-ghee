"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { calculateOrderTotals } from "@/lib/utils/pricing";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  // Hydrate zustand store safely on client
  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const totals = calculateOrderTotals(subtotal, {
    enableShippingFee: false, // Default is free delivery as per spec
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-stone-900">
                Your Shopping Cart
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Callout */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 flex items-center gap-2 text-xs text-emerald-800">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>🎉 <strong>Free Delivery Everywhere</strong> on all orders today!</span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-2xl font-serif">
                  SG
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-800">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Experience traditional Vedic Bilona pure Desi Ghee. Add a jar to begin your health journey.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="inline-block mt-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-full shadow-sm transition-colors"
                >
                  Explore Ghee Range
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex gap-3.5 items-center"
                >
                  <div className="relative w-16 h-16 rounded-lg bg-stone-100 shrink-0 border border-stone-200 overflow-hidden">
                    <Image
                      src={item.image || "/images/sanvrit-a2-ghee-front.webp"}
                      alt={item.productTitle}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                      {item.productTitle}
                    </h4>
                    <p className="text-xs text-amber-700 font-medium">{item.variantTitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-stone-900 text-sm">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{item.mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1.5 hover:bg-stone-200 text-stone-700 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-1.5 hover:bg-stone-200 text-stone-700 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 bg-white p-5 space-y-4 shadow-lg">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Payable</span>
                  <span className="font-serif text-lg text-amber-700">
                    ₹{totals.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 text-right">
                  (Inclusive of all taxes & charges)
                </p>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-150 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Guaranteed Purity | Secure Guest Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
