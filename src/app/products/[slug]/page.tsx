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
import { ShieldCheck, Award, Sparkles, Check } from "lucide-react";

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

  return {
    title: `${product.title} | Pure Vedic Bilona Ghee - Sanvrit`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: ["/images/sanvrit-a2-ghee-front.webp"],
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

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = ["/images/sanvrit-a2-ghee-front.webp"];
  }

  const primaryImage = images[0] || "/images/sanvrit-a2-ghee-front.webp";

  return (
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <main className="flex-1 py-12 sm:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Product Image Gallery */}
              <div className="lg:col-span-6">
                <ProductImageGallery images={images} title={product.title} />
              </div>

              {/* Product Information & Purchase Selector */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Traditional Vedic Bilona Hand-Churned</span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                    {product.title}
                  </h1>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* Variant Selector + Add to Cart */}
                <div className="p-5 rounded-2xl bg-cream/70 border border-stone-200">
                  <VariantSelector
                    productId={product.id}
                    productTitle={product.title}
                    variants={product.variants}
                    imageUrl={primaryImage}
                  />
                </div>

                {/* Benefits */}
                {product.benefits && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-serif font-bold text-sm text-stone-900">
                      Ayurvedic Health Benefits:
                    </h3>
                    <div className="space-y-1.5 text-xs text-stone-600">
                      {product.benefits.split("\n").map((b, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b.replace(/^[•\-]\s*/, "")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredients & Origin */}
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
                    <span className="text-emerald-700 font-medium">100% Verified</span>
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
                  <div className="pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                    <span>Best Before: 12 Months from Packaging</span>
                    <span>Storage: Airtight glass jar in cool & dry place</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
