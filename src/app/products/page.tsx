import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/products/ProductCard";
import { FAQSection } from "@/components/home/FAQSection";
import { Flame, TrendingUp, Zap, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sanvrit A2 Desi Cow Bilona Ghee Catalog | Direct from Udaipur",
  description:
    "Explore Sanvrit's authentic Vedic Bilona A2 Desi Cow Ghee. Traditional Curd-Churned Gir Cow Ghee • Rich Danedaar Texture • Direct from Udaipur.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Sanvrit A2 Desi Cow Bilona Ghee Catalog",
    description:
      "Handcrafted in small batches in Udaipur from the whole milk curd of free-grazing indigenous Gir cows.",
    url: "/products",
  },
};

export default async function ProductsPage() {
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

      <main className="flex-1 py-12 sm:py-16 bg-[#FAF6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#7C2D12] text-white text-xs font-bold shadow-xs">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>#1 Best Seller</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>Trending in A2 Ghee</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>Selling Fast</span>
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Sanvrit A2 Desi Cow Bilona Ghee
            </h1>
            <p className="text-sm font-medium text-amber-900 mt-2">
              Traditional Curd-Churned Gir Cow Ghee • Rich Danedaar Texture • Direct from Udaipur
            </p>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl mx-auto">
              Every jar is poured warm, sealed airtight in food-grade glass, and delivered fresh to your kitchen with all-India safe dispatch.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Frequently Asked Questions */}
          <div className="mt-16 sm:mt-24">
            <FAQSection />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
