import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { getAllBlogPosts } from "@/features/blog/content";
import { BlogIndexTemplate } from "@/features/blog/templates/BlogIndexTemplate";

export const metadata: Metadata = {
  title: "Blog | System GraphRAG Lab",
  description: "Praxisnahe Artikel zu GraphRAG, Agent-Workflows und produktionsnahen KI-Systemen.",
  alternates: {
    canonical: withCanonical("/blog"),
  },
  openGraph: {
    title: "Blog | System GraphRAG Lab",
    description: "Praxisnahe Artikel zu GraphRAG, Agent-Workflows und produktionsnahen KI-Systemen.",
    url: withCanonical("/blog"),
    type: "website",
  },
};

export default async function BlogPage(): Promise<React.JSX.Element> {
  const posts = await getAllBlogPosts();
  return <BlogIndexTemplate posts={posts} />;
}
