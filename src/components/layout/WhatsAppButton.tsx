"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "919876543210";
  const defaultMessage = encodeURIComponent(
    "Hi Sanvrit Ghee, I have a query about your pure A2 Bilona Desi Ghee products."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
    >
      <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
      <span className="text-xs font-semibold tracking-wide hidden sm:inline">
        WhatsApp Us
      </span>
    </a>
  );
}
