import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_AUTHOR, SITE_NAME } from "@/config/site";
import { getAllBlogPosts, getBlogPostBySlug } from "@/features/blog/content";
import { BlogArticleTemplate } from "@/features/blog/templates/BlogArticleTemplate";
import { buildBlogPageMetadata } from "@/lib/page-metadata";
import { getAbsoluteUrl } from "@/lib/seo";

type EssayArticlePageProps = {
  params: Promise<{ locale: "de" | "en"; slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ locale: "de" | "en"; slug: string }>> {
  const params: Array<{ locale: "de" | "en"; slug: string }> = [];

  for (const locale of ["de", "en"] as const) {
    const posts = await getAllBlogPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: EssayArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);

  if (!post) {
    return { title: locale === "en" ? "Essay not found" : "Essay nicht gefunden" };
  }

  return buildBlogPageMetadata(locale, post);
}

export default async function EssayArticlePage({
  params,
}: EssayArticlePageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) {
    notFound();
  }

  const canonical = getAbsoluteUrl(`/${post.sourceLocale}/essay/${slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    author: {
      "@type": "Person",
      name: SITE_AUTHOR,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    datePublished: post.frontmatter.publishedAt,
    dateModified: post.frontmatter.updatedAt ?? post.frontmatter.publishedAt,
    mainEntityOfPage: canonical,
    url: canonical,
    keywords: post.frontmatter.tags.join(", ")
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogArticleTemplate frontmatter={post.frontmatter} content={post.content} toc={post.toc} />
    </>
  );
}
