import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { withCanonical } from "@/config/site";
import type { BlogPostFrontmatter, BlogTocItem } from "@/features/blog/contracts";
import * as motion from "framer-motion/client";
import { Linkedin } from "lucide-react";
import Image from "next/image";

type BlogArticleTemplateProps = {
  frontmatter: BlogPostFrontmatter;
  content: React.ReactNode;
  toc: BlogTocItem[];
};

export function BlogArticleTemplate({ frontmatter, content, toc }: BlogArticleTemplateProps): React.JSX.Element {
  const canonical = frontmatter.canonicalUrl ?? withCanonical(`/blog/${frontmatter.slug}`);
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`;
  const xShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(frontmatter.title)}`;
  const publishedDate = new Intl.DateTimeFormat("de-DE", { timeZone: "UTC" }).format(new Date(frontmatter.publishedAt));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TrackedPageView page={`/blog/${frontmatter.slug}`} />
      <SiteHeader />
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto grid w-full max-w-[1240px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="glass-panel p-6 sm:p-10">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600 mb-6"
            >
              Systemische Praxis
            </motion.p>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-700">Expert Insights</p>
            <h1 className="mt-3 text-[2.4rem] font-bold tracking-tight text-slate-950 leading-[1.15]">{frontmatter.title}</h1>
            <p className="mt-4 max-w-[72ch] text-[1.05rem] leading-relaxed text-slate-700 font-medium">{frontmatter.excerpt}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <time dateTime={frontmatter.publishedAt}>{publishedDate}</time>
              <span>·</span>
              <span>{frontmatter.readingTime}</span>
              <span>·</span>
              <span>{frontmatter.tags.join(", ")}</span>
            </div>
            {frontmatter.heroImage ? (
              <figure className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <Image
                  src={frontmatter.heroImage}
                  alt={frontmatter.title}
                  width={1600}
                  height={900}
                  className="block h-auto w-full"
                  priority
                />
              </figure>
            ) : null}
            {frontmatter.tldr ? (
              <section className="mt-6 rounded-2xl border border-sky-200 bg-sky-50/50 p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-800">Executive Summary</p>
                <p className="mt-2 text-[1rem] leading-relaxed text-slate-800">{frontmatter.tldr}</p>
              </section>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
              <TrackedLink
                href={linkedInShare}
                label="Auf LinkedIn teilen"
                eventName="share_click"
                payload={{ channel: "linkedin", slug: frontmatter.slug }}
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                external
                icon={<Linkedin className="h-4 w-4" aria-hidden />}
              />
              <TrackedLink
                href={xShare}
                label="Auf X teilen"
                eventName="share_click"
                payload={{ channel: "x", slug: frontmatter.slug }}
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                external
                icon={<span className="text-[13px] font-bold leading-none">𝕏</span>}
              />
            </div>
            {frontmatter.linkedinHook ? (
              <section className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm border-l-4 border-l-indigo-500">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-800">Systemischer Fokus</p>
                <p className="mt-2 text-[1rem] leading-relaxed text-slate-800 italic">{frontmatter.linkedinHook}</p>
              </section>
            ) : null}
            <div className="mt-6 max-w-[74ch]">{content}</div>
          </article>

          <aside className="space-y-6">
            <section className="glass-panel p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Inhaltsverzeichnis</p>
              <nav className="mt-4 space-y-2" aria-label="Inhaltsverzeichnis">
                {toc.map((item) => (
                  <div key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                    <a href={`#${item.id}`} className="text-sm font-medium text-slate-600 hover:text-sky-700 transition-colors">
                      {item.text}
                    </a>
                  </div>
                ))}
              </nav>
            </section>
            {frontmatter.diagramImages && frontmatter.diagramImages.length > 0 ? (
              <section className="glass-panel p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Visualisierungen</p>
                <div className="mt-2 space-y-2">
                  {frontmatter.diagramImages.map((image) => (
                    <Image
                      key={image}
                      src={image}
                      alt="Diagramm"
                      width={1200}
                      height={800}
                      className="block h-auto w-full rounded-lg border border-slate-200"
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
