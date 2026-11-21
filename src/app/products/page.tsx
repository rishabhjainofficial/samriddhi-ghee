import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/products/ProductCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pure Desi Ghee Collection | 100% Vedic Bilona Churned",
  description:
    "Explore Sanvrit's authentic Vedic Bilona A2 Desi Cow Ghee. Available in 1 Litre Glass Jar and 5 Litre Family Container. Dispatched fresh from Udaipur, Rajasthan.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Sanvrit Ghee Catalog | Vedic Bilona Cow Ghee",
    description:
      "Explore 100% pure Vedic Bilona A2 Desi Cow Ghee. Glass jar packaging with lab-certified purity.",
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

      <main className="flex-1 py-12 sm:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
              Farm-Fresh Ghee Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Our Pure Desi Ghee Selection
            </h1>
            <p className="text-sm text-stone-600 mt-2">
              Every jar is poured warm, sealed airtight in food-grade glass, and delivered fresh to your kitchen.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
