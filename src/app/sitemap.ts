import type { MetadataRoute } from "next";
import { routeChain } from "@/data/site";

const BASE = "https://migration-control-tower.example";

export default function sitemap(): MetadataRoute.Sitemap {
  return routeChain.map((route) => ({
    url: `${BASE}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
