import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { GraphRagStoryTemplate } from "@/features/story/templates/GraphRagStoryTemplate";

export const metadata: Metadata = {
  title: "GraphRAG Story | System GraphRAG Lab",
  description:
    "Technische 5-Schritt-Herleitung von Frage, Retrieval, Graph, Synthese und Handlung fuer belastbare Entscheidungsstruktur.",
  alternates: {
    canonical: withCanonical("/story/graphrag"),
  },
  openGraph: {
    title: "GraphRAG Story | System GraphRAG Lab",
    description:
      "Technische 5-Schritt-Herleitung von Frage, Retrieval, Graph, Synthese und Handlung fuer belastbare Entscheidungsstruktur.",
    url: withCanonical("/story/graphrag"),
    type: "website",
  },
};

export default function GraphRagStoryPage(): React.JSX.Element {
  return <GraphRagStoryTemplate />;
}
