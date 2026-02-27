import { TrackedLink } from "@/components/molecules/tracked-link";
import type { BlogPostSummary } from "@/features/blog/contracts";

type BlogCardProps = {
  post: BlogPostSummary;
};

export function BlogCard({ post }: BlogCardProps): React.JSX.Element {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("de-DE")}</time>
        <span>·</span>
        <span>{post.readingTime}</span>
        {post.featured ? <span className="rounded-full bg-sky-100 px-2 py-0.5 font-semibold text-sky-800">Featured</span> : null}
      </div>
      <h2 className="text-[1.2rem] font-semibold text-slate-900">{post.title}</h2>
      <p className="mt-2 text-[0.92rem] leading-6 text-slate-700">{post.excerpt}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      <TrackedLink
        href={`/blog/${post.slug}`}
        label="Artikel lesen"
        eventName="blog_card_click"
        payload={{ slug: post.slug }}
        className="mt-4 inline-flex rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
      />
    </article>
  );
}
