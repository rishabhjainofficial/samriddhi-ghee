"use client";

import { Sparkles, Flame, Star, ShieldCheck, Truck, Zap } from "lucide-react";

const announcements = [
  {
    icon: Sparkles,
    text: "100% Traditional Vedic Bilona Churned Pure Desi Ghee",
  },
  {
    icon: Flame,
    text: "Direct from Udaipur • Single-Origin Gir Cow A2 Milk",
  },
  {
    icon: Star,
    text: "Rated 4.9/5 by 480+ Indian Households • #1 Best Seller",
  },
  {
    icon: Zap,
    text: "Rich Danedaar Texture • Selling Fast in Fresh Batches",
  },
  {
    icon: ShieldCheck,
    text: "Airtight Glass Jar Packaging • Zero Plastic Leaching",
  },
  {
    icon: Truck,
    text: "Safe & Fast All-India Safe Delivery to Your Kitchen",
  },
  {
    icon: Sparkles,
    text: "Zero Preservatives, Palm Oil, Vanaspati or Chemicals",
  },
];

export function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#5B1B07] via-[#7C2D12] to-[#5B1B07] text-amber-100 text-[11px] sm:text-xs font-medium py-2 border-b border-[#431407]/60 select-none shadow-xs">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Render 2 identical sets for seamless continuous marquee loop */}
        {[...Array(2)].map((_, setIndex) => (
          <div key={setIndex} className="flex items-center gap-8 shrink-0 pr-8">
            {announcements.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={`${setIndex}-${idx}`} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  <span className="tracking-wide">{item.text}</span>
                  <span className="text-amber-300/60 ml-4 font-bold">•</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
