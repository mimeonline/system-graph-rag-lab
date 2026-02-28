import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import type { BlogPostSummary } from "@/features/blog/contracts";
import { GraphEssaysSurface } from "@/features/blog/organisms/GraphEssaysSurface";

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
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <TrackedPageView page="/blog" />
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-295 px-4 py-8 sm:px-6 sm:py-10">
          <div className="space-y-4">
            <h1 className="max-w-[20ch] text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.4rem]">Graph Essays</h1>
            <p className="max-w-[66ch] text-base leading-7 text-slate-700">
              Wie aus KI-Antworten belastbare Entscheidungen werden.
            </p>
            <p className="max-w-[76ch] text-sm leading-7 text-slate-600 sm:text-base">
              Die Beiträge sind als zusammenhängender Gedankengang dargestellt – vom Problem bis zur Einordnung. Jeder Knoten steht für einen wichtigen Schritt im Argument.
            </p>
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

            <div className="grid gap-4 md:grid-cols-5">
              {FLOW_STEPS.map((flowStep) => (
                <article
                  key={flowStep.step}
                  className="flex h-full flex-col rounded-xl border border-slate-200 bg-white/90 p-4 text-slate-900"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Schritt {flowStep.step}
                  </p>
                  <h3 className="mt-2 text-base font-semibold tracking-tight">{flowStep.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{flowStep.description}</p>
                  <a
                    href={`/blog/${flowStep.slug}`}
                    className="mt-auto pt-4 inline-flex text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900 hover:decoration-slate-500"
                  >
                    Zum Essay
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
