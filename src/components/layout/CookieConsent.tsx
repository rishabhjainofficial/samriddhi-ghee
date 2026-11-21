"use client";

import { useState, useEffect } from "react";
import { Cookie, X, Check } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sanvrit_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("sanvrit_cookie_consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("sanvrit_cookie_consent", "essential_only");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Privacy & Cookie Notice"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-stone-900/95 backdrop-blur-md text-stone-200 p-4 sm:p-5 rounded-2xl shadow-2xl border border-stone-800 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white text-sm">Purity & Privacy First</h4>
            <button
              onClick={handleDecline}
              aria-label="Dismiss cookie notice"
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-stone-300 leading-relaxed text-[11px]">
            We use essential local storage to remember your cart items and fast checkout address. We never sell your personal data.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleAccept}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-xs transition-colors shadow-xs flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept & Continue</span>
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-lg text-xs transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
