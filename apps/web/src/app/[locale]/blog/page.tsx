import { redirect } from "next/navigation";

type LegacyBlogPageProps = {
  params: Promise<{ locale: "de" | "en" }>;
};

export default async function BlogLegacyPage({ params }: LegacyBlogPageProps): Promise<never> {
  const { locale } = await params;
  return redirect(`/${locale}/essay`);
}
