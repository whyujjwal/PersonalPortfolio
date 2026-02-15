import type { MetadataRoute } from "next";
import { posts, projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://whyujjwal.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/writing",
    "/proof",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/writing/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/proof/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
