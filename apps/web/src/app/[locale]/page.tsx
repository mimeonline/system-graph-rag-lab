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
        ? "GraphRAG for traceable AI decisions"
        : "GraphRAG für nachvollziehbare KI-Entscheidungen",
    description:
      locale === "en"
        ? "Traceable AI decisions with GraphRAG: nodes, relations, and evidence instead of black-box answers."
        : "Nachvollziehbare AI Entscheidungen mit GraphRAG: Knoten, Kanten und Belege statt Blackbox-Antworten.",
  });
}

export default async function LocalizedHomePage({
  params,
}: HomePageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  return <ExecutiveLandingTemplate locale={locale} />;
}
