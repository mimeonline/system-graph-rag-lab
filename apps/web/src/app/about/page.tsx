import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { AboutPageTemplate } from "@/features/about/templates/AboutPageTemplate";

export const metadata: Metadata = {
  title: "Über das Projekt",
  description:
    "Über System GraphRAG Lab: öffentliches Architekturprojekt für nachvollziehbare KI-Entscheidungen mit GraphRAG.",
  alternates: {
    canonical: withCanonical("/about"),
  },
  openGraph: {
    title: "Über das Projekt",
    description:
      "Über System GraphRAG Lab: öffentliches Architekturprojekt für nachvollziehbare KI-Entscheidungen mit GraphRAG.",
    url: withCanonical("/about"),
    type: "website",
  },
};

export default function AboutPage(): React.JSX.Element {
  return <AboutPageTemplate />;
}
