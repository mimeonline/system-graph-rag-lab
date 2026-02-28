import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { HomeDemoTemplate } from "@/features/demo/templates/HomeDemoTemplate";

export const metadata: Metadata = {
  title: "Demo | System GraphRAG Lab",
  description:
    "Interaktive GraphRAG-Demo: Frage stellen, Graph-Herleitung sehen, Belege prüfen und nächste Schritte ableiten.",
  alternates: {
    canonical: withCanonical("/demo"),
  },
  openGraph: {
    title: "Demo | System GraphRAG Lab",
    description:
      "Interaktive GraphRAG-Demo: Frage stellen, Graph-Herleitung sehen, Belege prüfen und nächste Schritte ableiten.",
    url: withCanonical("/demo"),
    type: "website",
  },
};

export default function DemoPage(): React.JSX.Element {
  return <HomeDemoTemplate />;
}
