import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { GraphRagStoryTemplate } from "@/features/story/templates/GraphRagStoryTemplate";

export const metadata: Metadata = {
  title: "GraphRAG Story in 5 Schritten",
  description:
    "In 5 einfachen Schritten von der Frage zu einer nachvollziehbaren Entscheidung mit GraphRAG.",
  alternates: {
    canonical: withCanonical("/story/graphrag"),
  },
  openGraph: {
    title: "GraphRAG Story in 5 Schritten",
    description:
      "In 5 einfachen Schritten von der Frage zu einer nachvollziehbaren Entscheidung mit GraphRAG.",
    url: withCanonical("/story/graphrag"),
    type: "website",
  },
};

export default function GraphRagStoryPage(): React.JSX.Element {
  return <GraphRagStoryTemplate />;
}
