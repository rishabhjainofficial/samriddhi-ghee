import type { Metadata } from "next";
import "./globals.css";
import { CookieConsent } from "@/components/layout/CookieConsent";

export const metadata: Metadata = {
  title: "Sanvrit Ghee | 100% Pure Vedic Bilona Desi Ghee - Taste of Purity",
  description:
    "Experience the rich golden aroma and granular purity of Sanvrit Vedic Bilona Ghee. Hand-churned from free-grazing Indian cows with pure taste of purity.",
  icons: {
    icon: "/images/logo-icon.png",
    apple: "/images/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-cream text-stone-900">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
