import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { defaultLocale, locales } from "@/i18n/config";
import { getAllBlogPosts } from "@/features/blog/content";
import { getAbsoluteUrl } from "@/lib/seo";

const STATIC_ROUTES = [
  "/about",
  "/demo",
  "/story/graphrag",
  "/essay",
  "/datenschutz",
  "/impressum",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const rootEntry: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    ["/", ...STATIC_ROUTES].map((route) => ({
      url: getAbsoluteUrl(`/${locale}${route === "/" ? "" : route}`),
      lastModified: now,
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 0.9 : 0.7,
    })),
  );

  const postEntries: MetadataRoute.Sitemap = [];
  const dePosts = await getAllBlogPosts(defaultLocale);
  for (const post of dePosts) {
    const lastModified = new Date(post.updatedAt ?? post.publishedAt);
    postEntries.push({
      url: getAbsoluteUrl(`/de/essay/${post.slug}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  const enPosts = await getAllBlogPosts("en");
  for (const post of enPosts) {
    if (post.sourceLocale !== "en") {
      continue;
    }

    const lastModified = new Date(post.updatedAt ?? post.publishedAt);
    postEntries.push({
      url: getAbsoluteUrl(`/en/essay/${post.slug}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return [...rootEntry, ...staticEntries, ...postEntries];
}
