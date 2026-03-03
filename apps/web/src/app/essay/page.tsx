import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { getAllBlogPosts } from "@/features/blog/content";
import { BlogIndexTemplate } from "@/features/blog/templates/BlogIndexTemplate";

export const metadata: Metadata = {
  title: "GraphRAG Essays",
  description: "Praxisnahe Essays zu GraphRAG, Agent-Workflows und produktionsnahen KI-Systemen.",
  alternates: {
    canonical: withCanonical("/essay"),
  },
  openGraph: {
    title: "GraphRAG Essays",
    description: "Praxisnahe Essays zu GraphRAG, Agent-Workflows und produktionsnahen KI-Systemen.",
    url: withCanonical("/essay"),
    type: "website",
  },
};

export default async function EssayPage(): Promise<React.JSX.Element> {
  const posts = await getAllBlogPosts();
  return <BlogIndexTemplate posts={posts} />;
}
