import type { Metadata } from "next";
import { ExecutiveLandingTemplate } from "@/features/landing/templates/ExecutiveLandingTemplate";
import { buildLocalizedMetadata } from "@/lib/seo";

type HomePageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    title:
      locale === "en"
        ? "GraphRAG learning lab for five graph types"
        : "GraphRAG Lernlabor für fünf Graph-Typen",
    description:
      locale === "en"
        ? "Understand GraphRAG through document, domain, knowledge, conversational, and dynamic graphs in an EU AI Act launch decision."
        : "GraphRAG verstehen über Dokument-Graph, Domänen-Graph, Wissensgraph, Conversational Graph und dynamischen Graph in einer EU-AI-Act-Launch-Entscheidung.",
  });
}

export default async function LocalizedHomePage({
  params,
}: HomePageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  return <ExecutiveLandingTemplate locale={locale} />;
}
