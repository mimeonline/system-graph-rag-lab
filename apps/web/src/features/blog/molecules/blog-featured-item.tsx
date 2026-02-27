import Image from "next/image";
import { TrackedLink } from "@/components/molecules/tracked-link";
import type { BlogPostSummary } from "@/features/blog/contracts";

type BlogFeaturedItemProps = {
  post: BlogPostSummary;
};

export function BlogFeaturedItem({ post }: BlogFeaturedItemProps): React.JSX.Element {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
        <div className="p-5 sm:p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("de-DE")}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
            {post.featured ? (
              <span className="rounded-full bg-sky-100 px-2 py-0.5 font-semibold text-sky-800">Featured</span>
            ) : null}
          </div>
          <h2 className="max-w-[30ch] text-[1.4rem] font-semibold leading-tight text-slate-950 sm:text-[1.55rem]">{post.title}</h2>
          <p className="mt-3 max-w-[70ch] text-[0.95rem] leading-7 text-slate-700">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
                {tag}
              </span>
            ))}
          </div>
          <TrackedLink
            href={`/blog/${post.slug}`}
            label="Featured lesen"
            eventName="blog_featured_click"
            payload={{ slug: post.slug }}
            className="mt-5 inline-flex rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          />
        </div>

        {post.heroImage ? (
          <div className="relative min-h-[220px] border-t border-slate-200 md:min-h-full md:border-l md:border-t-0">
            <Image src={post.heroImage} alt={post.title} fill className="object-cover" sizes="(min-width: 768px) 35vw, 100vw" />
          </div>
        ) : (
          <div className="hidden border-l border-slate-200 bg-[linear-gradient(135deg,#f0f6ff_0%,#e5eefc_100%)] md:block" />
        )}
      </div>
    </article>
  );
}
