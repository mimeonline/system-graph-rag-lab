import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { withCanonical } from "@/config/site";

type BlogLegacyArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogLegacyArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Essay",
    description: "Legacy article route redirect to the current essay URL.",
    alternates: {
      canonical: withCanonical(`/essay/${slug}`),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function BlogLegacyArticlePage({ params }: BlogLegacyArticlePageProps): Promise<never> {
  const { slug } = await params;
  redirect(`/essay/${slug}`);
}
