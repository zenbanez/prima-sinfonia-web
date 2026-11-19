import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/lessons", "/lcm-exams", "/about", "/recitals", "/enquire"],
      disallow: ["/login", "/signup", "/dashboard", "/teacher", "/student"],
    },
    sitemap: `${site.baseUrl}/sitemap.xml`,
  };
}
