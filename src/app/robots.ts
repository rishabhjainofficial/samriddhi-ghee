import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sanvritghee.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/order-success/", "/payment/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
