import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { ExecutiveLandingTemplate } from "@/features/landing/templates/ExecutiveLandingTemplate";

export const metadata: Metadata = {
  title: "System GraphRAG Lab | Executive Landing",
  description:
    "Nachvollziehbare AI Entscheidungen mit GraphRAG: Knoten, Kanten und Belege statt Blackbox-Antworten.",
  alternates: {
    canonical: withCanonical("/"),
  },
  openGraph: {
    title: "System GraphRAG Lab | Executive Landing",
    description:
      "Nachvollziehbare AI Entscheidungen mit GraphRAG: Knoten, Kanten und Belege statt Blackbox-Antworten.",
    url: withCanonical("/"),
    type: "website",
  },
};

export default function Home(): React.JSX.Element {
  return <ExecutiveLandingTemplate />;
}
