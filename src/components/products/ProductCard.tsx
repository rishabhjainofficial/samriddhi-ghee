import Link from "next/link";
import Image from "next/image";
import { VariantSelector } from "./VariantSelector";

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
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
      {/* Image Gallery Thumbnail */}
      <Link href={`/products/${product.slug}`} className="block relative w-full h-60 sm:h-72 aspect-[4/3] bg-stone-100 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-103 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full z-10">
          Vedic Bilona Churned
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif font-bold text-lg text-stone-900 hover:text-amber-700 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Interactive Variant Picker & Add to Cart */}
        <VariantSelector
          productId={product.id}
          productTitle={product.title}
          variants={product.variants}
          imageUrl={primaryImage}
        />
      </div>
    </div>
  );
}
