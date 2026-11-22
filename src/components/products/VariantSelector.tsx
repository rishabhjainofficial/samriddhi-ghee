"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ShoppingBag, Sparkles, ShieldCheck, ChevronDown } from "lucide-react";
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

function getVariantBadge(v: IVariantItem) {
  const str = `${v.title} ${v.sku}`.toLowerCase();
  if (str.includes("5") || v.weightInGrams > 2000) {
    return "5L";
  }
  return "1L";
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
  const [isOpen, setIsOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      {/* Size / Variant Options - DROPDOWN STYLE */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Select Pack Size:
          </label>
          <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Glass & Food-Grade Pack</span>
          </span>
        </div>

        {/* Dropdown Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer bg-white shadow-xs ${
            isOpen
              ? "border-[#7C2D12] ring-2 ring-[#7C2D12]/20"
              : "border-stone-300 hover:border-stone-400"
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] border border-amber-200/80 flex items-center justify-center font-bold text-xs text-[#7C2D12]">
              {getVariantBadge(activeVariant)}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                <span>{activeVariant.title}</span>
                {discountPercent > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xs font-bold text-[#7C2D12]">
                  ₹{activeVariant.price.toLocaleString("en-IN")}
                </span>
                {activeVariant.mrp > activeVariant.price && (
                  <span className="text-[11px] text-stone-400 line-through">
                    MRP ₹{activeVariant.mrp.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <ChevronDown
            className={`w-5 h-5 text-stone-500 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#7C2D12]" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu Options Panel */}
        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150"
            role="listbox"
          >
            {variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              const itemDiscount =
                v.mrp > v.price
                  ? Math.round(((v.mrp - v.price) / v.mrp) * 100)
                  : 0;

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariantId(v.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer border-b last:border-b-0 border-stone-100 ${
                    isSelected
                      ? "bg-[#FFF7ED] text-[#431407]"
                      : "hover:bg-[#FAF6EE] text-stone-800"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? "bg-[#7C2D12] text-white"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {getVariantBadge(v)}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
                        <span>{v.title}</span>
                        {itemDiscount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {itemDiscount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-bold text-[#7C2D12]">
                          ₹{v.price.toLocaleString("en-IN")}
                        </span>
                        {v.mrp > v.price && (
                          <span className="text-[11px] text-stone-400 line-through">
                            MRP ₹{v.mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="font-serif text-3xl font-bold text-[#7C2D12]">
          ₹{activeVariant.price.toLocaleString("en-IN")}
        </span>
        {activeVariant.mrp > activeVariant.price && (
          <span className="text-sm text-stone-400 line-through">
            MRP ₹{activeVariant.mrp.toLocaleString("en-IN")}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Save {discountPercent}% Instant
          </span>
        )}
        <span className="text-[11px] text-stone-500 font-medium ml-auto hidden sm:inline">
          (Inclusive of all taxes)
        </span>
      </div>

      {/* Stock status indicator */}
      <div className="text-xs font-medium">
        {activeVariant.stockQuantity > 5 ? (
          <span className="text-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
            Fresh Batch Available • Churned Before Sunrise • Ready to Dispatch
          </span>
        ) : activeVariant.stockQuantity > 0 ? (
          <span className="text-[#9A3412] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Only {activeVariant.stockQuantity} jars left from current batch!
          </span>
        ) : (
          <span className="text-rose-600 font-semibold">
            Currently Out of Stock (Fresh churning in progress)
          </span>
        )}
      </div>

      {/* Add to Cart CTA (Rosier Foods Terracotta Style) */}
      <button
        onClick={handleAddToCart}
        disabled={activeVariant.stockQuantity <= 0}
        className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer ${
          activeVariant.stockQuantity <= 0
            ? "bg-stone-300 text-stone-500 cursor-not-allowed"
            : addedAnimation
            ? "bg-emerald-700 text-white"
            : "bg-[#7C2D12] hover:bg-[#5E1F09] text-white"
        }`}
      >
        {addedAnimation ? (
          <>
            <Check className="w-5 h-5 text-white" />
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
