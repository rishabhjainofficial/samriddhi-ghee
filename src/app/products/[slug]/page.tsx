import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { VariantSelector } from "@/components/products/VariantSelector";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductRating, ProductBadgesRibbon } from "@/components/products/ProductRating";
import { FAQSection } from "@/components/home/FAQSection";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Check,
  Utensils,
  Clock,
  Package,
  Star,
  CheckCircle2,
  XCircle,
  Flame,
  TrendingUp,
  Zap,
  FileCheck2,
} from "lucide-react";

export const dynamic = "force-dynamic";

const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
      category: true,
    },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found | Sanvrit Ghee" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sanvritghee.com";
  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = ["/images/sanvrit-a2-ghee-front.webp"];
  }

  const primaryImage = images[0] || "/images/sanvrit-a2-ghee-front.webp";

  return {
    title: `${product.title} | Direct from Udaipur`,
    description:
      "Handcrafted in small batches in Udaipur from the whole milk of free-grazing indigenous Gir cows. Traditional curd-churned Vedic Bilona Ghee.",
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.title} • Traditional Curd-Churned Gir Cow Ghee`,
      description:
        "Handcrafted in Udaipur from Gir cow curd. Rich danedaar texture, lab-certified pure.",
      url: `${siteUrl}/products/${product.slug}`,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 1000,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Sanvrit Ghee`,
      description: product.description.slice(0, 160),
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sanvritghee.com";

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = ["/images/sanvrit-a2-ghee-front.webp"];
  }

  const primaryImage = images[0] || "/images/sanvrit-a2-ghee-front.webp";

  const minPrice =
    product.variants.length > 0
      ? Math.min(...product.variants.map((v) => v.price))
      : 1200;
  const maxPrice =
    product.variants.length > 0
      ? Math.max(...product.variants.map((v) => v.price))
      : 5500;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: images.map((img) => `${siteUrl}${img}`),
    description: product.description,
    sku: product.variants[0]?.sku || "SANVRIT-A2-1L",
    brand: {
      "@type": "Brand",
      name: "Sanvrit",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Dharmasya Food Products Pvt. Ltd.",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "480",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: product.variants.length,
      offers: product.variants.map((v) => ({
        "@type": "Offer",
        price: v.price,
        priceCurrency: "INR",
        name: v.title,
        sku: v.sku,
        availability:
          v.stockQuantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `${siteUrl}/products/${product.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <main className="flex-1 py-10 sm:py-16 bg-[#FAF6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Product Card */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Product Image Gallery */}
              <div className="lg:col-span-6">
                <ProductImageGallery images={images} title={product.title} />

                {/* Badges Ribbon under gallery */}
                <div className="mt-6">
                  <ProductBadgesRibbon />
                </div>
              </div>

              {/* Product Information & Purchase Selector */}
              <div className="lg:col-span-6 space-y-6">
                {/* Social Proof & Ratings */}
                <div className="space-y-3">
                  <ProductRating rating={4.9} reviewCount={480} showBadges={true} size="md" />

                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
                    {product.title}
                  </h1>

                  <p className="text-amber-900 font-medium text-sm sm:text-base leading-snug">
                    Traditional Curd-Churned Gir Cow Ghee • Rich Danedaar Texture • Direct from Udaipur
                  </p>
                </div>

                {/* Short Intro (Above the Fold) */}
                <div className="p-4 rounded-2xl bg-[#F3ECE0]/50 border border-amber-200/60 text-stone-700 text-sm leading-relaxed">
                  {product.description}
                </div>

                {/* Variant Selector + Add to Cart */}
                <div className="p-5 rounded-3xl bg-[#FAF6EE] border border-stone-200">
                  <VariantSelector
                    productId={product.id}
                    productTitle={product.title}
                    variants={product.variants}
                    imageUrl={primaryImage}
                  />
                </div>

                {/* Pack Sizes Available Explainer */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#7C2D12]" />
                    <span>Pack Sizes Available:</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF6EE]">
                      <span className="font-bold text-stone-900 block mb-1">
                        1 Litre Glass Jar
                      </span>
                      <p className="text-stone-600 leading-relaxed">
                        Packed in a food-grade glass jar to prevent plastic leaching and preserve freshness from the first spoon to the last.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF6EE]">
                      <span className="font-bold text-stone-900 block mb-1">
                        5 Litre Family Container
                      </span>
                      <p className="text-stone-600 leading-relaxed">
                        Value bulk pack ideal for daily household cooking, festive sweets, and regular Ayurvedic use.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why Sanvrit A2 Ghee Stands Out */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#7C2D12]" />
                    <span>Why Sanvrit A2 Ghee Stands Out:</span>
                  </h3>
                  <div className="space-y-2 text-xs text-stone-700">
                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF6EE] border border-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900">100% Curd-Churned (Vedic Bilona Method):</strong> Made strictly from whole milk curd—never directly from industrial cream or malai.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF6EE] border border-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900">Single-Origin Gir Cow A2 Milk:</strong> Sourced from grass-fed, free-grazing native cows raised without synthetic hormones.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF6EE] border border-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900">Controlled Small-Batch Simmering:</strong> Gently clarified to preserve healthy fatty acids (including butyric acid and omega-3s) without burning or bitterness.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF6EE] border border-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900">Pure & Unadulterated:</strong> Zero preservatives, palm oil, vanaspati, artificial colours, or added flavours.
                      </div>
                    </div>
                  </div>
                </div>

                {/* How to Use */}
                <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-stone-200 text-xs text-stone-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-serif font-bold text-stone-900 text-sm">
                    <Utensils className="w-4 h-4 text-[#7C2D12]" />
                    <span>How to Use:</span>
                  </div>
                  <p className="leading-relaxed text-stone-600">
                    Drizzle warm over hot rotis, dal, and steamed rice; use for high-smoke-point tadka and sautéing; or take one teaspoon on an empty stomach in the morning with lukewarm water.
                  </p>
                </div>

                {/* Storage & Shelf Life */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs text-stone-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-serif font-bold text-stone-900 text-sm">
                    <Clock className="w-4 h-4 text-[#7C2D12]" />
                    <span>Storage & Shelf Life:</span>
                  </div>
                  <p className="leading-relaxed text-stone-600">
                    Store in a cool, dry place away from direct sunlight. Always use a clean, dry spoon. Best before 12 months from the date of manufacture.
                  </p>
                </div>

                {/* Pure Ingredients */}
                {product.ingredients && (
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Pure Ingredients:
                    </span>
                    <p className="text-xs text-stone-500">{product.ingredients}</p>
                  </div>
                )}

                {/* Manufacturer & Quality Compliance */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200 font-semibold text-stone-800">
                    <span>Manufacturing & Compliance</span>
                    <span className="text-emerald-700 font-medium">100% Lab Verified</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="font-bold text-stone-700 block">Manufacturer:</span>
                      <p>Dharmasya Food Products Pvt. Ltd.</p>
                      <p className="text-stone-500">128-129, S.M. Lodha Complex, Udaipur, RJ - 313001</p>
                    </div>
                    <div>
                      <span className="font-bold text-stone-700 block">Dairy Unit:</span>
                      <p>Hiran Magri, Udaipur, RJ - 313002</p>
                      <p className="text-amber-800 font-semibold mt-0.5">FSSAI Lic: 22225088000714</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIGNATURE COMPARISON MATRIX ON PDP */}
          <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-[#7C2D12] uppercase tracking-widest block mb-1">
                Transparency & Purity
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Why Sanvrit Outperforms Ordinary Ghee
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF6EE]">
                    <th className="py-3.5 px-6 font-bold text-stone-800">Quality Parameter</th>
                    <th className="py-3.5 px-6 font-bold text-[#7C2D12] bg-amber-100/50">
                      Sanvrit A2 Bilona Ghee
                    </th>
                    <th className="py-3.5 px-6 font-bold text-stone-500">
                      Ordinary Factory Ghee
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-stone-900">Base Source</td>
                    <td className="py-3.5 px-6 bg-amber-50/30 text-emerald-900 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Whole Milk Curd</span>
                    </td>
                    <td className="py-3.5 px-6 text-stone-500">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Factory cream / malai</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-stone-900">Cow Breed</td>
                    <td className="py-3.5 px-6 bg-amber-50/30 text-emerald-900 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Indigenous Gir Cow (A2)</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-stone-500">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Mixed Jersey / HF (A1)</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-stone-900">Simmering</td>
                    <td className="py-3.5 px-6 bg-amber-50/30 text-emerald-900 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Slow Firewood Heat</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-stone-500">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>High-pressure steam boiling</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-stone-900">Packaging</td>
                    <td className="py-3.5 px-6 bg-amber-50/30 text-emerald-900 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Food-Grade Glass Jar</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-stone-500">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Plastic pouches or tins</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Customer Reviews & Rating Social Proof Section */}
          <section className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-[#7C2D12] text-xs font-bold">
                      Verified Buyer Feedback
                    </span>
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                      Selling Fast
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    Rated 4.9 out of 5 by 480+ Indian Households
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Direct from our Udaipur dairy to kitchens across India.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="font-serif text-4xl sm:text-5xl font-bold text-[#7C2D12]">
                    4.9<span className="text-xl text-stone-400 font-sans">/5</span>
                  </div>
                  <div className="flex items-center sm:justify-end text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500 mt-1 block">
                    99% Customer Recommendation Rate
                  </span>
                </div>
              </div>

              {/* Sample Verified Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-stone-200/80 space-y-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    &quot;The granular danedaar texture and aroma instantly reminded me of the ghee my grandmother churned in Rajasthan. Real bilona taste!&quot;
                  </p>
                  <div className="pt-2 text-[11px] font-semibold text-stone-900">
                    — Meenakshi S., Jaipur (Verified Buyer)
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-stone-200/80 space-y-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    &quot;Glass jar packaging arrived safe with zero leakage. You can see and smell the difference compared to commercial brands.&quot;
                  </p>
                  <div className="pt-2 text-[11px] font-semibold text-stone-900">
                    — Rajesh V., Mumbai (Verified Buyer)
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-stone-200/80 space-y-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    &quot;We bought the 5 Litre container for the entire family. It is pure, fragrant, and perfect for morning Ayurvedic intake.&quot;
                  </p>
                  <div className="pt-2 text-[11px] font-semibold text-stone-900">
                    — Dr. Ananya P., Delhi (Verified Buyer)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <FAQSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
