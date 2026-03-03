import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_AUTHOR, SITE_NAME, withCanonical } from "@/config/site";
import { getAllBlogPosts, getBlogPostBySlug } from "@/features/blog/content";
import { BlogArticleTemplate } from "@/features/blog/templates/BlogArticleTemplate";

type EssayArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: EssayArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: "Essay nicht gefunden",
    };
  }

  const canonical = post.frontmatter.canonicalUrl ?? withCanonical(`/essay/${slug}`);
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    keywords: post.frontmatter.tags,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      url: canonical,
      type: "article",
      publishedTime: post.frontmatter.publishedAt,
      modifiedTime: post.frontmatter.updatedAt,
      tags: post.frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
    },
  };
}

export default async function EssayArticlePage({ params }: EssayArticlePageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const canonical = post.frontmatter.canonicalUrl ?? withCanonical(`/essay/${slug}`);
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
    keywords: post.frontmatter.tags.join(", "),
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
