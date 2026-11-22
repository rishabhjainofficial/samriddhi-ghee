import Link from "next/link";
import Image from "next/image";
import { VariantSelector } from "./VariantSelector";
import { Star, Flame, TrendingUp, Zap, Sparkles, ShieldCheck } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    images: string;
    variants: Array<{
      id: string;
      title: string;
      sku: string;
      price: number;
      mrp: number;
      stockQuantity: number;
      weightInGrams: number;
      isActive: boolean;
    }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = ["/images/sanvrit-a2-ghee-front.webp"];
  }

  const primaryImage = images[0] || "/images/sanvrit-a2-ghee-front.webp";

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Image Gallery Thumbnail with Rating & Badges */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative w-full h-72 sm:h-84 bg-[#F8F4EC] border-b border-stone-200/70 overflow-hidden"
      >
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 bg-[#7C2D12] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
            <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span>#1 Best Seller</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-800 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
            <ShieldCheck className="w-3 h-3" />
            <span>Lab Certified A2</span>
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs animate-pulse">
            <Zap className="w-3 h-3 fill-white" />
            <span>Selling Fast</span>
          </span>
        </div>

        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-200 shadow-xs flex items-center gap-1.5 text-xs z-10">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-bold text-stone-900 text-[11px]">4.9</span>
          <span className="text-stone-500 text-[11px]">(480+ Reviews)</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Subtitle / Tagline */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#7C2D12] uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Direct from Udaipur • Traditional Curd Bilona</span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 hover:text-[#7C2D12] transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-amber-900 font-medium mt-1">
            Traditional Curd-Churned Gir Cow Ghee • Rich Danedaar Texture • Direct from Udaipur
          </p>

          <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>

          {/* Available Sizes Pills */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
            <span className="font-bold text-stone-800">Available Packs:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 font-medium border border-stone-200">
              1L Glass Jar
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 font-medium border border-stone-200">
              5L Family Container
            </span>
          </div>
        </div>

        {/* Interactive Variant Picker & Add to Cart */}
        <div className="pt-2">
          <VariantSelector
            productId={product.id}
            productTitle={product.title}
            variants={product.variants}
            imageUrl={primaryImage}
          />
        </div>
      </div>
    </div>
  );
}
