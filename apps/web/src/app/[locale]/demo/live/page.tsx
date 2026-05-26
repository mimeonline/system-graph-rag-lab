import type { Metadata } from "next";

import { LiveDemoTemplate } from "@/features/demo/templates/LiveDemoTemplate";
import { buildLocalizedMetadata } from "@/lib/seo";

type LiveDemoPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: LiveDemoPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    pathname: "/demo/live",
    title: locale === "en" ? "Live mode | GraphRAG Demo" : "Live-Modus | GraphRAG Demo",
    description:
      locale === "en"
        ? "Legacy live mode for the real System Thinking GraphRAG query pipeline."
        : "Separater Live-Modus für die echte System-Thinking-GraphRAG-Query-Pipeline.",
  });
}

export default async function LiveDemoPage({ params }: LiveDemoPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  return <LiveDemoTemplate locale={locale} />;
}
