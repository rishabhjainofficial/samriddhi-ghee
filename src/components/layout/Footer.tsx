import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Heart, Phone, Mail, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="inline-block bg-stone-950/80 border border-stone-800 p-2.5 rounded-2xl shadow-sm">
              <Image
                src="/images/logo.webp"
                alt="Sanvrit Ghee - Taste of Purity"
                width={150}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Sanvrit Traditional Vedic Bilona Desi Ghee prepared in small artisanal batches from free-grazing cows. Preserving ancient ayurvedic vitality with authentic taste of purity in every drop.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <Award className="w-4 h-4" />
              <span>100% Lab Certified Pure Cultured Ghee</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Shop & Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products/sanvrit-a2-desi-cow-ghee" className="hover:text-amber-400 transition-colors">
                  Sanvrit A2 Desi Cow Ghee (1L & 5L)
                </Link>
              </li>
              <li>
                <Link href="/#bilona-process" className="hover:text-amber-400 transition-colors">
                  The Vedic Bilona Method
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-amber-400 transition-colors">
                  Track Your Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Quality */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Our Purity Promise
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero palm oil, starch or chemicals</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Slow-cooked in traditional brass cauldrons</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thick danedaar (granular) texture</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Safe glass jar transit packaging</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Location */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Contact & Dairy Hub
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="text-xs leading-relaxed text-stone-400">
                <span className="text-white font-semibold block">Dharmasya Food Products Pvt. Ltd.</span>
                <span>128-129, S.M. Lodha Complex, Near Shastri Circle,</span>
                <span className="block">Girwa, Udaipur, Rajasthan – 313001</span>
                <span className="text-stone-500 block mt-0.5">Dairy Unit: Hiran Magri, Udaipur – 313002</span>
              </div>
              <div className="pt-1 flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@sanvritghee.com</span>
              </div>
              <div className="text-[11px] text-amber-400/90 pt-1">
                <span>FSSAI Lic. No. 22225088000714</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Sanvrit Dairy Products • Dharmasya Food Products Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-stone-400">FSSAI Lic: 22225088000714</span>
            <span className="text-stone-600">•</span>
            <Link href="/track" className="hover:text-stone-300 transition-colors">
              Delivery & Tracking
            </Link>
            <span className="text-stone-600">•</span>
            <Link href="/admin/login" className="hover:text-stone-300 transition-colors">
              Admin Portal
            </Link>
            <span className="text-stone-600">•</span>
            <span>Made with Purity in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
