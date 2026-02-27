import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { PRIMARY_CTA } from "@/config/site";
import type { BlogPostSummary } from "@/features/blog/contracts";
import { BlogCard } from "@/features/blog/molecules/blog-card";

type BlogIndexTemplateProps = {
  posts: BlogPostSummary[];
};

export function BlogIndexTemplate({ posts }: BlogIndexTemplateProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-slate-900">
      <TrackedPageView page="/blog" />
      <SiteHeader />
      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto w-full max-w-[1180px] space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">Blog</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-tight text-slate-950">Praxisberichte über GraphRAG und Agent-Workflows</h1>
            <p className="mt-2 max-w-[72ch] text-[0.96rem] leading-7 text-slate-700">
              Klare Erfahrungsberichte statt Hype: was funktioniert, was nicht und wie man es produktiv einsetzt.
            </p>
            <div className="mt-4">
              <TrackedLink
                href={PRIMARY_CTA.href}
                label={PRIMARY_CTA.label}
                eventName="cta_click"
                payload={{ surface: "blog-hero", priority: PRIMARY_CTA.priority }}
                className="inline-flex rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              />
            </div>
          </section>

          <section className="grid gap-4">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
