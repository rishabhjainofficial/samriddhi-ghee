import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Add New Ghee Product
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Create a new product listing with multiple packaging variants, weights, and pricing.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
