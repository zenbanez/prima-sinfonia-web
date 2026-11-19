import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0 },
    { path: "/lessons", priority: 0.9 },
    { path: "/lcm-exams", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/recitals", priority: 0.7 },
    { path: "/enquire", priority: 0.9 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${site.baseUrl}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
