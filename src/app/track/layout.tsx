import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order Status",
  description: "Track your Sanvrit Ghee parcel in real time with your Order Number and phone number.",
  alternates: {
    canonical: "/track",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
