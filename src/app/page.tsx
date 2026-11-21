import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/products/ProductCard";
import { ShieldCheck, Award, Sparkles, Flame, CheckCircle, ArrowRight } from "lucide-react";

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

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cream via-amber-50/40 to-cream py-16 sm:py-24 border-b border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text / Pitch */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sacred Ayurvedic Gold • 100% Cultured Bilona Ghee</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-950 tracking-tight leading-[1.15]">
                  Purity in Every Drop, <br />
                  <span className="text-amber-600 italic">Tradition in Every Jar.</span>
                </h1>

                <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
                  Handcrafted from whole milk curd of free-grazing indigenous Gir cows. Churned both ways using wooden churners and simmered on slow cow-dung firewood to yield golden, danedaar granular purity.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Order Pure Ghee</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="#bilona-process"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm rounded-full border border-stone-300 shadow-xs transition-colors"
                  >
                    <span>Our Bilona Process</span>
                  </Link>
                </div>

                {/* Micro trust stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-stone-200/80 max-w-md">
                  <div>
                    <span className="block font-serif text-2xl font-bold text-amber-700">100%</span>
                    <span className="text-xs text-stone-500">Pure & Unadulterated</span>
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-bold text-amber-700">A2</span>
                    <span className="text-xs text-stone-500">Gir Cow Whole Milk</span>
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-bold text-amber-700">0%</span>
                    <span className="text-xs text-stone-500">Preservatives or Chemicals</span>
                  </div>
                </div>
              </div>

              {/* Hero Image / Jar Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-xs sm:max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white p-4">
                  <Image
                    src="/images/sanvrit-a2-ghee-front.webp"
                    alt="Sanvrit Pure A2 Desi Cow Ghee - Taste of Purity"
                    width={600}
                    height={750}
                    priority
                    className="w-full h-auto object-contain max-h-[460px]"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
                        Fresh Harvest Batch
                      </span>
                      <span className="font-serif font-bold text-sm text-stone-900">
                        Granular Golden Bilona Ghee
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      Lab Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 TRUST BADGES */}
        <section className="py-10 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Vedic Fire Cooked</h4>
                  <p className="text-xs text-stone-500">Slow firewood simmered</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">100% Grass-Fed</h4>
                  <p className="text-xs text-stone-500">Free grazing cows</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Curd Churned (Bilona)</h4>
                  <p className="text-xs text-stone-500">Never direct cream</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Glass Jar Packed</h4>
                  <p className="text-xs text-stone-500">Zero plastic leaching</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-16 sm:py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
                Pure Artisanal Ghee
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Crafted for Health & Longevity
              </h2>
              <p className="text-sm text-stone-600 mt-3">
                Choose your size. Available in 1 Litre Glass Jar and 5 Litre Family Container, dispatched fresh from our dairy.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* THE 5-STEP BILONA METHOD STORY */}
        <section id="bilona-process" className="py-16 sm:py-24 bg-white border-t border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
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
                  className="bg-cream/60 p-6 rounded-2xl border border-stone-200 relative group hover:border-amber-400 transition-colors"
                >
                  <span className="font-serif text-3xl font-bold text-amber-500/40 group-hover:text-amber-600/70 transition-colors block mb-2">
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
      </main>

      <Footer />
    </>
  );
}
