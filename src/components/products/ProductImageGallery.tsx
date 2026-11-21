"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const activeImage = images[activeIdx] || images[0] || "/images/sanvrit-a2-ghee-front.webp";

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative w-full h-[320px] sm:h-[420px] aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-xs flex items-center justify-center p-4">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4 transition-all duration-300"
        />
        <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-sm z-10">
          {activeIdx === 0 ? "Front View • 1000ml" : "Nutritional & Label Details"}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`View ${title} packaging view ${idx + 1}`}
              aria-current={activeIdx === idx ? "true" : undefined}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 p-1 bg-white transition-all cursor-pointer ${
                activeIdx === idx
                  ? "border-amber-600 ring-2 ring-amber-500/30 scale-102"
                  : "border-stone-200 hover:border-amber-300 opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} view ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
