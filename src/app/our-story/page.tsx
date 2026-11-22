import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import {
  Sparkles,
  Flame,
  Award,
  ShieldCheck,
  ArrowRight,
  Heart,
  Package,
  Milk,
  Clock,
  Compass,
  CheckCircle2,
  Check,
  Phone,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story • Reviving the Traditions of Old Bharat | Sanvrit A2 Ghee",
  description:
    "Discover the story of Sanvrit Ghee: Reconnecting modern families with the sacred food traditions of Old Bharat. Handcrafted in small batches in Udaipur from the whole curd of free-grazing Gir cows using the authentic Vedic Bilona method.",
  alternates: {
    canonical: "/our-story",
  },
  openGraph: {
    title: "Our Story • Sanvrit A2 Desi Cow Bilona Ghee | Udaipur",
    description:
      "Reviving Old Bharat food traditions. Handcrafted in Udaipur from free-grazing indigenous Gir cow curd.",
    url: "/our-story",
  },
};

const bilonaSteps = [
  {
    step: "01",
    title: "Grass-Fed Gir Cow Milk",
    subtitle: "Ahimsa & Calf-First",
    description:
      "Sourced exclusively from indigenous Gir cows grazing openly on native medicinal pastures around Udaipur. Calves are nurtured first before milk is respectfully collected.",
  },
  {
    step: "02",
    title: "Overnight Curd Fermentation",
    subtitle: "Sacred Dahi Setting",
    description:
      "Unlike factory ghee made from boiled cream, our raw whole milk is slowly boiled in earthen pots and cultured overnight with a live probiotic starter into wholesome curd.",
  },
  {
    step: "03",
    title: "Vedic Bilona Churning",
    subtitle: "Two-Way Wooden Madhani",
    description:
      "Before sunrise (Brahmamuhurta), the fermented curd is churned clockwise and counter-clockwise with a traditional wooden churner (madhani) to separate pure cultured makkhan.",
  },
  {
    step: "04",
    title: "Slow Fire Clarification",
    subtitle: "Gentle Wood Simmering",
    description:
      "The fresh makkhan is slow-simmered over a low wood fire. Patient heating evaporates moisture while preserving delicate fat-soluble vitamins (A, D, E, K2) and butyric acid.",
  },
  {
    step: "05",
    title: "Warm Glass Jar Bottling",
    subtitle: "Airtight & Plastic-Free",
    description:
      "Poured warm through fine muslin cloth into food-grade, airtight glass jars to cool naturally into rich, golden danedaar crystals with zero microplastic leaching.",
  },
];

const pillars = [
  {
    title: "Reviving Old Bharat Wisdom",
    description:
      "Before industrial convenience took over, Indian food was prepared with mindfulness, patience, and reverence for nature. We stay true to ancestral texts like the Charaka Samhita.",
    icon: Compass,
  },
  {
    title: "Calf-First & Native Grazing",
    description:
      "Our Gir cows are never tethered in cramped factory pens or fed chemical yield boosters. They roam freely under the Rajasthan sun and their calves are fed generously first.",
    icon: Heart,
  },
  {
    title: "100% Curd, Never Cream",
    description:
      "Commercial ghee boils industrial leftover cream in minutes. Authentic Bilona starts from fermented curd, yielding rich aroma, easy gut digestion, and natural bio-availability.",
    icon: Milk,
  },
  {
    title: "Food-Grade Glass Packaging",
    description:
      "Warm ghee leaches endocrine disruptors and microplastics when poured into plastic jars or pouches. We bottle exclusively in thick, reusable, inert glass containers.",
    icon: Package,
  },
];

const stats = [
  {
    value: "28 Litres",
    label: "Gir Cow Milk",
    detail: "Required to handcraft just 1 litre of pure Bilona Ghee",
  },
  {
    value: "36+ Hours",
    label: "Patient Craft",
    detail: "From evening boiling and overnight culturing to slow woodfire simmering",
  },
  {
    value: "100%",
    label: "A2 Beta-Casein",
    detail: "Pure indigenous Gir cow protein, naturally gentle on human digestion",
  },
  {
    value: "0%",
    label: "Additives or Palm Oil",
    detail: "Zero vanaspati, preservatives, synthetic colorants, or chemical aromas",
  },
];

export default function OurStoryPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <main className="flex-1 bg-[#FAF6EE]">
        {/* Hero Section - Rosier Foods Editorial Style */}
        <section className="relative py-16 sm:py-24 border-b border-stone-200/80 overflow-hidden">
          <div className="absolute inset-0 bg-radial from-amber-100/30 via-transparent to-transparent opacity-70 pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-[#7C2D12] text-xs font-bold border border-amber-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#7C2D12]" />
                <span className="tracking-wide uppercase">
                  Reviving Old Bharat • Handcrafted in Udaipur
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]">
                We Believe Food Should Not Just Fill Stomachs,{" "}
                <span className="italic font-normal text-[#7C2D12]">
                  It Should Nourish Souls.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-[#7C2D12] font-medium max-w-2xl mx-auto leading-relaxed">
                Reconnecting modern families with the forgotten traditions, authentic aromas, and pure healing nourishment of ancient India.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-stone-600">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>100% Curd-Churned (Bilona)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Single-Origin Gir Cows</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>NABL Tested Purity</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 1: The Awakening / Why We Started */}
        <section className="py-16 sm:py-24 border-b border-stone-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden bg-white border border-stone-200 p-6 sm:p-8 shadow-sm text-center">
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7C2D12] text-white text-[10px] font-bold">
                    <span>Udaipur Dairy Reserve</span>
                  </div>
                  <div className="my-4 relative h-72 sm:h-80 flex items-center justify-center">
                    <Image
                      src="/images/sanvrit-a2-ghee-front.webp"
                      alt="Sanvrit Pure A2 Desi Cow Bilona Ghee in Glass Jar"
                      width={480}
                      height={580}
                      className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                    <span className="font-serif font-bold text-stone-900">
                      Sanvrit A2 Desi Cow Ghee
                    </span>
                    <span className="text-[#7C2D12] font-semibold">100% Glass Packed</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#7C2D12] tracking-widest uppercase block">
                    Chapter 01 • The Lost Standard
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-snug">
                    When Did Real Food Get Replaced with Factory Shortcuts?
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                  Growing up in the historic land of Mewar, pure ghee wasn’t merely a cooking medium—it was a sacred blessing. It was what our grandmothers poured over steaming rotis, fed to new mothers to restore vitality, and used in every Ayurvedic home remedy.
                </p>

                <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                  Over recent decades, commercial food companies turned ghee into an industrial assembly-line product. To cut costs and speed up production, they began boiling factory-separated leftover cream (malai) under harsh temperatures, adulterating with cheaper palm oils, and marketing it in plastic pouches. The divine aroma was lost; the healing medicinal properties were destroyed.
                </p>

                <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-2">
                  <p className="font-serif italic text-sm sm:text-base text-stone-900 leading-relaxed">
                    &quot;Sanvrit was born out of a rebellion against factory shortcuts. We set out to revive the uncompromised authenticity of Old Bharat—where food is made with patience, honesty, and deep respect for the sacred Gir cow.&quot;
                  </p>
                  <p className="text-xs font-bold text-[#7C2D12] pt-1">
                    — The Sanvrit Founders, Udaipur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Numbers of Truth */}
        <section className="py-12 sm:py-16 bg-[#7C2D12] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-amber-900/40">
              {stats.map((stat, idx) => (
                <div key={idx} className={`pt-4 sm:pt-0 ${idx > 0 ? "sm:pl-6" : ""}`}>
                  <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-200">
                    {stat.value}
                  </div>
                  <div className="font-sans font-bold text-sm sm:text-base text-white mt-1">
                    {stat.label}
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-100/80 mt-1.5 leading-relaxed">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter 2: The Sacred 5-Step Bilona Ritual */}
        <section className="py-16 sm:py-24 border-b border-stone-200/80 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold text-[#7C2D12] tracking-widest uppercase block">
                Chapter 02 • The Process
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                The Sacred 5-Step Vedic Bilona Ritual
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                As documented in the ancient Ayurvedic scripture <em>Charaka Samhita</em>, authentic ghee can only be made from whole-milk curd, churned by hand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {bilonaSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-2xl bg-[#FAF6EE] border border-stone-200 p-5 space-y-3 flex flex-col justify-between hover:border-[#7C2D12] transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-bold font-serif text-[#7C2D12] px-2.5 py-1 rounded-full bg-amber-100 inline-block">
                      Step {step.step}
                    </span>
                    <h3 className="font-serif font-bold text-base text-stone-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
                      {step.subtitle}
                    </p>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-amber-100">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Comparison Callout Box */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] border border-stone-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                    Why We Refuse to Boil Cream
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Commercial brands use high-speed centrifuges to strip raw cream from milk and boil it immediately. This skips curd fermentation entirely, stripping out gut-healing butyric acid and digestive enzymes. At Sanvrit, every drop begins as living, probiotic curd.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-1 flex-1">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                      ✓ Sanvrit Vedic Bilona
                    </span>
                    <p className="text-xs text-stone-600">
                      Made from whole Gir cow curd. Easy on lactose-sensitive stomachs, rich in CLA & natural antioxidants.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1 flex-1">
                    <span className="text-[11px] font-bold text-rose-800 uppercase block">
                      ✕ Factory Cream Ghee
                    </span>
                    <p className="text-xs text-stone-600">
                      Industrial cream boiled at high heat. Often leaves a greasy film, heavy digestion, and bitter aftertaste.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 3: Our 4 Pillars of Integrity */}
        <section className="py-16 sm:py-24 border-b border-stone-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold text-[#7C2D12] tracking-widest uppercase block">
                Chapter 03 • Our Commitments
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Pillars of Uncompromising Quality
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Merging the timeless wisdom of Old Bharat with modern food safety testing and sustainable glass packaging.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3 hover:border-amber-400 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-[#7C2D12] flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#7C2D12]" />
                    </div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Chapter 4: Modern Lab Testing & Transparency */}
        <section className="py-16 sm:py-24 bg-white border-b border-stone-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#FAF6EE] border border-stone-200 p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>NABL Certified Lab Testing & FSSAI Compliant</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    Transparency You Can Verify in Every Spoon
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Faith is good, but verifiable proof is better. Every production batch of Sanvrit Ghee is tested at certified NABL laboratories for Reichert-Meissl (RM) purity, absence of mineral/palm oils, and verified A2 beta-casein status.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-800 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" /> FSSAI Lic. No. 22225088000714
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" /> Baudouin Test (Vanaspati): Negative
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" /> 100% Gir Cow Genetic Authenticity
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 text-center sm:text-right">
                  <Link
                    href="/lab-reports"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#7C2D12] text-white text-xs sm:text-sm font-bold hover:bg-[#60230e] transition-colors shadow-xs"
                  >
                    <span>View Lab Reports</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders' Promise Letter */}
        <section className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-6 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-100/70 text-[#7C2D12] flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7 text-[#7C2D12]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#7C2D12] tracking-widest uppercase">
                  A Letter from Our Founders
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  From Our Dairy in Udaipur to Your Family Table
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed text-justify sm:text-center">
                When you open a jar of Sanvrit Ghee, the first thing that greets you is the unmistakable nutty aroma of slow woodfire simmering and the golden, crystalline texture of hand-churned makkhan. We don’t run a nameless corporate conglomerate. We are a family of passionate food purists dedicated to preserving the healing agricultural legacy of Rajasthan. We take pride in knowing that the ghee we send to your kitchen is the very same ghee our own children eat every morning.
              </p>

              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
                <div className="text-left">
                  <div className="font-serif font-bold text-sm text-stone-900">
                    The Sanvrit Family
                  </div>
                  <div>Udaipur, Rajasthan • Dharmasya Food Products Pvt. Ltd.</div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/918690054729?text=Hi%20Sanvrit%20Ghee%2C%20I%20read%20your%20story%20and%20would%20love%20to%20connect."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Chat on WhatsApp: +91 86900 54729</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Climax CTA Section - Warm Rosier Foods Closing */}
        <section className="py-16 sm:py-20 bg-[#7C2D12] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/20 text-amber-200 text-xs font-bold border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Taste Authentic Old Bharat Purity</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Bring Vedic Purity to Your Kitchen Today
            </h2>

            <p className="text-sm sm:text-base text-amber-100/90 max-w-xl mx-auto leading-relaxed">
              Available in 1 Litre Food-Grade Glass Jars and 5 Litre Family Containers. Shipped fresh with safe, shatter-proof all-India delivery.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#7C2D12] font-bold text-sm rounded-full hover:bg-amber-50 transition-colors shadow-md"
              >
                <span>Shop Sanvrit A2 Ghee</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/918690054729?text=Hi%20Sanvrit%20Ghee%2C%20I%20want%20to%20know%20more%20about%20ordering%20your%20A2%20Ghee."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-full transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Quick Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
