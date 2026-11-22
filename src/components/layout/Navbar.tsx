"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  Instagram,
  Youtube,
  Facebook,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { AnnouncementBar } from "./AnnouncementBar";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      {/* Top Animated Moving Announcement Marquee */}
      <AnnouncementBar />

      {/* Main Navbar Bar with Generous Breathing Space */}
      <div
        className={`transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#FAF6EE]/95 backdrop-blur-md shadow-sm border-stone-200/80 py-3 sm:py-3.5"
            : "bg-[#FAF6EE] py-4 sm:py-5 border-stone-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo - Crisp & Prominent */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Image
              src="/images/logo.webp"
              alt="Sanvrit - Taste of Purity"
              width={180}
              height={58}
              className="h-10 sm:h-12 lg:h-13 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation - Spacious & Refined */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[13.5px] lg:text-sm font-semibold text-stone-800">
            <Link
              href="/"
              className="relative py-1 hover:text-[#7C2D12] transition-colors group"
            >
              <span>Home</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7C2D12] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>

            <Link
              href="/products"
              className="relative py-1 hover:text-[#7C2D12] transition-colors group flex items-center gap-1.5"
            >
              <span>Shop</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7C2D12] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>

            <Link
              href="/lab-reports"
              className="relative py-1 hover:text-[#7C2D12] transition-colors group flex items-center gap-1.5"
            >
              <span>Lab Reports</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Pure
              </span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7C2D12] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>

            <Link
              href="/account"
              className="relative py-1 hover:text-[#7C2D12] transition-colors group"
            >
              <span>My Order</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7C2D12] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>

            <Link
              href="/our-story"
              className="relative py-1 hover:text-[#7C2D12] transition-colors group"
            >
              <span>Our Story</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7C2D12] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>
          </nav>

          {/* Right Actions: Socials + My Order Pill + Cart Button */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Social Media Circular Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 pr-3 border-r border-stone-200/90">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/90 border border-stone-200/80 text-stone-600 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-600 hover:border-transparent flex items-center justify-center shadow-2xs hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/90 border border-stone-200/80 text-stone-600 hover:text-white hover:bg-[#FF0000] hover:border-transparent flex items-center justify-center shadow-2xs hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/90 border border-stone-200/80 text-stone-600 hover:text-white hover:bg-[#1877F2] hover:border-transparent flex items-center justify-center shadow-2xs hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick My Order Action */}
            <Link
              href="/account"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#7C2D12] px-3.5 py-2 rounded-full bg-white border border-stone-200/90 hover:border-[#7C2D12] shadow-2xs transition-all duration-200 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-amber-700" />
              <span>My Order</span>
            </Link>

            {/* Premium Shopping Cart Pill */}
            <button
              onClick={openCart}
              aria-label="View Shopping Cart"
              className="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#7C2D12] text-white hover:bg-[#60230e] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <ShoppingBag className="w-4 h-4 text-amber-200 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline text-xs font-bold tracking-wide">
                Cart
              </span>
              {mounted && totalItems > 0 ? (
                <span className="bg-amber-400 text-stone-950 font-extrabold text-[11px] px-1.5 py-0.2 min-w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              ) : (
                <span className="bg-white/20 text-white font-medium text-[10px] px-1.5 py-0.2 rounded-full">
                  0
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:border-stone-400 transition-all cursor-pointer shadow-2xs"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6EE] border-b border-stone-200 px-5 pt-4 pb-6 space-y-3.5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-stone-800 font-semibold py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#7C2D12] transition-colors"
          >
            <span>Home</span>
          </Link>

          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-stone-800 font-semibold py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#7C2D12] transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>Shop A2 Ghee</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            </span>
            <span className="text-xs text-amber-700 font-bold">1L & 5L</span>
          </Link>

          <Link
            href="/lab-reports"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-stone-800 font-semibold py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#7C2D12] transition-colors"
          >
            <span>Lab Reports</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              NABL Verified
            </span>
          </Link>

          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-stone-800 font-semibold py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#7C2D12] transition-colors"
          >
            <span>My Order</span>
            <Package className="w-4 h-4 text-stone-400" />
          </Link>

          <Link
            href="/our-story"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-stone-800 font-semibold py-2.5 px-3 rounded-xl hover:bg-white hover:text-[#7C2D12] transition-colors"
          >
            <span>Our Story</span>
          </Link>

          {/* Mobile Social Links & WhatsApp Support */}
          <div className="pt-4 border-t border-stone-200/90 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Follow Sanvrit:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-[#E1306C] flex items-center justify-center shadow-2xs"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-[#FF0000] flex items-center justify-center shadow-2xs"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-[#1877F2] flex items-center justify-center shadow-2xs"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <a
              href="https://wa.me/918690054729?text=Hi%20Sanvrit%20Ghee%2C%20I%20have%20a%20question%20about%20ordering."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>Chat with Dairy Team (+91 86900 54729)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
