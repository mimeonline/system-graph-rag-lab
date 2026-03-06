import { redirect } from "next/navigation";

type EssayArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EssayArticlePage({ params }: EssayArticlePageProps): Promise<never> {
  const { slug } = await params;
  redirect(`/de/essay/${slug}`);
}
