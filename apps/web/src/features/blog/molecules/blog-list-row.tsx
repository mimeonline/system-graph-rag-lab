import { TrackedLink } from "@/components/molecules/tracked-link";
import type { BlogPostSummary } from "@/features/blog/contracts";

type BlogListRowProps = {
  post: BlogPostSummary;
};

export function BlogListRow({ post }: BlogListRowProps): React.JSX.Element {
  return (
    <article className="px-4 py-4 sm:px-5">
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("de-DE")}</time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[85ch]">
          <h3 className="text-[1.03rem] font-semibold text-slate-900">{post.title}</h3>
          <p className="mt-1.5 text-[0.92rem] leading-6 text-slate-700">{post.excerpt}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[0.68rem] text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <TrackedLink
          href={`/essay/${post.slug}`}
          label="Lesen"
          eventName="essay_list_row_click"
          payload={{ slug: post.slug }}
          className="inline-flex shrink-0 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        />
      </div>
    </article>
  );
}
