import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DEMO_GRAPH_TYPES, getDemoGraphTypeBySlug } from "@/features/demo/graph-type-learning-model";
import { GraphTypeDetailTemplate } from "@/features/demo/templates/GraphTypeDetailTemplate";
import { buildLocalizedMetadata } from "@/lib/seo";

type GraphTypePageProps = {
  params: Promise<{ locale: "de" | "en"; graphType: string }>;
};

export function generateStaticParams(): Array<{ locale: "de" | "en"; graphType: string }> {
  return DEMO_GRAPH_TYPES.flatMap((graphType) => [
    { locale: "de", graphType: graphType.slug },
    { locale: "en", graphType: graphType.slug },
  ]);
}

export async function generateMetadata({ params }: GraphTypePageProps): Promise<Metadata> {
  const { locale, graphType: slug } = await params;
  const graphType = getDemoGraphTypeBySlug(slug);

  if (!graphType) {
    return {};
  }

  return buildLocalizedMetadata({
    locale,
    pathname: `/demo/${graphType.slug}`,
    title: `${graphType.title} | GraphRAG Demo`,
    description: graphType.detailIntro,
  });
}

export default async function GraphTypePage({ params }: GraphTypePageProps): Promise<React.JSX.Element> {
  const { locale, graphType: slug } = await params;
  const graphType = getDemoGraphTypeBySlug(slug);

  if (!graphType) {
    notFound();
  }

  return <GraphTypeDetailTemplate graphType={graphType} locale={locale} />;
}
