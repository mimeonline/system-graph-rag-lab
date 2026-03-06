import type { Metadata } from "next";
import { GraphRagStoryTemplate } from "@/features/story/templates/GraphRagStoryTemplate";
import { buildLocalizedMetadata } from "@/lib/seo";

type StoryPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    pathname: "/story/graphrag",
    title: locale === "en" ? "GraphRAG story in 5 steps" : "GraphRAG Story in 5 Schritten",
    description:
      locale === "en"
        ? "From the initial question to a traceable decision in five clear GraphRAG steps."
        : "In 5 einfachen Schritten von der Frage zu einer nachvollziehbaren Entscheidung mit GraphRAG.",
  });
}

export default function StoryPage(): React.JSX.Element {
  return <GraphRagStoryTemplate />;
}
