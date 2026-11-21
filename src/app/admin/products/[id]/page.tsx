import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Edit Product: {product.title}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Update product descriptions, nutritional facts, packaging variants, and stock.
        </p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
