"use client";

import { useState } from "react";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to update store settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully! Checkout calculations updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Optional Taxes (GST) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div>
            <h2 className="font-serif font-bold text-base text-stone-900">
              1. Tax (GST) Configuration
            </h2>
            <p className="text-xs text-stone-500">
              Control whether GST charges should be calculated and displayed to customers.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings["enableTax"] === "true"}
              onChange={(e) =>
                handleChange("enableTax", e.target.checked ? "true" : "false")
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        {settings["enableTax"] === "true" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Applicable Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings["taxRate"] || "0"}
                onChange={(e) => handleChange("taxRate", e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Standard Dairy/Ghee GST is 5% or 12% in India.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Optional Shipping Charges */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div>
            <h2 className="font-serif font-bold text-base text-stone-900">
              2. Shipping Charges & Free Delivery Threshold
            </h2>
            <p className="text-xs text-stone-500">
              When disabled, all orders enjoy 100% Free Shipping anywhere in India.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings["enableShippingFee"] === "true"}
              onChange={(e) =>
                handleChange("enableShippingFee", e.target.checked ? "true" : "false")
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        {settings["enableShippingFee"] === "true" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Flat Shipping Rate (₹)
              </label>
              <input
                type="number"
                value={settings["flatShippingRate"] || "70"}
                onChange={(e) => handleChange("flatShippingRate", e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Free Delivery Above Cart Total (₹)
              </label>
              <input
                type="number"
                value={settings["freeShippingThreshold"] || "999"}
                onChange={(e) => handleChange("freeShippingThreshold", e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Support & Contact */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h2 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
          3. Store Contact & WhatsApp Support
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              WhatsApp Support Mobile
            </label>
            <input
              type="text"
              value={settings["supportPhone"] || ""}
              onChange={(e) => handleChange("supportPhone", e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Customer Support Email
            </label>
            <input
              type="email"
              value={settings["supportEmail"] || ""}
              onChange={(e) => handleChange("supportEmail", e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:bg-stone-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Store Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
