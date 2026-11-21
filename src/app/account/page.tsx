import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AccountView } from "./AccountView";

export const metadata = {
  title: "My Orders & Profile | Sanvrit Ghee",
  description: "View your past orders, delivery tracking, and saved delivery address.",
};

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="flex-1 py-12 sm:py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AccountView />
        </div>
      </main>
      <Footer />
    </>
  );
}
