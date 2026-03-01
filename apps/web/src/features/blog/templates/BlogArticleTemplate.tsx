import { ReadingProgressBar } from "@/components/molecules/reading-progress-bar";
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

/** Ordered essay slugs for the "Next Essay" navigation */
const ESSAY_ORDER: { slug: string; title: string; step: string }[] = [
  { slug: "warum-ki-antworten-fuer-entscheidungen-nicht-ausreichen", title: "Problemraum", step: "01" },
  { slug: "was-graphrag-strukturell-anders-macht-als-klassisches-rag", title: "Struktur", step: "02" },
  { slug: "qualitaetskriterien-fuer-ein-produktives-graphrag-system", title: "Qualität", step: "03" },
  { slug: "graphrag-als-entscheidungs-interface-fuer-organisationen", title: "Organisation", step: "04" },
  { slug: "von-plausiblen-antworten-zu-pruefbaren-entscheidungen", title: "Positionierung", step: "05" },
];

function getNextEssay(currentSlug: string): { slug: string; title: string; step: string } | null {
  const currentIndex = ESSAY_ORDER.findIndex((e) => e.slug === currentSlug);
  if (currentIndex === -1 || currentIndex >= ESSAY_ORDER.length - 1) {
    return null;
  }
  return ESSAY_ORDER[currentIndex + 1] ?? null;
}

export function BlogArticleTemplate({ frontmatter, content, toc }: BlogArticleTemplateProps): React.JSX.Element {
  const canonical = frontmatter.canonicalUrl ?? withCanonical(`/blog/${frontmatter.slug}`);
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`;
  const xShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(frontmatter.title)}`;
  const publishedDate = new Intl.DateTimeFormat("de-DE", { timeZone: "UTC" }).format(new Date(frontmatter.publishedAt));
  const nextEssay = getNextEssay(frontmatter.slug);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <ReadingProgressBar />
      <TrackedPageView page={`/blog/${frontmatter.slug}`} />
      <SiteHeader />
      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid w-full max-w-[1280px] gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* Article */}
          <article className="glass-panel rounded-2xl p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
                Systemische Praxis
              </p>
              <h1 className="mt-4 text-[2.2rem] font-bold tracking-tight text-slate-950 leading-[1.15] sm:text-[2.6rem]">
                {frontmatter.title}
              </h1>
              <p className="mt-4 max-w-[72ch] text-[1.05rem] leading-relaxed text-slate-700 font-medium">
                {frontmatter.excerpt}
              </p>
            </motion.div>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <time dateTime={frontmatter.publishedAt}>{publishedDate}</time>
              <span className="text-slate-300">·</span>
              <span>{frontmatter.readingTime}</span>
              <span className="text-slate-300">·</span>
              <span>{frontmatter.tags.join(", ")}</span>
            </div>

            {frontmatter.heroImage ? (
              <figure className="mt-6 overflow-hidden rounded-xl border border-slate-200/60 shadow-sm">
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
              <section className="mt-8 rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/60 to-sky-50/30 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.5)]" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-800">Executive Summary</p>
                </div>
                <p className="mt-3 text-[1rem] leading-relaxed text-slate-800">{frontmatter.tldr}</p>
              </section>
            ) : null}

            {frontmatter.linkedinHook ? (
              <section className="mt-6 rounded-2xl border-l-4 border-l-indigo-500 border border-indigo-200/50 bg-gradient-to-br from-indigo-50/50 to-indigo-50/20 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-800">Kernaussage</p>
                </div>
                <p className="mt-3 text-[1rem] leading-relaxed text-slate-800 italic">{frontmatter.linkedinHook}</p>
              </section>
            ) : null}

            <div className="mt-8 max-w-[74ch] prose-slate">{content}</div>

            {/* Gradient Divider */}
            <div className="mt-10" aria-hidden>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
            </div>

            {/* Share */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Teilen</span>
              <TrackedLink
                href={linkedInShare}
                label="LinkedIn"
                eventName="share_click"
                payload={{ channel: "linkedin", slug: frontmatter.slug }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md"
                external
                icon={<Linkedin className="h-4 w-4" aria-hidden />}
              />
              <TrackedLink
                href={xShare}
                label="X"
                eventName="share_click"
                payload={{ channel: "x", slug: frontmatter.slug }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md"
                external
                icon={<span className="text-[13px] font-bold leading-none">𝕏</span>}
              />
            </div>

            {/* Next Essay Navigation */}
            {nextEssay ? (
              <>
                <div className="mt-8" aria-hidden>
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
                </div>
                <a
                  href={`/blog/${nextEssay.slug}`}
                  className="group mt-6 flex items-center justify-between gap-4 glass-panel rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-900/5 hover:border-sky-200"
                >
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Weiter im Argumentationsfluss</p>
                    <p className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      Schritt {nextEssay.step}: {nextEssay.title}
                    </p>
                  </div>
                  <span className="text-xl text-slate-400 group-hover:text-sky-600 transition-all group-hover:translate-x-1" aria-hidden>→</span>
                </a>
              </>
            ) : null}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <motion.section
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              className="glass-panel rounded-2xl p-5"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Inhaltsverzeichnis</p>
              <nav className="mt-4 space-y-2" aria-label="Inhaltsverzeichnis">
                {toc.map((item) => (
                  <div key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                    <a
                      href={`#${item.id}`}
                      className="block text-sm font-medium text-slate-600 transition-colors hover:text-sky-700"
                    >
                      {item.text}
                    </a>
                  </div>
                ))}
              </nav>
            </motion.section>

            {frontmatter.diagramImages && frontmatter.diagramImages.length > 0 ? (
              <motion.section
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
                className="glass-panel rounded-2xl p-5"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Visualisierungen</p>
                <div className="mt-3 space-y-3">
                  {frontmatter.diagramImages.map((image) => (
                    <Image
                      key={image}
                      src={image}
                      alt="Diagramm"
                      width={1200}
                      height={800}
                      className="block h-auto w-full rounded-lg border border-slate-200/60 shadow-sm"
                    />
                  ))}
                </div>
              </motion.section>
            ) : null}

            {/* Back Link */}
            <a
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 transition-colors hover:text-sky-700"
            >
              <span aria-hidden>←</span>
              Alle Essays
            </a>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
