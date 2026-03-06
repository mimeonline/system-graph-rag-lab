import type { Metadata } from "next";
import { BlogIndexTemplate } from "@/features/blog/templates/BlogIndexTemplate";
import { getAllBlogPosts } from "@/features/blog/content";
import { buildLocalizedMetadata } from "@/lib/seo";

type EssayPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    pathname: "/essay",
    title: locale === "en" ? "GraphRAG essays" : "GraphRAG Essays",
    description:
      locale === "en"
        ? "Practical essays on GraphRAG, agent workflows, and production-grade AI systems."
        : "Praxisnahe Essays zu GraphRAG, Agent-Workflows und produktionsnahen KI-Systemen.",
  });
}

export default async function EssayPage({ params }: EssayPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const posts = await getAllBlogPosts(locale);
  return <BlogIndexTemplate locale={locale} posts={posts} />;
}
