import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { HomeTemplate } from "@/features/home/templates/HomeTemplate";

export const metadata: Metadata = {
  title: "System GraphRAG Lab | Public MVP",
  description:
    "Live-Demo: Wie GraphRAG aus Frage, Kontext, Knoten und Belegen eine nachvollziehbare Antwort erzeugt.",
  alternates: {
    canonical: withCanonical("/"),
  },
  openGraph: {
    title: "System GraphRAG Lab | Public MVP",
    description:
      "Live-Demo: Wie GraphRAG aus Frage, Kontext, Knoten und Belegen eine nachvollziehbare Antwort erzeugt.",
    url: withCanonical("/"),
    type: "website",
  },
};

/**
 * Home route entry point that delegates rendering to the home feature template.
 */
export default function Home(): React.JSX.Element {
  return <HomeTemplate />;
}
