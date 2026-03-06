import type { AppLocale } from "@/i18n/config";
import type { BlogPostContent } from "@/features/blog/content";
import { getAvailableBlogPostLocales } from "@/features/blog/content";
import { buildLocalizedMetadata } from "@/lib/seo";

export function buildBlogPageMetadata(
  locale: AppLocale,
  item: Pick<BlogPostContent, "slug" | "frontmatter" | "sourceLocale">,
) {
  const pathname = `/essay/${item.slug}`;
  const availableLocales = getAvailableBlogPostLocales(item.slug);

  return buildLocalizedMetadata({
    locale,
    pathname,
    title: item.frontmatter.title,
    description: item.frontmatter.excerpt,
    availableLocales,
    canonicalLocale: item.sourceLocale,
    noindex: locale !== item.sourceLocale,
    openGraphType: "article",
  });
}
