import { redirect } from "next/navigation";

type LegacyBlogArticlePageProps = {
  params: Promise<{ locale: "de" | "en"; slug: string }>;
};

export default async function BlogLegacyArticlePage({
  params,
}: LegacyBlogArticlePageProps): Promise<never> {
  const { locale, slug } = await params;
  return redirect(`/${locale}/essay/${slug}`);
}
