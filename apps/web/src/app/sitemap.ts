import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { getAllBlogPosts } from "@/features/blog/content";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/demo",
  "/story/graphrag",
  "/essay",
  "/datenschutz",
  "/impressum",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const posts = await getAllBlogPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const articlePath = `/essay/${post.slug}`;
    const lastModified = new Date(post.updatedAt ?? post.publishedAt);
    return {
      url: post.canonicalUrl?.trim() || `${SITE_URL}${articlePath}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  return [...staticEntries, ...postEntries];
}
