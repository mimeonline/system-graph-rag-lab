import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { GraphRagStoryTemplate } from "@/features/story/templates/GraphRagStoryTemplate";

export const metadata: Metadata = {
  title: "GraphRAG Story | System GraphRAG Lab",
  description: "Systemische Struktur-Demonstration: Textverdichtung, Graph-Struktur und stabiler Entscheidungspfad im direkten Vergleich.",
  alternates: {
    canonical: withCanonical("/story/graphrag"),
  },
  openGraph: {
    title: "GraphRAG Story | System GraphRAG Lab",
    description: "Systemische Struktur-Demonstration: Textverdichtung, Graph-Struktur und stabiler Entscheidungspfad im direkten Vergleich.",
    url: withCanonical("/story/graphrag"),
    type: "website",
  },
};

export default function GraphRagStoryPage(): React.JSX.Element {
  return <GraphRagStoryTemplate />;
}
