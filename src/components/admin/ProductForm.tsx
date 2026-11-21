"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  product?: any;
  categories: Array<{ id: string; name: string }>;
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let initialImages: string[] = [];
  try {
    initialImages = product?.images ? JSON.parse(product.images) : [];
  } catch {
    initialImages = [];
  }

  const [formData, setFormData] = useState({
    title: product?.title || "",
    slug: product?.slug || "",
    description: product?.description || "",
    benefits: product?.benefits || "",
    ingredients: product?.ingredients || "",
    categoryId: product?.categoryId || categories[0]?.id || "",
    imageUrl: initialImages[0] || "",
    isActive: product?.isActive ?? true,
  });

  const [variants, setVariants] = useState<any[]>(
    product?.variants && product.variants.length > 0
      ? product.variants
      : [
          {
            title: "500 ml Glass Jar",
            sku: `SG-GHEE-500ML`,
            price: 1199,
            mrp: 1400,
            stockQuantity: 50,
            weightInGrams: 850,
            lengthCm: 12,
            breadthCm: 12,
            heightCm: 16,
          },
        ]
  );

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        title: "1000 ml Glass Jar",
        sku: `SG-GHEE-1000ML-${Date.now().toString().slice(-4)}`,
        price: 2249,
        mrp: 2700,
        stockQuantity: 30,
        weightInGrams: 1600,
        lengthCm: 14,
        breadthCm: 14,
        heightCm: 22,
      },
    ]);
  };

  const removeVariantRow = (index: number) => {
    if (variants.length === 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariantField = (index: number, field: string, value: any) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: product?.id,
      title: formData.title,
      slug:
        formData.slug ||
        formData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-"),
      description: formData.description,
      benefits: formData.benefits,
      ingredients: formData.ingredients,
      categoryId: formData.categoryId,
      images: [formData.imageUrl || "/images/a2-cow-ghee.jpg"],
      isActive: formData.isActive,
      variants,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: product?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Save failed.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 text-stone-500 hover:text-stone-800 bg-white border border-stone-200 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-xs font-semibold text-stone-500">Back to Products</span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h2 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
          1. General Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              URL Slug (auto-generated if empty)
            </label>
            <input
              type="text"
              placeholder="e.g. a2-gir-cow-bilona-ghee"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Primary Image URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Ayurvedic Health Benefits (One per line)
            </label>
            <textarea
              rows={2}
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50"
            />
          </div>
        </div>
      </div>

      {/* Variants Table with Shiprocket Specs */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div>
            <h2 className="font-serif font-bold text-base text-stone-900">
              2. Packaging Variants & Logistics Specs (Shiprocket Ready)
            </h2>
            <p className="text-xs text-stone-500">
              Set dead weights (grams) and package dimensions for accurate courier freight.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariantRow}
            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Variant Size</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Variant Title</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Price (₹)</th>
                <th className="py-2.5 px-3">MRP (₹)</th>
                <th className="py-2.5 px-3">Stock Qty</th>
                <th className="py-2.5 px-3">Weight (Grams)</th>
                <th className="py-2.5 px-3">Box L×B×H (cm)</th>
                <th className="py-2.5 px-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {variants.map((v, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      required
                      value={v.title}
                      onChange={(e) => updateVariantField(idx, "title", e.target.value)}
                      className="w-36 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      required
                      value={v.sku}
                      onChange={(e) => updateVariantField(idx, "sku", e.target.value)}
                      className="w-28 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      required
                      value={v.price}
                      onChange={(e) =>
                        updateVariantField(idx, "price", parseFloat(e.target.value) || 0)
                      }
                      className="w-20 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      required
                      value={v.mrp}
                      onChange={(e) =>
                        updateVariantField(idx, "mrp", parseFloat(e.target.value) || 0)
                      }
                      className="w-20 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      required
                      value={v.stockQuantity}
                      onChange={(e) =>
                        updateVariantField(idx, "stockQuantity", parseInt(e.target.value) || 0)
                      }
                      className="w-20 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      required
                      value={v.weightInGrams}
                      onChange={(e) =>
                        updateVariantField(idx, "weightInGrams", parseInt(e.target.value) || 0)
                      }
                      className="w-20 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex gap-1 items-center">
                      <input
                        type="number"
                        value={v.lengthCm || 15}
                        onChange={(e) =>
                          updateVariantField(idx, "lengthCm", parseFloat(e.target.value) || 0)
                        }
                        className="w-12 text-[11px] p-1 rounded border border-stone-300 font-mono"
                        title="Length cm"
                      />
                      <span>×</span>
                      <input
                        type="number"
                        value={v.breadthCm || 15}
                        onChange={(e) =>
                          updateVariantField(idx, "breadthCm", parseFloat(e.target.value) || 0)
                        }
                        className="w-12 text-[11px] p-1 rounded border border-stone-300 font-mono"
                        title="Breadth cm"
                      />
                      <span>×</span>
                      <input
                        type="number"
                        value={v.heightCm || 15}
                        onChange={(e) =>
                          updateVariantField(idx, "heightCm", parseFloat(e.target.value) || 0)
                        }
                        className="w-12 text-[11px] p-1 rounded border border-stone-300 font-mono"
                        title="Height cm"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeVariantRow(idx)}
                      disabled={variants.length === 1}
                      className="text-stone-400 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:bg-stone-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Product...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Publish Product</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
