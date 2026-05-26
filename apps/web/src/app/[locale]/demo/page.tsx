import type { Metadata } from "next";
import { DemoOverviewTemplate } from "@/features/demo/templates/DemoOverviewTemplate";
import { buildLocalizedMetadata } from "@/lib/seo";

type DemoPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    pathname: "/demo",
    title: locale === "en" ? "EU AI Act GraphRAG learning mode" : "EU-AI-Act-GraphRAG-Lernmodus",
    description:
      locale === "en"
        ? "Overview of five simulated GraphRAG graph types for an EU AI Act launch decision."
        : "Übersicht über fünf simulierte GraphRAG-Graph-Typen anhand einer EU-AI-Act-Launch-Entscheidung.",
  });
}

export default async function DemoPage({ params }: DemoPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  return <DemoOverviewTemplate locale={locale} />;
}
