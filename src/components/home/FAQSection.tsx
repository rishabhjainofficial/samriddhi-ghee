"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is A2 Desi Cow Ghee and how is it different from normal ghee?",
    answer:
      "A2 Ghee is made exclusively from the whole milk of indigenous Indian cow breeds like Gir cows. Unlike commercial ghee sourced from mixed Jersey/HF crossbred cows containing A1 beta-casein, Sanvrit Ghee contains 100% pure A2 beta-casein protein which is gentle on the stomach, promotes healthy gut digestion, and supports natural immunity.",
  },
  {
    question: "What does the 'Bilona Method' mean?",
    answer:
      "Bilona refers to the ancient Vedic method of hand-churning. Commercial brands take a factory shortcut by boiling separated industrial cream (malai) directly. In the authentic Bilona method, whole milk is first cultured overnight into probiotic-rich curd, churned bi-directionally with a traditional wooden madhani before sunrise to separate pure cultured butter (makkhan), and then slowly clarified on a gentle flame into golden danedaar ghee.",
  },
  {
    question: "Why is Sanvrit Ghee made from curd instead of cream or malai?",
    answer:
      "Setting whole milk into curd first (Dahi-churned) is the sacred Ayurvedic standard from Charaka Samhita. Curd fermentation cultivates essential bio-active nutrients, including beneficial butyric acid and conjugated linoleic acid (CLA), while creating that authentic granular (danedaar) texture and rich nutty aroma without acidic burning or bitterness.",
  },
  {
    question: "Why does authentic A2 Gir Cow Bilona Ghee cost more than regular market ghee?",
    answer:
      "Commercial ghee made from factory cream requires only 10-12 litres of milk with industrial machinery. In contrast, authentic Vedic Bilona ghee requires approximately 25 to 28 litres of whole Gir cow milk to produce just 1 litre of pure ghee. Sourced from free-grazing, grass-fed native cows with an ethical 'calf-first' policy and over 36 hours of patient small-batch preparation in Udaipur, it sits in an uncompromising premium tier of purity.",
  },
  {
    question: "Why does the texture of the ghee look grainy (Danedaar) or change in different seasons?",
    answer:
      "A rich, granular (danedaar) texture is the true hallmark of authentic, unadulterated bilona ghee! Because Sanvrit Ghee contains zero artificial emulsifiers, stabilizers, or palm oil, its physical state naturally adapts to ambient room temperatures—becoming semi-solid and crystallized in winter and golden liquid in warm summer. Both states preserve 100% of the nutrients.",
  },
  {
    question: "Why do you pack in food-grade glass jars instead of plastic pouches or tins?",
    answer:
      "Ghee is a warm, lipid-rich substance that can cause microscopic chemical leaching (BPA and microplastics) when packed in plastic jars or poly pouches. Sanvrit Ghee is poured warm and sealed airtight in premium food-grade glass jars to preserve the delicate aroma, prevent plastic contamination, and maintain purity from the first spoon to the last.",
  },
  {
    question: "Is Sanvrit Ghee lab-tested and certified pure?",
    answer:
      "Yes, absolutely. Every batch of Sanvrit Ghee is tested by certified NABL food testing laboratories for A2 Beta-Casein verification, RM value (>28 standard for pure cow ghee), zero adulteration (Baudouin test for vanaspati negative, mineral oil and palm oil absent), and compliance with FSSAI Lic. No. 22225088000714. Full test results are viewable on our Lab Reports page.",
  },
  {
    question: "What is the shelf life and how should I store Sanvrit Ghee?",
    answer:
      "When stored in a cool, dry place away from direct sunlight, pure Bilona ghee has a shelf life of 12 months from the date of manufacture. Because of its ultra-low moisture content (<0.2%), refrigeration is not required. Always use a clean, dry spoon to prevent introducing external moisture.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-stone-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#7C2D12] text-xs font-bold mb-3 border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5 text-[#7C2D12]" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Everything you need to know about our authentic Vedic Bilona A2 Gir Cow Ghee, Udaipur dairy origin, and lab purity.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#7C2D12] bg-[#FAF6EE] shadow-sm"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2.5">
                    <span className="text-xs font-sans font-bold text-[#7C2D12] w-5 h-5 rounded-full bg-amber-100/70 flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#7C2D12] text-white rotate-180"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-amber-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-6 rounded-3xl bg-[#FAF6EE] border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base text-stone-900">
              Have a specific question about your order?
            </h4>
            <p className="text-xs text-stone-600">
              Our dairy team in Udaipur is available on WhatsApp to assist with recipes, bulk orders, and shipping queries.
            </p>
          </div>
          <a
            href="https://wa.me/918690054729?text=Hi%20Sanvrit%20Ghee%2C%20I%20have%20a%20question%20about%20your%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
          >
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
