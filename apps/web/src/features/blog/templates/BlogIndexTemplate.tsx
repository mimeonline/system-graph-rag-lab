import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { PRIMARY_CTA } from "@/config/site";
import type { BlogPostSummary } from "@/features/blog/contracts";
import { BlogFeaturedItem } from "@/features/blog/molecules/blog-featured-item";
import { BlogListRow } from "@/features/blog/molecules/blog-list-row";

type BlogIndexTemplateProps = {
  posts: BlogPostSummary[];
};

export function BlogIndexTemplate({ posts }: BlogIndexTemplateProps): React.JSX.Element {
  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const listPosts = posts.filter((post) => post.slug !== featuredPost?.slug);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-slate-900">
      <TrackedPageView page="/blog" />
      <SiteHeader />
      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto w-full max-w-[1180px] space-y-8">
          <section className="space-y-4 pt-1">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-sky-700">Blog</p>
            <h1 className="max-w-[20ch] text-[1.85rem] font-semibold tracking-tight text-slate-950 sm:text-[2.1rem]">
              Praxisberichte über GraphRAG und Agent-Workflows
            </h1>
            <p className="max-w-[72ch] text-[0.95rem] leading-7 text-slate-700">
              Klare Erfahrungsberichte statt Hype: was funktioniert, was nicht und wie man es produktiv einsetzt.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <TrackedLink
                href={PRIMARY_CTA.href}
                label={PRIMARY_CTA.label}
                eventName="cta_click"
                payload={{ surface: "blog-hero", priority: PRIMARY_CTA.priority }}
                className="inline-flex rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              />
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Direkt rein:</span>
                <TrackedLink
                  href="/story/graphrag"
                  label="GraphRAG Story"
                  eventName="blog_quicklink_click"
                  payload={{ target: "story-graphrag" }}
                  className="inline-flex items-center text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-800"
                />
                <span className="text-slate-400">·</span>
                <TrackedLink
                  href="/lab/multi-agent"
                  label="Multi-Agent Lab"
                  eventName="blog_quicklink_click"
                  payload={{ target: "lab-multi-agent" }}
                  className="inline-flex items-center text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-800"
                />
              </div>
            </div>
          </section>

          {featuredPost ? (
            <section className="space-y-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Featured Artikel</p>
              <BlogFeaturedItem post={featuredPost} />
            </section>
          ) : null}

          {listPosts.length > 0 ? (
            <section className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Weitere Artikel</p>
              <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {listPosts.map((post) => (
                  <BlogListRow key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
