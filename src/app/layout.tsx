import type { Metadata } from "next";
import "./globals.css";
import { CookieConsent } from "@/components/layout/CookieConsent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sanvritghee.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sanvrit Ghee | 100% Pure Vedic Bilona Desi Cow Ghee - Taste of Purity",
    template: "%s | Sanvrit Ghee",
  },
  description:
    "Experience the rich golden aroma and granular purity of Sanvrit Vedic Bilona Ghee. Handcrafted from curd of grass-fed Gir cows in Rajasthan. 100% pure, lab-certified with zero chemicals.",
  keywords: [
    "Sanvrit Ghee",
    "A2 Cow Ghee",
    "Vedic Bilona Ghee",
    "Gir Cow Ghee",
    "Desi Cow Ghee",
    "Cultured Bilona Ghee",
    "Pure Ghee Udaipur",
    "Grass Fed Cow Ghee",
    "Buy Pure Ghee Online India",
    "Danedaar Desi Ghee",
  ],
  authors: [{ name: "Dharmasya Food Products Pvt. Ltd." }],
  creator: "Sanvrit Ghee",
  publisher: "Dharmasya Food Products Pvt. Ltd.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Sanvrit Ghee",
    title: "Sanvrit Ghee | 100% Pure Vedic Bilona Desi Cow Ghee",
    description:
      "Handcrafted from curd of free-grazing indigenous Gir cows using sacred wooden Bilona churners. Pure, unadulterated, and lab-certified.",
    images: [
      {
        url: "/images/sanvrit-a2-ghee-front.webp",
        width: 800,
        height: 1000,
        alt: "Sanvrit Pure A2 Desi Cow Ghee Jar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanvrit Ghee | Pure Vedic Bilona Desi Cow Ghee",
    description:
      "Handcrafted pure A2 Gir cow ghee churned via traditional Vedic Bilona method. Order fresh directly from farm.",
    images: ["/images/sanvrit-a2-ghee-front.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo-icon.webp",
    apple: "/images/logo-icon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Store"],
    "@id": `${siteUrl}/#organization`,
    name: "Sanvrit Ghee",
    alternateName: "Sanvrit Pure A2 Desi Cow Ghee",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.webp`,
    image: `${siteUrl}/images/sanvrit-a2-ghee-front.webp`,
    description:
      "Purveyor of 100% pure Vedic Bilona A2 Desi Cow Ghee, hand-churned from curd of grass-fed native Indian cows.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "128-129, S.M. Lodha Complex",
      addressLocality: "Udaipur",
      addressRegion: "Rajasthan",
      postalCode: "313001",
      addressCountry: "IN",
    },
    priceRange: "₹₹",
    taxID: "FSSAI 22225088000714",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-cream text-stone-900">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
