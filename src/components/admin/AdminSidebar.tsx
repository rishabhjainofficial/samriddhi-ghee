"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  CreditCard,
  Truck,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Order Master", href: "/admin/orders", icon: ShoppingBag },
  { label: "Product Master", href: "/admin/products", icon: Package },
  { label: "Payment Master", href: "/admin/payments", icon: CreditCard },
  { label: "Shipping Master", href: "/admin/shipping", icon: Truck },
  { label: "Store Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden bg-stone-900 text-stone-200 border-b border-stone-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-stone-700/60 p-0.5 flex items-center justify-center shrink-0">
            <Image
              src="/images/logo-icon.webp"
              alt="Sanvrit"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-white text-sm block leading-tight">
              Sanvrit Admin
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle admin navigation"
          className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-stone-900 text-stone-300 border-b border-stone-800 px-4 py-3 space-y-1 z-30">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-stone-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-stone-800 mt-2 flex items-center justify-between">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white py-2 px-2"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 py-2 px-2 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-stone-900 text-stone-300 flex-col shrink-0 border-r border-stone-800 min-h-screen">
        {/* Brand Header */}
        <div className="p-5 border-b border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-stone-700/60 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
            <Image
              src="/images/logo-icon.webp"
              alt="Sanvrit"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-white text-base block leading-tight">
              Sanvrit Ghee
            </span>
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
              Admin Console
            </span>
          </div>
        </div>

        {/* Nav Menu */}
        <nav className="p-4 space-y-1.5 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-stone-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
