import { prisma } from "@/lib/prisma";
import { CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const transactions = await prisma.paymentTransaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: { shippingAddress: true },
      },
    },
  });

  const totalCollected = transactions
    .filter((t) => t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Payment Detail Master
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Complete transaction ledger for all payment attempts, gateways, and reconciliation.
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-amber-600" />
          <div>
            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
              Total Captured
            </span>
            <span className="font-serif text-lg font-bold text-stone-900">
              ₹{totalCollected.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Gateway</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {txn.gatewayPaymentId || txn.id.slice(0, 12)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                      {txn.order?.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{txn.order?.customerName}</div>
                      <div className="text-[11px] text-stone-500">{txn.order?.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-600">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px]">
                        {txn.gatewayProvider}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{txn.method}</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                      ₹{txn.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          txn.status === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {txn.status === "SUCCESS" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{txn.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-500">
                      {new Date(txn.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
