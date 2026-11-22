import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/products/ProductCard";
import { FAQSection } from "@/components/home/FAQSection";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Flame,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Zap,
  Star,
  Package,
  Utensils,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Truck,
  HeartHandshake,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
    },
  });

  return (
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <main className="flex-1 bg-[#FAF6EE]">
        {/* HERO SECTION - ROSIER FOODS D2C STYLE */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F3ECE0]/70 via-[#FAF6EE] to-[#FAF6EE] pt-5 sm:pt-7 pb-12 sm:pb-16 border-b border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text / Pitch */}
              <div className="lg:col-span-7 space-y-6">
                {/* Ratings & Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C2D12] text-white text-xs font-bold shadow-xs">
                    <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>#1 Best Seller</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Trending in A2 Ghee</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                    <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                    <span>Selling Fast</span>
                  </span>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-amber-950 text-xs font-semibold border border-amber-200/80 shadow-xs">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold">4.9</span>
                    <span className="text-stone-500">(480+ Reviews)</span>
                  </div>
                </div>

                {/* Main Product Title */}
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]">
                  Sanvrit A2 Desi Cow <br />
                  <span className="text-[#7C2D12] italic">Bilona Ghee</span>
                </h1>

                {/* Subtitle / Tagline */}
                <p className="text-base sm:text-lg font-medium text-amber-900 leading-snug">
                  Traditional Curd-Churned Gir Cow Ghee • Rich Danedaar Texture • Direct from Udaipur
                </p>

                {/* Short Intro (Above the Fold) */}
                <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
                  Handcrafted in small batches in Udaipur from the whole milk of free-grazing indigenous Gir cows. Unlike commercial cream-based ghee, Sanvrit Ghee is cultured overnight into curd, bi-directionally churned using a traditional wooden madhani before sunrise, and slow-simmered under controlled heat to lock in its natural aroma, rich granular (danedaar) texture, and essential nutrients.
                </p>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#7C2D12] hover:bg-[#5E1F09] text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-xl transition-all"
                  >
                    <span>Shop Pure Ghee (Selling Fast)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/our-story"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm rounded-2xl border border-stone-300 shadow-xs transition-colors"
                  >
                    <span>Our Story</span>
                  </Link>
                </div>

                {/* Micro trust stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-stone-200 max-w-md">
                  <div>
                    <span className="block font-serif text-2xl font-bold text-[#7C2D12]">100%</span>
                    <span className="text-xs text-stone-500">Curd-Churned Bilona</span>
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-bold text-[#7C2D12]">Gir Cow</span>
                    <span className="text-xs text-stone-500">A2 Whole Milk</span>
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-bold text-[#7C2D12]">Udaipur</span>
                    <span className="text-xs text-stone-500">Direct From Source</span>
                  </div>
                </div>
              </div>

              {/* Hero Image / Jar Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-xs sm:max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white p-4">
                  <Image
                    src="/images/sanvrit-a2-ghee-front.webp"
                    alt="Sanvrit A2 Desi Cow Bilona Ghee - Direct from Udaipur"
                    width={600}
                    height={750}
                    priority
                    className="w-full h-auto object-contain max-h-[460px]"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#7C2D12] uppercase tracking-wider block">
                        Fresh Churned Batch
                      </span>
                      <span className="font-serif font-bold text-sm text-stone-900">
                        Rich Danedaar Texture
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      Lab Certified A2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 TRUST BADGES - ROSIER FOODS D2C STYLE */}
        <section className="py-10 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#7C2D12] flex items-center justify-center shrink-0 border border-amber-100">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">100% Curd-Churned</h4>
                  <p className="text-xs text-stone-500">Vedic Bilona (Never Malai)</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Gir Cow A2 Milk</h4>
                  <p className="text-xs text-stone-500">Free-grazing native cows</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Controlled Simmering</h4>
                  <p className="text-xs text-stone-500">Preserves healthy fatty acids</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Pure & Unadulterated</h4>
                  <p className="text-xs text-stone-500">Zero preservatives or colours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCT SHOWCASE */}
        <section className="py-16 sm:py-20 bg-[#FAF6EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#7C2D12] uppercase tracking-widest block mb-2">
                Order Direct from Dairy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Fresh Batch Ready for Dispatch
              </h2>
              <p className="text-sm text-stone-600 mt-2">
                Dispatched fresh from Udaipur, Rajasthan with all-India safe delivery in premium glass jars.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* SIGNATURE ROSIER FOODS FEATURE: SANVRIT VS FACTORY GHEE COMPARISON MATRIX */}
        <section className="py-16 sm:py-20 bg-white border-t border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#7C2D12] uppercase tracking-widest block mb-2">
                Transparency Matters
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Sanvrit A2 Bilona Ghee vs Ordinary Ghee
              </h2>
              <p className="text-sm text-stone-600 mt-2">
                See why traditional curd-churned Bilona ghee is fundamentally different from commercial factory ghee.
              </p>
            </div>

            <div className="bg-[#FAF6EE] rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 bg-[#F3ECE0]/80">
                      <th className="py-4 px-6 font-bold text-stone-800">Quality Parameter</th>
                      <th className="py-4 px-6 font-bold text-[#7C2D12] bg-amber-100/50">
                        Sanvrit A2 Desi Gir Cow Ghee
                      </th>
                      <th className="py-4 px-6 font-bold text-stone-500">
                        Ordinary Commercial Factory Ghee
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70">
                    <tr className="hover:bg-amber-50/20">
                      <td className="py-4 px-6 font-semibold text-stone-900">Starting Raw Material</td>
                      <td className="py-4 px-6 bg-amber-50/30 font-medium text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Whole Milk Curd (100% Vedic Method)</span>
                      </td>
                      <td className="py-4 px-6 text-stone-500">
                        <span className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Industrial cream or leftover factory malai</span>
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-amber-50/20">
                      <td className="py-4 px-6 font-semibold text-stone-900">Cow Breed & Milk Type</td>
                      <td className="py-4 px-6 bg-amber-50/30 font-medium text-emerald-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Indigenous Gir Cows (100% A2 Beta-Casein)</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-stone-500">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Crossbred Jersey / HF cows or mixed buffalo</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-amber-50/20">
                      <td className="py-4 px-6 font-semibold text-stone-900">Churning Technique</td>
                      <td className="py-4 px-6 bg-amber-50/30 font-medium text-emerald-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Bi-directional wooden madhani before sunrise</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-stone-500">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>High-speed industrial electric centrifuges</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-amber-50/20">
                      <td className="py-4 px-6 font-semibold text-stone-900">Clarification & Simmering</td>
                      <td className="py-4 px-6 bg-amber-50/30 font-medium text-emerald-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Slow firewood flame in traditional vessels</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-stone-500">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>High temperature flash boiling (loss of nutrients)</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-amber-50/20">
                      <td className="py-4 px-6 font-semibold text-stone-900">Texture & Aroma</td>
                      <td className="py-4 px-6 bg-amber-50/30 font-medium text-emerald-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Rich granular (Danedaar) & authentic aroma</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-stone-500">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Greasy, flat, with added synthetic fragrances</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-amber-50/20">
                      <td className="py-4 px-6 font-semibold text-stone-900">Packaging Safety</td>
                      <td className="py-4 px-6 bg-amber-50/30 font-medium text-emerald-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Food-grade glass jar (Zero chemical leaching)</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-stone-500">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Plastic containers or leachable poly pouches</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* WHY SANVRIT A2 GHEE STANDS OUT */}
        <section id="why-stands-out" className="py-16 sm:py-20 bg-[#FAF6EE] border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#7C2D12] uppercase tracking-widest block mb-2">
                Uncompromising Purity
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Why Sanvrit A2 Ghee Stands Out
              </h2>
              <p className="text-sm text-stone-600 mt-2">
                Crafted with sacred care in Udaipur, preserving Ayurvedic integrity in every jar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-[#7C2D12] flex items-center justify-center shrink-0 font-bold text-base">
                  01
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
                    100% Curd-Churned (Vedic Bilona Method)
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Made strictly from whole milk curd—never directly from industrial cream or malai. Cultured overnight to cultivate beneficial bio-active properties.
                  </p>
                </div>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-[#7C2D12] flex items-center justify-center shrink-0 font-bold text-base">
                  02
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
                    Single-Origin Gir Cow A2 Milk
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Sourced from grass-fed, free-grazing native cows raised without synthetic hormones, antibiotics, or chemical feed supplements.
                  </p>
                </div>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-[#7C2D12] flex items-center justify-center shrink-0 font-bold text-base">
                  03
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
                    Controlled Small-Batch Simmering
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Gently clarified to preserve healthy fatty acids (including butyric acid and omega-3s) without burning or bitterness.
                  </p>
                </div>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-[#7C2D12] flex items-center justify-center shrink-0 font-bold text-base">
                  04
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
                    Pure & Unadulterated
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Zero preservatives, palm oil, vanaspati, artificial colours, or added flavours. 100% natural, golden, granular perfection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PACK SIZES AVAILABLE */}
        <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#7C2D12] uppercase tracking-widest block mb-2">
                Thoughtful Packaging
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Pack Sizes Available
              </h2>
              <p className="text-sm text-stone-600 mt-2">
                Delivered safely to your doorstep in premium, food-safe containers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-3xl bg-[#FAF6EE] border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#7C2D12] text-xs font-bold mb-4">
                    <Package className="w-3.5 h-3.5" />
                    <span>Pure Glass Packaging</span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-stone-900 mb-2">
                    1 Litre Glass Jar
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed mb-6">
                    Packed in a food-grade glass jar to prevent plastic leaching and preserve freshness from the first spoon to the last. Perfect for everyday culinary use and maintaining optimal granular crystallization.
                  </p>
                </div>
                <Link
                  href="/products/sanvrit-a2-desi-cow-ghee"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#7C2D12] hover:bg-[#5E1F09] text-white font-bold text-xs transition-colors"
                >
                  <span>Select 1L Glass Jar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-8 rounded-3xl bg-[#FAF6EE] border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Best Value Family Pack</span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-stone-900 mb-2">
                    5 Litre Family Container
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed mb-6">
                    Value bulk pack ideal for daily household cooking, festive sweets, and regular Ayurvedic use. Sturdy, food-grade airtight design preserves aroma and keeps ghee fresh for the entire family.
                  </p>
                </div>
                <Link
                  href="/products/sanvrit-a2-desi-cow-ghee"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
                >
                  <span>Select 5L Family Container</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LAB REPORT TRANSPARENCY BANNER (ROSIER FOODS STYLE) */}
        <section className="py-14 sm:py-16 bg-[#F3ECE0]/70 border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>100% Quality & Lab Transparency</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Certified by NABL-Accredited Food Laboratories
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Every batch of Sanvrit Ghee is tested for A2 Beta-Casein verification, RM value (&gt;28), zero palm oil, and zero synthetic adulteration. FSSAI License: 22225088000714.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/lab-reports"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#7C2D12] hover:bg-[#5E1F09] text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>View Lab Reports</span>
                </Link>
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-stone-300 text-stone-800 font-semibold text-xs hover:bg-stone-50 transition-colors"
                >
                  <span>Order Now</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS & SOCIAL PROOF (JUDGE.ME D2C STYLE) */}
        <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold text-[#7C2D12] uppercase tracking-widest block mb-2">
                  Customer Testimonials
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                  Loved by 480+ Indian Households
                </h2>
                <p className="text-sm text-stone-600 mt-2">
                  Real feedback from verified buyers across India.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-[#FAF6EE] p-4 rounded-2xl border border-stone-200">
                <div className="font-serif text-4xl font-bold text-[#7C2D12]">
                  4.9<span className="text-lg text-stone-400 font-sans">/5</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-600 font-medium block">
                    Based on 480+ verified reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-stone-200 space-y-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <h4 className="font-bold text-stone-900 text-sm">
                  &quot;The aroma takes you back to your childhood home&quot;
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The granular danedaar texture and aroma instantly reminded me of the ghee my grandmother churned in Rajasthan. Real bilona taste!
                </p>
                <div className="pt-2 text-xs font-semibold text-stone-900 border-t border-stone-200">
                  — Meenakshi S., Jaipur (Verified Buyer)
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-stone-200 space-y-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <h4 className="font-bold text-stone-900 text-sm">
                  &quot;Safe glass packaging & unbeatable purity&quot;
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Glass jar packaging arrived safe with zero leakage. You can see and smell the difference compared to commercial brands.
                </p>
                <div className="pt-2 text-xs font-semibold text-stone-900 border-t border-stone-200">
                  — Rajesh V., Mumbai (Verified Buyer)
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-stone-200 space-y-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <h4 className="font-bold text-stone-900 text-sm">
                  &quot;Value 5L pack is great for our daily kitchen&quot;
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We bought the 5 Litre container for the entire family. It is pure, fragrant, and perfect for morning Ayurvedic intake.
                </p>
                <div className="pt-2 text-xs font-semibold text-stone-900 border-t border-stone-200">
                  — Dr. Ananya P., Delhi (Verified Buyer)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO USE & STORAGE GUIDELINES */}
        <section className="py-14 sm:py-18 bg-[#FAF6EE] border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs">
                <div className="flex items-center gap-2.5 font-serif font-bold text-stone-900 text-lg mb-2">
                  <Utensils className="w-5 h-5 text-[#7C2D12]" />
                  <span>How to Use</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Drizzle warm over hot rotis, dal, and steamed rice; use for high-smoke-point tadka and sautéing; or take one teaspoon on an empty stomach in the morning with lukewarm water.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs">
                <div className="flex items-center gap-2.5 font-serif font-bold text-stone-900 text-lg mb-2">
                  <Clock className="w-5 h-5 text-[#7C2D12]" />
                  <span>Storage & Shelf Life</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Store in a cool, dry place away from direct sunlight. Always use a clean, dry spoon. Best before 12 months from the date of manufacture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE 5-STEP BILONA METHOD STORY */}
        <section id="bilona-process" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#7C2D12] uppercase tracking-widest block mb-2">
                Ancient Vedic Wisdom
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                The Authentic 5-Step Bilona Journey
              </h2>
              <p className="text-sm text-stone-600 mt-3">
                Unlike industrial ghee made in minutes by boiling factory cream, Sanvrit Ghee takes over 36 hours of patient, sacred preparation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  step: "01",
                  title: "Fresh Whole Milk",
                  desc: "Milked lovingly by hand from free-grazing, grass-fed native Indian cows.",
                },
                {
                  step: "02",
                  title: "Natural Curdling",
                  desc: "Milk is boiled gently in clay pots and cultured overnight into probiotic-rich curd.",
                },
                {
                  step: "03",
                  title: "Wooden Bilona Churn",
                  desc: "Curd is bi-directionally churned before sunrise using traditional wooden madhani.",
                },
                {
                  step: "04",
                  title: "Makkhan Separation",
                  desc: "Pure white cultured butter (makkhan) floats to the top, leaving fresh buttermilk.",
                },
                {
                  step: "05",
                  title: "Slow Fire Simmering",
                  desc: "Makkhan is melted on slow cow-dung firewood until golden danedaar ghee crystallizes.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-[#FAF6EE] p-6 rounded-3xl border border-stone-200 relative group hover:border-[#7C2D12] transition-colors shadow-xs"
                >
                  <span className="font-serif text-3xl font-bold text-[#7C2D12]/40 group-hover:text-[#7C2D12] transition-colors block mb-2">
                    {item.step}
                  </span>
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <FAQSection />
      </main>

      <Footer />
    </>
  );
}
