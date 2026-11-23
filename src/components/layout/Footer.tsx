"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Sparkles,
  Package,
  Milk,
  CheckCircle2,
  ArrowRight,
  Lock,
  Heart,
  Flame,
} from "lucide-react";

interface IconProps {
  readonly className?: string;
}

function InstagramIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailOrPhone.trim()) {
      setSubscribed(true);
      setEmailOrPhone("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="mt-auto">
      {/* 1. Top Value Trust Strip - Warm Cream Background with Terracotta Accents */}
      <div className="bg-[#FAF6EE] border-t-2 border-b border-[#7C2D12]/20 py-10 sm:py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#7C2D12]">
              The Sanvrit Standard of Purity
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Why Families Trust Sanvrit Ghee
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Single Origin */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4 hover:border-[#7C2D12] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#7C2D12] flex items-center justify-center shrink-0 shadow-xs">
                <Milk className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Single-Origin Gir Cows
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Sourced from free-grazing native cows in the Aravali foothills around Udaipur.
                </p>
              </div>
            </div>

            {/* Card 2: Vedic Bilona */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4 hover:border-[#7C2D12] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#7C2D12] flex items-center justify-center shrink-0 shadow-xs">
                <Flame className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Vedic Bilona Method
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Cultured overnight into curd, two-way churned with wooden madhani. Never boiled cream.
                </p>
              </div>
            </div>

            {/* Card 3: Glass Packaging */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4 hover:border-[#7C2D12] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#7C2D12] flex items-center justify-center shrink-0 shadow-xs">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Food-Grade Glass Jars
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Poured warm, sealed airtight. Zero microplastics, BPA, or harmful chemical leaching.
                </p>
              </div>
            </div>

            {/* Card 4: NABL Lab Tested */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4 hover:border-emerald-600 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-stone-900">
                  NABL Tested Purity
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  RM value &gt;28. Zero palm oil or vanaspati. Verified FSSAI Lic. 22225088000714.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Heritage Footer - Deep Rich Terracotta Brown with Connected Mountain Artwork */}
      <div className="relative bg-[#260E06] text-stone-300 pt-16 pb-12 overflow-hidden">
        {/* Continuous Connected Aravali Mountain Range Artwork Spanning 100% Width */}
        <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 lg:h-96 pointer-events-none overflow-hidden opacity-35 select-none">
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
          >
            <defs>
              <linearGradient id="farHillsFooter" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#260E06" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="midHillsFooter" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9A3412" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1A0601" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="foreHillsFooter" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7C2D12" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#140400" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* 1. Continuous Connected Far Aravali Mountain Peaks */}
            <path
              d="M 0 120 C 60 100, 120 70, 180 85 C 240 100, 300 135, 360 125 C 420 115, 480 60, 540 70 C 600 80, 660 125, 720 115 C 780 105, 840 50, 900 65 C 960 80, 1020 130, 1080 120 C 1140 110, 1200 65, 1260 75 C 1320 85, 1380 140, 1440 120 L 1440 320 L 0 320 Z"
              fill="url(#farHillsFooter)"
            />

            {/* 2. Continuous Connected Middle Mountain Foothills */}
            <path
              d="M 0 160 C 80 140, 140 110, 220 125 C 300 140, 360 180, 440 170 C 520 160, 580 115, 660 130 C 740 145, 800 185, 880 175 C 960 165, 1020 120, 1100 135 C 1180 150, 1240 190, 1320 180 C 1370 170, 1410 175, 1440 160 L 1440 320 L 0 320 Z"
              fill="url(#midHillsFooter)"
            />

            {/* Gentle Warm Sun behind center peaks */}
            <circle cx="720" cy="115" r="50" fill="#F59E0B" fillOpacity="0.16" />
            <circle cx="720" cy="115" r="85" fill="#F59E0B" fillOpacity="0.08" />

            {/* Rajasthani Heritage Chhatri atop central ridge */}
            <g transform="translate(702, 88) scale(0.6)" fill="#F59E0B" fillOpacity="0.35">
              <path d="M30 35 Q30 12 50 8 Q70 12 70 35 Z" />
              <rect x="34" y="35" width="3" height="24" />
              <rect x="49" y="35" width="3" height="24" />
              <rect x="63" y="35" width="3" height="24" />
              <rect x="25" y="59" width="50" height="3" />
            </g>

            {/* 3. Continuous Connected Foreground Rolling Hills & Pasture */}
            <path
              d="M 0 205 C 90 190, 160 170, 250 185 C 340 200, 410 230, 500 220 C 590 210, 660 180, 750 190 C 840 200, 910 235, 1000 225 C 1090 215, 1160 180, 1250 195 C 1320 210, 1380 220, 1440 205 L 1440 320 L 0 320 Z"
              fill="url(#foreHillsFooter)"
            />

            {/* Left Gir Cow grazing naturally on ridge */}
            <g transform="translate(280, 155) scale(0.65)" fill="#F59E0B" fillOpacity="0.38">
              <ellipse cx="60" cy="45" rx="35" ry="22" />
              <path d="M42 25 Q52 8 64 24 Z" />
              <path d="M25 45 Q15 40 10 50 Q5 65 18 68 Q25 68 32 55 Z" />
              <path d="M16 42 Q10 32 18 28 Q24 35 22 42 Z" />
              <rect x="32" y="60" width="5" height="28" />
              <rect x="42" y="60" width="5" height="26" />
              <rect x="75" y="60" width="5" height="28" />
              <rect x="85" y="60" width="5" height="26" />
              <path d="M95 42 Q102 55 98 70" stroke="#F59E0B" strokeOpacity="0.38" strokeWidth="2.5" fill="none" />
            </g>

            {/* Center-Right Cow with her Calf grazing peacefully together */}
            <g transform="translate(880, 155) scale(0.68)" fill="#F59E0B" fillOpacity="0.4">
              <ellipse cx="60" cy="45" rx="35" ry="22" />
              <path d="M42 25 Q52 8 64 24 Z" />
              <path d="M25 45 Q15 40 10 50 Q5 65 18 68 Q25 68 32 55 Z" />
              <path d="M16 42 Q10 32 18 28 Q24 35 22 42 Z" />
              <rect x="32" y="60" width="5" height="28" />
              <rect x="42" y="60" width="5" height="26" />
              <rect x="75" y="60" width="5" height="28" />
              <rect x="85" y="60" width="5" height="26" />
              <path d="M95 42 Q102 55 98 70" stroke="#F59E0B" strokeOpacity="0.4" strokeWidth="2.5" fill="none" />
              <g transform="translate(100, 20) scale(0.55)">
                <ellipse cx="40" cy="35" rx="20" ry="14" />
                <path d="M30 22 Q36 12 44 22 Z" />
                <path d="M18 35 Q10 30 8 38 Q5 48 14 50 Q20 50 24 42 Z" />
                <rect x="22" y="45" width="3.5" height="18" />
                <rect x="28" y="45" width="3.5" height="16" />
                <rect x="48" y="45" width="3.5" height="18" />
                <rect x="54" y="45" width="3.5" height="16" />
              </g>
            </g>

            {/* Native Trees rooted seamlessly into the landscape */}
            <g transform="translate(130, 130) scale(0.65)" fill="#F59E0B" fillOpacity="0.28">
              <path d="M50 140 Q45 85 35 45 Q55 55 70 140 Z" />
              <circle cx="35" cy="40" r="32" />
              <circle cx="65" cy="30" r="38" />
              <circle cx="90" cy="45" r="28" />
              <circle cx="50" cy="15" r="30" />
            </g>

            <g transform="translate(1180, 125) scale(0.7)" fill="#F59E0B" fillOpacity="0.3">
              <path d="M50 140 Q45 85 35 45 Q55 55 70 140 Z" />
              <circle cx="35" cy="40" r="34" />
              <circle cx="65" cy="30" r="40" />
              <circle cx="95" cy="48" r="30" />
              <circle cx="55" cy="15" r="32" />
            </g>

            <rect x="0" y="270" width="1440" height="50" fill="#140400" fillOpacity="0.95" />
          </svg>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-radial from-amber-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Newsletter / VIP Club Box with Rosier Foods Appeal */}
          <div className="rounded-3xl bg-[#34150A]/90 border border-amber-800/40 p-6 sm:p-10 shadow-lg backdrop-blur-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 text-xs font-bold border border-amber-700/40">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Sanvrit Circle of Purity</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Connect with the Sacred Foods of Old Bharat
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed max-w-xl">
                  Sign up for Ayurvedic morning rituals, healthy recipes, and first priority access when fresh small-batch ghee is clarified in Udaipur.
                </p>
              </div>

              <div className="lg:col-span-5">
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="Enter WhatsApp number or email"
                      suppressHydrationWarning
                      className="flex-1 px-4 py-3.5 rounded-2xl bg-[#1F0A03] border border-amber-800/60 text-white placeholder-stone-400 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-[#260E06] font-bold text-xs sm:text-sm transition-all shrink-0 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Join Family</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {subscribed && (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Welcome! We are honored to have you with us.</span>
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* 4 Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-amber-900/40">
            {/* Col 1: Brand, Heritage & Socials */}
            <div className="lg:col-span-4 space-y-4">
              <div className="inline-block bg-[#FAF6EE] p-3 rounded-2xl shadow-sm border border-amber-300/40">
                <Image
                  src="/images/logo.webp"
                  alt="Sanvrit A2 Desi Cow Ghee"
                  width={150}
                  height={50}
                  className="h-10 w-auto object-contain"
                />
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Handcrafted in small artisanal batches in Udaipur, Rajasthan from the whole milk curd of free-grazing indigenous Gir cows. Reviving the ancient Vedic Bilona method with absolute purity.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-700/50 text-xs text-amber-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Udaipur Single-Origin Dairy Reserve</span>
              </div>

              {/* Social Channels */}
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-200/80 block mb-2.5">
                  Follow Our Journey:
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Sanvrit Ghee on Instagram"
                    className="w-10 h-10 rounded-2xl bg-[#3A170A] hover:bg-[#E1306C] text-amber-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-amber-700/50 hover:scale-105 cursor-pointer"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>

                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe to Sanvrit Ghee on YouTube"
                    className="w-10 h-10 rounded-2xl bg-[#3A170A] hover:bg-[#FF0000] text-amber-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-amber-700/50 hover:scale-105 cursor-pointer"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                  </a>

                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Sanvrit Ghee on Facebook"
                    className="w-10 h-10 rounded-2xl bg-[#3A170A] hover:bg-[#1877F2] text-amber-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-amber-700/50 hover:scale-105 cursor-pointer"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="lg:col-span-2">
              <h4 className="text-white text-xs sm:text-sm font-serif font-bold tracking-wide uppercase mb-4 border-b border-amber-800/40 pb-2">
                Explore & Shop
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
                <li>
                  <Link href="/products" className="hover:text-amber-300 transition-colors">
                    Shop A2 Ghee (1L & 5L)
                  </Link>
                </li>
                <li>
                  <Link href="/our-story" className="hover:text-amber-300 transition-colors">
                    Our Story (Udaipur Dairy)
                  </Link>
                </li>
                <li>
                  <Link href="/lab-reports" className="hover:text-amber-300 transition-colors">
                    Lab Reports & Testing
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-amber-300 transition-colors">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="hover:text-amber-300 transition-colors">
                    Track Your Delivery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: The Sanvrit Standard */}
            <div className="lg:col-span-3">
              <h4 className="text-white text-xs sm:text-sm font-serif font-bold tracking-wide uppercase mb-4 border-b border-amber-800/40 pb-2">
                Our Purity Promise
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Curd-Churned (Bilona Method)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>A2 Beta-Casein Indigenous Gir Cows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Calf-First & Free-Range Grazing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Slow Woodfire Brass Simmering</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Food-Grade Airtight Glass Jars</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero Palm Oil, Starch or Chemicals</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact, Dairy Hub & FSSAI */}
            <div className="lg:col-span-3 space-y-3.5">
              <h4 className="text-white text-xs sm:text-sm font-serif font-bold tracking-wide uppercase mb-4 border-b border-amber-800/40 pb-2">
                Contact & Dairy Hub
              </h4>

              <div className="text-xs leading-relaxed text-stone-300 space-y-1">
                <span className="text-white font-bold block">Dharmasya Food Products Pvt. Ltd.</span>
                <span>128-129, S.M. Lodha Complex, Near Shastri Circle,</span>
                <span className="block">Girwa, Udaipur, Rajasthan – 313001</span>
                <span className="text-amber-200/70 block pt-0.5">Dairy Unit: Hiran Magri, Udaipur – 313002</span>
              </div>

              <div className="pt-2 space-y-2 text-xs">
                <a
                  href="https://wa.me/918690054729?text=Hi%20Sanvrit%20Ghee%2C%20I%20have%20a%20query%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors font-medium cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>+91 86900 54729 (WhatsApp Support)</span>
                </a>

                <div className="flex items-center gap-2 text-stone-300">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>support@sanvritghee.com</span>
                </div>
              </div>

              {/* FSSAI Badge */}
              <div className="pt-2">
                <div className="p-3.5 rounded-2xl bg-[#34150A] border border-amber-700/50 flex items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                      Food Safety Certified
                    </span>
                    <span className="text-xs font-mono font-bold text-white block">
                      FSSAI Lic: 22225088000714
                    </span>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-[10px] font-bold text-emerald-300 border border-emerald-700/50">
                    Govt. Verified
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Trust & Security Strip */}
          <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-900/40">
            <div className="flex items-center gap-2 text-xs text-amber-100/80">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Encrypted &amp; Secure Bank Checkout</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-amber-100/90">
              <span className="px-2.5 py-1 rounded-lg bg-[#34150A] border border-amber-800/40">
                UPI / GPay / PhonePe
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#34150A] border border-amber-800/40">
                Paytm
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#34150A] border border-amber-800/40">
                Visa / Mastercard
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#34150A] border border-amber-800/40">
                RuPay
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#34150A] border border-amber-800/40">
                Net Banking
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Cash on Delivery Available
              </span>
            </div>
          </div>

          {/* Copyright & Bottom Info */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
            <p>
              © {new Date().getFullYear()} Sanvrit Dairy Products • Dharmasya Food Products Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link href="/lab-reports" className="hover:text-amber-200 transition-colors">
                NABL Reports
              </Link>
              <span>•</span>
              <Link href="/track" className="hover:text-amber-200 transition-colors">
                Delivery &amp; Tracking
              </Link>
              <span>•</span>
              <Link href="/admin/login" className="hover:text-amber-200 transition-colors">
                Admin Portal
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300">
                <span>Handcrafted with</span>
                <Heart className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>in Udaipur, Rajasthan</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
