import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PaymentSimulator } from "./PaymentSimulator";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      shippingAddress: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 bg-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <PaymentSimulator order={order} />
        </div>
      </main>
      <Footer />
    </>
  );
}
