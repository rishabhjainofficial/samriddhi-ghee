"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

export interface IVariantItem {
  id: string;
  title: string;
  sku: string;
  price: number;
  mrp: number;
  stockQuantity: number;
  weightInGrams: number;
  isActive: boolean;
}

interface VariantSelectorProps {
  productId: string;
  productTitle: string;
  variants: IVariantItem[];
  imageUrl: string;
}

export function VariantSelector({
  productId,
  productTitle,
  variants,
  imageUrl,
}: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || ""
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  if (!activeVariant) return null;

  const discountPercent =
    activeVariant.mrp > activeVariant.price
      ? Math.round(
          ((activeVariant.mrp - activeVariant.price) / activeVariant.mrp) * 100
        )
      : 0;

  const handleAddToCart = () => {
    addItem({
      productId,
      variantId: activeVariant.id,
      productTitle,
      variantTitle: activeVariant.title,
      sku: activeVariant.sku,
      price: activeVariant.price,
      mrp: activeVariant.mrp,
      image: imageUrl,
      weightInGrams: activeVariant.weightInGrams,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="space-y-4">
      {/* Size / Variant Options */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
          Select Pack Size:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {variants.map((v) => {
            const isSelected = v.id === selectedVariantId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariantId(v.id)}
                className={`py-2 px-3 rounded-lg text-left border transition-all ${
                  isSelected
                    ? "border-amber-600 bg-amber-50/80 text-amber-950 font-semibold ring-1 ring-amber-600 shadow-xs"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                }`}
              >
                <div className="text-xs truncate">{v.title}</div>
                <div className="text-xs font-bold text-stone-900 mt-0.5">
                  ₹{v.price.toLocaleString("en-IN")}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="font-serif text-3xl font-bold text-amber-700">
          ₹{activeVariant.price.toLocaleString("en-IN")}
        </span>
        {activeVariant.mrp > activeVariant.price && (
          <span className="text-sm text-stone-400 line-through">
            MRP ₹{activeVariant.mrp.toLocaleString("en-IN")}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* Stock status indicator */}
      <div className="text-xs font-medium">
        {activeVariant.stockQuantity > 5 ? (
          <span className="text-emerald-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
            Fresh Batch Available • Ready to Dispatch
          </span>
        ) : activeVariant.stockQuantity > 0 ? (
          <span className="text-amber-700 font-semibold">
            Only {activeVariant.stockQuantity} jars remaining in current batch!
          </span>
        ) : (
          <span className="text-red-600 font-semibold">
            Currently Out of Stock (Fresh churning in progress)
          </span>
        )}
      </div>

      {/* Add to Cart CTA */}
      <button
        onClick={handleAddToCart}
        disabled={activeVariant.stockQuantity <= 0}
        className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all shadow-sm ${
          activeVariant.stockQuantity <= 0
            ? "bg-stone-300 text-stone-500 cursor-not-allowed"
            : addedAnimation
            ? "bg-emerald-600 text-white"
            : "bg-amber-600 hover:bg-amber-700 text-white hover:shadow-md"
        }`}
      >
        {addedAnimation ? (
          <>
            <Check className="w-5 h-5" />
            <span>Added to Cart!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart • ₹{activeVariant.price.toLocaleString("en-IN")}</span>
          </>
        )}
      </button>
    </div>
  );
}
