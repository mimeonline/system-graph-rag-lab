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

const ESSAY_DRILLDOWNS: Record<string, { slug: string; title: string }> = {
  "was-graphrag-strukturell-anders-macht-als-klassisches-rag": {
    slug: "kontextdisziplin-warum-weniger-kontext-oft-bessere-antworten-erzeugt",
    title: "Kontextdisziplin",
  },
  "qualitaetskriterien-fuer-ein-produktives-graphrag-system": {
    slug: "prompt-transparenz-als-vertrauensfaktor",
    title: "Prompt-Transparenz",
  },
  "graphrag-als-entscheidungs-interface-fuer-organisationen": {
    slug: "system-thinking-als-idealer-use-case-fuer-graphrag",
    title: "System Thinking Use Case",
  },
};

const DRILLDOWN_PARENT: Record<string, string> = Object.fromEntries(
  Object.entries(ESSAY_DRILLDOWNS).map(([parentSlug, drilldown]) => [drilldown.slug, parentSlug]),
);

function getNextEssay(currentSlug: string): { slug: string; title: string; step: string } | null {
  const currentIndex = ESSAY_ORDER.findIndex((e) => e.slug === currentSlug);
  if (currentIndex === -1 || currentIndex >= ESSAY_ORDER.length - 1) {
    return null;
  }
  return ESSAY_ORDER[currentIndex + 1] ?? null;
}

function getDrilldownEssay(currentSlug: string): { slug: string; title: string } | null {
  return ESSAY_DRILLDOWNS[currentSlug] ?? null;
}

function getDrilldownParentEssay(currentSlug: string): { slug: string; title: string; step: string } | null {
  const parentSlug = DRILLDOWN_PARENT[currentSlug];
  if (!parentSlug) {
    return null;
  }
  const parent = ESSAY_ORDER.find((essay) => essay.slug === parentSlug);
  return parent ?? null;
}

function getDrilldownContinueEssay(currentSlug: string): { slug: string; title: string; step: string } | null {
  const parentSlug = DRILLDOWN_PARENT[currentSlug];
  if (!parentSlug) {
    return null;
  }
  const parentIndex = ESSAY_ORDER.findIndex((essay) => essay.slug === parentSlug);
  if (parentIndex === -1 || parentIndex >= ESSAY_ORDER.length - 1) {
    return null;
  }
  return ESSAY_ORDER[parentIndex + 1] ?? null;
}

export function BlogArticleTemplate({ frontmatter, content, toc }: BlogArticleTemplateProps): React.JSX.Element {
  const canonical = frontmatter.canonicalUrl ?? withCanonical(`/essay/${frontmatter.slug}`);
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`;
  const xShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(frontmatter.title)}`;
  const publishedDate = new Intl.DateTimeFormat("de-DE", { timeZone: "UTC" }).format(new Date(frontmatter.publishedAt));
  const nextEssay = getNextEssay(frontmatter.slug);
  const drilldownEssay = getDrilldownEssay(frontmatter.slug);
  const drilldownParentEssay = getDrilldownParentEssay(frontmatter.slug);
  const drilldownContinueEssay = getDrilldownContinueEssay(frontmatter.slug);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <ReadingProgressBar />
      <TrackedPageView page={`/essay/${frontmatter.slug}`} />
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
              <h1 className="mt-4 text-[2.2rem] font-bold tracking-tight text-gradient-primary leading-[1.15] sm:text-[2.6rem]">
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
              <figure className="mt-6 mx-auto max-w-[95vw] lg:max-w-[1100px] overflow-hidden rounded-xl border border-slate-200/60 shadow-sm">
                <Image
                  src={frontmatter.heroImage}
                  alt={frontmatter.title}
                  width={1600}
                  height={900}
                  className="block w-full object-contain"
                  style={{ maxHeight: 420, maxWidth: 1100 }}
                  priority
                />
                <div className="absolute inset-0 rounded-xl rounded-b-none ring-1 ring-inset ring-slate-900/10" aria-hidden />
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
                <a
                  href={`/essay/${nextEssay.slug}`}
                  className="group mt-6 flex items-center justify-between gap-4 glass-panel rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(14,165,233,0.12)] hover:border-sky-300/50"
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

            {drilldownEssay ? (
              <a
                href={`/essay/${drilldownEssay.slug}`}
                className="group mt-4 flex items-center justify-between gap-4 rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/70 to-sky-50/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(79,70,229,0.14)] hover:border-indigo-300/70"
              >
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-700">Vertiefung im Strang</p>
                  <p className="text-base font-bold text-slate-900 group-hover:text-indigo-800 transition-colors">
                    {drilldownEssay.title}
                  </p>
                </div>
                <span className="text-xl text-indigo-400 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" aria-hidden>↗</span>
              </a>
            ) : null}

            {drilldownParentEssay || drilldownContinueEssay ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {drilldownParentEssay ? (
                  <a
                    href={`/essay/${drilldownParentEssay.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Zurück im Strang</p>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-950">
                        Schritt {drilldownParentEssay.step}: {drilldownParentEssay.title}
                      </p>
                    </div>
                    <span className="text-lg text-slate-400 group-hover:text-slate-600 transition-transform group-hover:-translate-x-1" aria-hidden>←</span>
                  </a>
                ) : null}

                {drilldownContinueEssay ? (
                  <a
                    href={`/essay/${drilldownContinueEssay.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-sky-200/70 bg-gradient-to-br from-sky-50/70 to-slate-50/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm"
                  >
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700">Weiter im Flow</p>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-sky-800">
                        Schritt {drilldownContinueEssay.step}: {drilldownContinueEssay.title}
                      </p>
                    </div>
                    <span className="text-lg text-sky-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                  </a>
                ) : null}
              </div>
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
                      className="group flex items-center gap-3 text-sm font-medium text-slate-600 transition-colors hover:text-sky-700"
                    >
                      <span className="block h-1.5 w-1.5 rounded-full bg-slate-300 transition-colors group-hover:bg-sky-500" aria-hidden />
                      <span className="flex-1">{item.text}</span>
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
                className="glass-panel rounded-2xl p-5 max-w-[460px]"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Visualisierungen</p>
                <div className="mt-3 space-y-3 flex flex-col items-center">
                  {frontmatter.diagramImages.map((image) => (
                    image.toLowerCase().endsWith(".svg") ? (
                      <img
                        key={image}
                        src={image}
                        alt="Diagramm"
                        className="block h-auto w-full rounded-lg border border-slate-200/60 shadow-sm"
                        style={{ maxWidth: 420 }}
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        key={image}
                        src={image}
                        alt="Diagramm"
                        width={1200}
                        height={800}
                        className="block h-auto w-full rounded-lg border border-slate-200/60 shadow-sm"
                        style={{ maxWidth: 420 }}
                      />
                    )
                  ))}
                </div>
              </motion.section>
            ) : null}

            {/* Floating Back Link */}
            <a
              href="/essay"
              className="inline-flex glass-panel items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-600 transition-all hover:text-sky-700 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-lg leading-none transition-transform group-hover:-translate-x-1" aria-hidden>←</span>
              Zurück zur Übersicht
            </a>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
