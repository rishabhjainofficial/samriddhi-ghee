import { Star, TrendingUp, Flame, Zap, Award, ShieldCheck } from "lucide-react";

interface ProductRatingProps {
  rating?: number;
  reviewCount?: number;
  showBadges?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProductRating({
  rating = 4.9,
  reviewCount = 480,
  showBadges = true,
  size = "md",
}: ProductRatingProps) {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Stars + Numeric Rating */}
      <div className="inline-flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
        <div className="flex items-center text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`${starSize} fill-amber-400 text-amber-400`} />
          ))}
        </div>
        <span className={`font-bold text-amber-950 ${textSize}`}>
          {rating.toFixed(1)}
        </span>
        <span className={`text-stone-500 ${textSize}`}>
          ({reviewCount}+ reviews)
        </span>
      </div>

      {showBadges && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7C2D12] text-white shadow-xs">
            <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span>#1 Best Seller</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <TrendingUp className="w-3 h-3 text-emerald-700" />
            <span>Trending</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Zap className="w-3 h-3 text-rose-600 fill-rose-600" />
            <span>Selling Fast</span>
          </span>
        </div>
      )}
    </div>
  );
}

export function ProductBadgesRibbon() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-3">
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900">
        <Flame className="w-4 h-4 text-amber-600 shrink-0 fill-amber-600" />
        <div>
          <span className="font-bold block text-stone-900">#1 Best Seller</span>
          <span className="text-[11px] text-stone-600">Pure Desi Gir Cow Ghee</span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs text-emerald-900">
        <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
        <div>
          <span className="font-bold block text-stone-900">Trending Fast</span>
          <span className="text-[11px] text-stone-600">Fresh Small-Batch Harvest</span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/70 text-xs text-rose-900">
        <Zap className="w-4 h-4 text-rose-600 shrink-0 fill-rose-600" />
        <div>
          <span className="font-bold block text-stone-900">Selling Fast</span>
          <span className="text-[11px] text-stone-600">Limited Daily Churn Capacity</span>
        </div>
      </div>
    </div>
  );
}
