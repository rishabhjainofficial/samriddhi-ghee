import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import {
  ShieldCheck,
  Award,
  FileCheck2,
  CheckCircle2,
  Download,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Lab Reports & Purity Certifications | Sanvrit A2 Ghee",
  description:
    "View our NABL-accredited laboratory test reports, FSSAI compliance, A2 beta-casein verification, and purity standards. 100% pure Bilona Ghee from Udaipur.",
  alternates: {
    canonical: "/lab-reports",
  },
};

export default function LabReportsPage() {
  const testParameters = [
    {
      test: "A2 Beta-Casein Protein Verification",
      result: "100% Pure A2 Gir Cow Beta-Casein",
      standard: "Positive for A2, 0% A1 Detected",
      status: "PASS",
    },
    {
      test: "Reichert-Meissl (RM) Value",
      result: "29.2",
      standard: "Min. 28.0 (FSSAI Pure Cow Ghee)",
      status: "PASS",
    },
    {
      test: "Moisture Content",
      result: "0.14%",
      standard: "Max. 0.30%",
      status: "PASS",
    },
    {
      test: "Free Fatty Acids (as Oleic Acid)",
      result: "0.45%",
      standard: "Max. 1.40%",
      status: "PASS",
    },
    {
      test: "Baudouin Test (Adulteration with Vanaspati)",
      result: "Negative",
      standard: "Must be Negative",
      status: "PASS",
    },
    {
      test: "Palm Oil & Foreign Vegetable Fats",
      result: "Absent / Negative",
      standard: "Must be Absent",
      status: "PASS",
    },
    {
      test: "Synthetic Colours & Chemical Flavours",
      result: "Absent / Nil",
      standard: "Zero Permitted",
      status: "PASS",
    },
    {
      test: "Heavy Metal Residues (Lead, Cadmium)",
      result: "Below Detection Limits (<0.01 mg/kg)",
      standard: "FSSAI Safety Threshold",
      status: "PASS",
    },
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <main className="flex-1 py-12 sm:py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Verified Lab Tested Purity</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Lab Reports & Certifications
            </h1>
            <p className="text-sm font-medium text-amber-800 mt-2">
              Every batch tested by certified NABL food laboratories for absolute peace of mind.
            </p>
            <p className="text-xs text-stone-600 mt-2">
              FSSAI Lic. No. 22225088000714 • Dharmasya Food Products Pvt. Ltd., Udaipur, Rajasthan
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  A2 Beta-Casein Tested
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Certified pure A2 genetics from free-grazing indigenous Gir cows. 0% harmful A1 proteins.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Zero Adulteration
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Strictly negative for palm oil, vanaspati, starch, mineral oil, or synthetic preservatives.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  FSSAI Compliant
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Processed in accordance with traditional Ayurvedic safety & regulatory quality standards.
                </p>
              </div>
            </div>
          </div>

          {/* Test Parameters Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden mb-12">
            <div className="p-6 sm:p-8 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
                  Comprehensive Analytical Profile
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Latest Batch Testing Certificate Summary
                </h2>
              </div>
              <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>All Tests Cleared</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Quality Parameter / Test</th>
                    <th className="py-3.5 px-6">Observed Result</th>
                    <th className="py-3.5 px-6">FSSAI / Safety Standard</th>
                    <th className="py-3.5 px-6 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600">
                  {testParameters.map((param, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-stone-900">
                        {param.test}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-stone-800">
                        {param.result}
                      </td>
                      <td className="py-3.5 px-6 text-stone-500">
                        {param.standard}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {param.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-cream/50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
              <div>
                <span className="font-bold text-stone-900">Testing Facility:</span> Certified NABL Food Testing Laboratory, Udaipur, RJ.
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Tested on fresh whole milk curd bilona batch</span>
              </div>
            </div>
          </div>

          {/* CTA to Shop */}
          <div className="text-center p-8 rounded-3xl bg-amber-600 text-white shadow-md max-w-2xl mx-auto space-y-4">
            <h3 className="font-serif text-2xl font-bold">
              Taste 100% Certified Pure Ghee Today
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-lg mx-auto leading-relaxed">
              Dispatched fresh in food-grade glass jars straight from our Udaipur dairy to your home.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-stone-900 font-bold text-xs sm:text-sm rounded-full hover:bg-stone-100 transition-colors shadow-sm"
              >
                <span>Shop Pure Ghee (1L & 5L)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
