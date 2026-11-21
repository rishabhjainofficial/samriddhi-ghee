"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

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
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3"
          : "bg-cream py-4 border-b border-stone-200/40"
      }`}
    >
      {/* Top micro-bar */}
      <div className="bg-amber-600 text-white text-xs font-medium py-1 px-4 text-center">
        <span>✨ 100% Traditional Vedic Bilona Churned Pure Desi Ghee | Direct from Farm</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mt-2">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/logo.png"
            alt="Sanvrit - Taste of Purity"
            width={160}
            height={52}
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-amber-600 transition-colors">
            Our Ghee
          </Link>
          <Link href="/#bilona-process" className="hover:text-amber-600 transition-colors">
            Bilona Method
          </Link>
          <Link href="/account" className="hover:text-amber-600 transition-colors">
            My Orders
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-full border border-stone-300 hover:border-stone-400 transition-colors"
          >
            My Orders
          </Link>

          <button
            onClick={openCart}
            aria-label="View Shopping Cart"
            className="relative p-2.5 rounded-full bg-stone-900 text-white hover:bg-amber-600 transition-colors flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-stone-200 px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-800 font-medium py-2 hover:text-amber-600"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-800 font-medium py-2 hover:text-amber-600"
          >
            Our Ghee Range
          </Link>
          <Link
            href="/#bilona-process"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-800 font-medium py-2 hover:text-amber-600"
          >
            Vedic Bilona Process
          </Link>
          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-800 font-medium py-2 hover:text-amber-600"
          >
            My Orders & Profile
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-800 font-medium py-2 hover:text-amber-600"
          >
            Track Order Status
          </Link>
        </div>
      )}
    </header>
  );
}
