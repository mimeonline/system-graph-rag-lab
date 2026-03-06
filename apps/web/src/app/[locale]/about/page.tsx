import type { Metadata } from "next";
import { AboutPageTemplate } from "@/features/about/templates/AboutPageTemplate";
import { buildLocalizedMetadata } from "@/lib/seo";

type AboutPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    locale,
    pathname: "/about",
    title: locale === "en" ? "About the project" : "Über das Projekt",
    description:
      locale === "en"
        ? "About System GraphRAG Lab: a public architecture project for traceable AI decisions with GraphRAG."
        : "Über System GraphRAG Lab: öffentliches Architekturprojekt für nachvollziehbare KI-Entscheidungen mit GraphRAG.",
  });
}

export default function AboutPage(): React.JSX.Element {
  return <AboutPageTemplate />;
}
