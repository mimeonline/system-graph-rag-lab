import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import type { BlogPostSummary } from "@/features/blog/contracts";
import { GraphEssaysSurface } from "@/features/blog/organisms/GraphEssaysSurface";
import * as motion from "framer-motion/client";
import { Fragment } from "react";

type BlogIndexTemplateProps = {
  posts: BlogPostSummary[];
};

type FlowStep = {
  step: string;
  title: string;
  description: string;
  slug: string;
};

const FLOW_STEPS: FlowStep[] = [
  {
    step: "01",
    title: "Problemraum",
    description: "Warum plausible KI-Antworten für belastbare Entscheidungen nicht ausreichen.",
    slug: "warum-ki-antworten-fuer-entscheidungen-nicht-ausreichen",
  },
  {
    step: "02",
    title: "Struktur",
    description: "Wie GraphRAG Beziehungen und Belegpfade explizit modelliert.",
    slug: "was-graphrag-strukturell-anders-macht-als-klassisches-rag",
  },
  {
    step: "03",
    title: "Qualität",
    description: "Welche Kriterien ein produktives System für Retrieval und Herleitung erfüllen muss.",
    slug: "qualitaetskriterien-fuer-ein-produktives-graphrag-system",
  },
  {
    step: "04",
    title: "Organisation",
    description: "Wie GraphRAG als Entscheidungs-Interface in Organisationen wirkt.",
    slug: "graphrag-als-entscheidungs-interface-fuer-organisationen",
  },
  {
    step: "05",
    title: "Positionierung",
    description: "Von plausiblen Antworten zu prüfbaren, verteidigbaren Entscheidungen.",
    slug: "von-plausiblen-antworten-zu-pruefbaren-entscheidungen",
  },
];

export function BlogIndexTemplate({ posts }: BlogIndexTemplateProps): React.JSX.Element {
  void posts.length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TrackedPageView page="/blog" />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-295 px-4 py-8 sm:px-6 sm:py-12">
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600"
            >
              Systemische Praxis
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="space-y-5"
            >
              <h1 className="max-w-[28ch] text-[2.5rem] font-bold tracking-tight text-slate-950 sm:text-[3.2rem] leading-[1.1]">
                Vom Wahrscheinlichkeitsmodell zur <span className="text-gradient-primary">Entscheidungsarchitektur</span>.
              </h1>
              <p className="max-w-[66ch] text-lg font-medium leading-relaxed text-slate-700">
                Diese Essayserie analysiert den strukturellen Übergang von deskriptivem RAG
                zu einer prüfbaren, graphbasierten Entscheidungslogik.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="max-w-[80ch] space-y-4 text-slate-600 sm:text-[1.05rem] leading-relaxed"
            >
              <p>
                Jeder Beitrag ist ein Baustein in einem integrierten Denkmodell.
                Der Argumentationsfluss beginnt im Problemraum klassischer RAG-Systeme,
                leitet die notwendige Struktur ab und definiert Qualitätskriterien
                für den produktiven Einsatz.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Gradient Divider */}
        <div className="mx-auto max-w-295 px-4 sm:px-6" aria-hidden>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
        </div>

        {/* Graph Surface */}
        <section className="space-y-4 py-8">
          <div className="mx-auto max-w-295 px-4 sm:px-6">
            <div className="glass-panel inline-flex items-center gap-4 rounded-xl px-5 py-3">
              <div className="space-y-0.5">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700">Argumentationsfluss</h2>
                <p className="text-sm text-slate-500 font-medium">Problemraum → Struktur → Qualität → Organisation → Positionierung</p>
              </div>
            </div>
          </div>
          <GraphEssaysSurface />
        </section>

        {/* Gradient Divider */}
        <div className="mx-auto max-w-295 px-4 sm:px-6" aria-hidden>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
        </div>

        {/* Flow Steps */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto w-full max-w-[1180px] space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-3"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Struktur des Arguments</p>
              <h2 className="text-[1.75rem] font-bold tracking-tight text-slate-900 sm:text-[2.25rem]">Vom Problem zur Position</h2>
              <p className="max-w-[72ch] text-[1.05rem] leading-relaxed text-slate-600 font-medium">
                Der Gedankengang folgt einer klaren Logik – von der Ausgangsfrage
                bis zur organisatorischen Einordnung. Jeder Schritt baut auf dem vorherigen auf.
              </p>
            </motion.div>

            {/* Step Cards with Connection Arrows */}
            <div className="flex flex-col md:grid md:grid-cols-3 lg:flex lg:flex-row lg:items-stretch gap-5 lg:gap-0">
              {FLOW_STEPS.map((flowStep, index) => (
                <Fragment key={flowStep.step}>
                  {/* Arrow connector between cards (desktop only) */}
                  {index > 0 ? (
                    <div className="hidden lg:flex items-center justify-center shrink-0 px-1.5" aria-hidden>
                      <div className="flex items-center gap-0.5 text-slate-400">
                        <div className="h-px w-4 bg-gradient-to-r from-slate-300 to-slate-400" />
                        <span className="text-xs">›</span>
                      </div>
                    </div>
                  ) : null}
                  <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.08 * index, ease: "easeOut" }}
                    className="glass-panel group flex flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(14,165,233,0.12)] hover:border-sky-300/50 lg:flex-1 lg:min-w-0"
                  >
                    <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100/60 text-[11px] font-black text-sky-700 group-hover:bg-sky-200/60 transition-colors">
                      {flowStep.step}
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">{flowStep.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{flowStep.description}</p>
                    <a
                      href={`/blog/${flowStep.slug}`}
                      className="mt-auto pt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-sky-700 hover:text-sky-900 transition-colors"
                    >
                      Essay lesen
                      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                    </a>
                  </motion.article>
                </Fragment>
              ))}
            </div>

            <p className="max-w-[66ch] text-sm leading-relaxed text-slate-500 font-medium">
              Der Argumentationspfad lässt sich chronologisch verfolgen –
              oder gezielt an dem Punkt einsteigen, der für Ihre aktuelle Architektur- oder Governance-Frage relevant ist.
            </p>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <TrackedLink
                href="/demo"
                label="Demo starten"
                eventName="blog_cta_click"
                payload={{ target: "/demo", surface: "blog-bottom-cta" }}
                className="inline-flex rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-sky-700 hover:-translate-y-0.5"
              />
              <TrackedLink
                href="/story/graphrag"
                label="Zur Architektur-Story"
                eventName="blog_cta_click"
                payload={{ target: "/story/graphrag", surface: "blog-bottom-secondary" }}
                className="inline-flex rounded-lg border border-slate-300 glass-panel px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              />
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
