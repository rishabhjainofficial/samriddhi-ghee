import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Package, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      variants: true,
      category: true,
    },
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Product Master
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your pure ghee catalog, pack sizes/variants, pricing, and shipping dimensions.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Variants</th>
                <th className="py-3.5 px-4">Price Range</th>
                <th className="py-3.5 px-4">Total Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {products.map((product) => {
                let images: string[] = [];
                try {
                  images = JSON.parse(product.images);
                } catch {
                  images = [];
                }
                const thumbnail = images[0] || "/images/sanvrit-a2-ghee-front.webp";

                const prices = product.variants.map((v) => v.price);
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
                const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);

                return (
                  <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={thumbnail}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div>
                          <span className="font-serif font-bold text-stone-900 block truncate max-w-xs">
                            {product.title}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            /products/{product.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{product.category.name}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-md text-stone-800 font-semibold">
                        <Layers className="w-3 h-3 text-amber-600" />
                        {product.variants.length} sizes
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                      ₹{minPrice.toLocaleString("en-IN")} {minPrice !== maxPrice && `- ₹${maxPrice.toLocaleString("en-IN")}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                          totalStock < 15 ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-800"
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
