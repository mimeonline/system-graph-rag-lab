import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import type { BlogPostSummary } from "@/features/blog/contracts";
import { GraphEssaysSurface } from "@/features/blog/organisms/GraphEssaysSurface";
import * as motion from "framer-motion/client";

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
    description: "Warum reine KI-Antworten nicht ausreichen",
    slug: "warum-ki-antworten-fuer-entscheidungen-nicht-ausreichen",
  },
  {
    step: "02",
    title: "Struktur",
    description: "Was GraphRAG strukturell anders macht",
    slug: "was-graphrag-strukturell-anders-macht-als-klassisches-rag",
  },
  {
    step: "03",
    title: "Qualität",
    description: "Welche Kriterien ein produktives System erfüllen muss",
    slug: "qualitaetskriterien-fuer-ein-produktives-graphrag-system",
  },
  {
    step: "04",
    title: "Organisation",
    description: "Wie GraphRAG als Entscheidungs-Interface wirkt",
    slug: "graphrag-als-entscheidungs-interface-fuer-organisationen",
  },
  {
    step: "05",
    title: "Positionierung",
    description: "Von plausiblen Antworten zu prüfbaren Entscheidungen",
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
        <section className="mx-auto w-full max-w-295 px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-6">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600"
            >
              Systemische Praxis
            </motion.p>
            <div className="space-y-5">
            <h1 className="max-w-[32ch] text-[2.5rem] font-bold tracking-tight text-slate-950 sm:text-[3.2rem]">
              Systemische Praxis
            </h1>
            <p className="max-w-[66ch] text-lg font-medium leading-relaxed text-slate-800">
              Vom deskriptiven RAG zur prüfbaren Entscheidungsarchitektur.
            </p>
            <div className="max-w-[80ch] space-y-4 text-slate-600 sm:text-lg leading-relaxed">
              <p>
                Diese Essayserie dokumentiert den Weg von probabilistischer Textverdichtung hin zu einer deterministischen Entscheidungslogik. Wir betrachten GraphRAG nicht als Feature, sondern als strukturelle Infrastruktur für Governance und Nachvollziehbarkeit.
              </p>
              <p>
                Jeder Beitrag ist ein Baustein in einem integrierten Denkmodell: Wir analysieren den Problemraum klassischer RAG-Systeme, leiten die notwendige Struktur ab und definieren Qualitätskriterien für den produktiven Einsatz.
              </p>
            </div>
          </div>
        </div>
      </section>

        <section className="space-y-3 pb-2">
          <div className="mx-auto flex w-full max-w-295 items-end justify-between gap-4 px-4 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Argumentationsfluss</h2>
            <p className="text-xs text-slate-500">Problemraum → Struktur → Qualität → Organisation → Positionierung</p>
          </div>
          <GraphEssaysSurface />
        </section>

        <section className="bg-slate-50 px-4 py-20 text-slate-900 sm:px-6">
          <div className="mx-auto w-full max-w-[1100px] space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">Vom Problem zur Position</h2>
              <p className="max-w-[72ch] text-sm leading-7 text-slate-600 sm:text-base">
                Der Gedankengang folgt einer klaren Logik – von der Ausgangsfrage bis zur Einordnung.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-5">
              {FLOW_STEPS.map((flowStep) => (
                <article
                  key={flowStep.step}
                  className="glass-panel group flex h-full flex-col p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 group-hover:text-sky-600 transition-colors">
                    Schritt {flowStep.step}
                  </p>
                  <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900">{flowStep.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{flowStep.description}</p>
                  <a
                    href={`/blog/${flowStep.slug}`}
                    className="mt-auto pt-6 inline-flex text-xs font-bold uppercase tracking-[0.14em] text-sky-700 hover:text-sky-900 transition-colors"
                  >
                    Essay lesen →
                  </a>
                </article>
              ))}
            </div>

            <p className="text-sm leading-7 text-slate-500">
              Du kannst den Gedankengang chronologisch lesen –<br />
              oder direkt an dem Punkt einsteigen, der dich aktuell beschäftigt.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
