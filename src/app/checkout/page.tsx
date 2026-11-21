import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckoutForm } from "./CheckoutForm";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata = {
  title: "Secure Checkout | Sanvrit Ghee",
  description: "Fast, secure guest checkout for your pure Desi Ghee order.",
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="flex-1 py-10 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h1 className="font-serif text-3xl font-bold text-stone-900">
              Complete Your Order
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Frictionless Guest Checkout • No Account Password Required
            </p>
          </div>

          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
