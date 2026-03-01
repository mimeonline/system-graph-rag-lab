import { redirect } from "next/navigation";

type BlogLegacyArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogLegacyArticlePage({ params }: BlogLegacyArticlePageProps): Promise<never> {
  const { slug } = await params;
  redirect(`/essay/${slug}`);
}
