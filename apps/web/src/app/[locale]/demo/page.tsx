import type { Metadata } from "next";
import { HomeDemoTemplate } from "@/features/demo/templates/HomeDemoTemplate";
import { buildLocalizedMetadata } from "@/lib/seo";

type DemoPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    pathname: "/demo",
    title: locale === "en" ? "GraphRAG demo" : "GraphRAG Demo",
    description:
      locale === "en"
        ? "Interactive GraphRAG demo: ask a question, inspect the graph reasoning, review evidence, and derive next steps."
        : "Interaktive GraphRAG-Demo: Frage stellen, Graph-Herleitung sehen, Belege prüfen und nächste Schritte ableiten.",
  });
}

export default function DemoPage(): React.JSX.Element {
  return <HomeDemoTemplate />;
}
