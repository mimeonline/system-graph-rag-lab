import { AlertTriangle } from "lucide-react";

import { TrackedLink } from "@/components/molecules/tracked-link";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { DEMO_GRAPH_TYPES, type DemoGraphType } from "@/features/demo/graph-type-learning-model";
import { DemoGraphSimulationSvg } from "@/features/demo/molecules/DemoGraphSimulationSvg";

type GraphTypeDetailTemplateProps = {
  graphType: DemoGraphType;
  locale: "de" | "en";
};

export function GraphTypeDetailTemplate({
  graphType,
  locale,
}: GraphTypeDetailTemplateProps): React.JSX.Element {
  const currentIndex = DEMO_GRAPH_TYPES.findIndex((type) => type.id === graphType.id);
  const previousType = DEMO_GRAPH_TYPES[(currentIndex - 1 + DEMO_GRAPH_TYPES.length) % DEMO_GRAPH_TYPES.length];
  const nextType = DEMO_GRAPH_TYPES[(currentIndex + 1) % DEMO_GRAPH_TYPES.length];
  const Icon = graphType.icon;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white py-10 sm:py-14">
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-sky-50/60 via-white to-slate-50/80" />
          <div className="mx-auto w-full max-w-295 px-4 sm:px-6">
            <TrackedLink
              href="/demo"
              label={locale === "en" ? "← Back to overview" : "← Zur Übersicht"}
              eventName="demo_detail_back_click"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-sky-700"
            />

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.65fr)] lg:items-start">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
                    {graphType.number} · {graphType.badge}
                  </p>
                </div>
                <h1 className="headline-wrap mt-4 text-[2.25rem] font-bold leading-tight tracking-tight text-slate-950 sm:text-[3.2rem]">
                  {graphType.title}
                </h1>
                <p className="mt-5 max-w-3xl text-[1.05rem] font-medium leading-relaxed text-slate-700 sm:text-[1.15rem]">
                  {graphType.genericDefinition}
                </p>
              </div>

              <div className="glass-panel rounded-3xl p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {locale === "en" ? "Learning goal" : "Lernziel"}
                </p>
                <p className="mt-3 text-base font-semibold leading-relaxed text-slate-900">
                  {graphType.learningGoal}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Info cards */}
        <section className="mx-auto grid w-full max-w-295 gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.7fr)]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="border-b border-sky-100 bg-sky-50 px-6 py-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">
                  {locale === "en" ? "When this graph type helps" : "Wann dieser Graph-Typ grundsätzlich hilft"}
                </h2>
              </div>
              <ul className="space-y-3 p-6">
                {graphType.genericWhenUseful.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium leading-relaxed text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                      <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 8 8" aria-hidden>
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">
                  {locale === "en" ? "What is usually in the graph" : "Was typischerweise im Graph ist"}
                </h2>
              </div>
              <ul className="space-y-3 p-6">
                {graphType.genericGraphContents.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium leading-relaxed text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white">
              <div className="border-b border-violet-100 bg-violet-50 px-6 py-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-violet-700">
                  {locale === "en" ? "What the LLM uses it for" : "Wofür das LLM diesen Graph nutzt"}
                </h2>
              </div>
              <ul className="space-y-3 p-6">
                {graphType.genericLlmRole.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium leading-relaxed text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="overflow-hidden rounded-3xl border border-amber-200 bg-amber-50">
              <div className="flex items-center gap-2 border-b border-amber-200 px-6 py-4">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700">
                  {locale === "en" ? "Typical risk" : "Typisches Risiko"}
                </h2>
              </div>
              <p className="p-6 text-sm font-semibold leading-relaxed text-amber-900">{graphType.risk}</p>
            </section>
          </div>
        </section>

        {/* Simulation */}
        <section className="mx-auto grid w-full max-w-295 gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.7fr)]">
          <div className="glass-panel rounded-3xl p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {locale === "en" ? "EU AI Act example" : "EU-AI-Act-Beispiel"}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">{graphType.question}</h2>
              </div>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sky-700">
                Simulation
              </span>
            </div>
            <DemoGraphSimulationSvg
              graphType={{
                id: graphType.id,
                title: graphType.title,
                nodes: graphType.nodes,
                edges: graphType.edges,
              }}
              activeStepIndex={1}
            />
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                {locale === "en" ? "Applied to this demo" : "Auf diese Demo angewendet"}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-800">{graphType.detailIntro}</p>
            </section>
            <section className="overflow-hidden rounded-3xl border border-sky-200 bg-white">
              <div className="border-b border-sky-100 bg-sky-50 px-6 py-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">
                  {locale === "en" ? "EU AI Act specifics" : "EU-AI-Act-spezifisch"}
                </h2>
              </div>
              <ul className="space-y-3 p-6">
                {graphType.whenUseful.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium leading-relaxed text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                      <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 8 8" aria-hidden>
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>

        {/* Machine room trace */}
        <section className="mx-auto w-full max-w-295 px-4 pb-12 sm:px-6">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
              {locale === "en" ? "Inside the machine room" : "Blick in den Maschinenraum"}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              {locale === "en" ? "The black box opened as a trace" : "Die Blackbox als Trace geöffnet"}
            </h2>
            <p className="mt-3 text-base font-medium leading-relaxed text-slate-700">
              {locale === "en"
                ? "This is the didactic core: user input becomes system intent, graph context, LLM context, and finally an answer."
                : "Das ist der didaktische Kern: Aus Nutzereingabe werden System-Intent, Graphkontext, LLM-Kontext und schließlich eine Antwort."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="grid gap-4">
              {graphType.machineRoomTrace.map((trace, index) => (
                <article
                  key={`${trace.actor}-${trace.title}`}
                  className={[
                    "grid gap-3 rounded-2xl border p-4 sm:grid-cols-[8rem_minmax(0,1fr)]",
                    getTraceTone(trace.actor),
                  ].join(" ")}
                >
                  <div>
                    <span className="inline-flex h-8 min-w-16 items-center justify-center rounded-full bg-white/85 px-3 text-xs font-black uppercase tracking-[0.12em] text-slate-800 shadow-sm">
                      {index + 1}. {trace.actor}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950">{trace.title}</h3>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-800">{trace.message}</p>
                    <p className="mt-3 rounded-xl border border-white/70 bg-white/75 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                      {trace.artifact}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* User / Graph / LLM */}
        <section className="relative overflow-hidden py-12 sm:py-14">
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-slate-100/60 via-white/80 to-transparent" />
          <div className="mx-auto w-full max-w-295 px-4 sm:px-6">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
                {locale === "en" ? "Interaction model" : "Interaktionsmodell"}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                {locale === "en"
                  ? "What the user does, what the graph knows, what the LLM does"
                  : "Was der User macht, was im Graph ist, was das LLM macht"}
              </h2>
              <p className="mt-3 text-base font-medium leading-relaxed text-slate-700">
                {locale === "en"
                  ? "The important part is not the visual graph alone. The learning value comes from seeing how user intent, graph context, and LLM synthesis influence each other."
                  : "Wichtig ist nicht nur der sichtbare Graph. Der Lerneffekt entsteht, wenn sichtbar wird, wie Nutzerintention, Graphkontext und LLM-Synthese zusammenwirken."}
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <LearningBoxColumn
                title={locale === "en" ? "User" : "User"}
                subtitle={locale === "en" ? "Input and control" : "Eingabe und Steuerung"}
                boxes={graphType.userActions}
                accent="sky"
              />
              <LearningBoxColumn
                title={locale === "en" ? "Graph" : "Graph"}
                subtitle={locale === "en" ? "Structured context" : "Strukturierter Kontext"}
                boxes={graphType.graphContents}
                accent="emerald"
              />
              <LearningBoxColumn
                title="LLM"
                subtitle={locale === "en" ? "Reasoning and language" : "Synthese und Sprache"}
                boxes={graphType.llmActions}
                accent="violet"
              />
            </div>
          </div>
        </section>

        {/* Interaction loop + prompt package */}
        <section className="mx-auto grid w-full max-w-295 gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.65fr)]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
              {locale === "en" ? "Visible loop" : "Sichtbarer Ablauf"}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              {locale === "en" ? "How the LLM interacts with the graph" : "Wie das LLM mit dem Graph interagiert"}
            </h2>
            <div className="mt-6 grid gap-4">
              {graphType.interactionLoop.map((item, index) => (
                <div key={`${item.title}-${index}`} className="grid gap-3 sm:grid-cols-[3rem_minmax(0,1fr)] sm:items-start">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
              {locale === "en" ? "Prompt package" : "Prompt-Paket"}
            </p>
            <h2 className="mt-3 text-2xl font-bold">
              {locale === "en" ? "What enters the LLM context" : "Was ins LLM-Kontextfenster geht"}
            </h2>
            <ul className="mt-5 space-y-3">
              {graphType.promptPackage.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-medium leading-relaxed text-slate-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 8 8" aria-hidden>
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/10 pt-4 text-sm font-semibold leading-relaxed text-slate-400">
              {locale === "en"
                ? "The LLM does not browse the whole graph. It receives a selected, structured context package and must answer inside that boundary."
                : "Das LLM durchsucht nicht den gesamten Graph. Es bekommt ein ausgewähltes, strukturiertes Kontextpaket und muss innerhalb dieser Grenze antworten."}
            </p>
          </div>
        </section>

        {/* Simulated steps */}
        <section className="mx-auto w-full max-w-295 px-4 pb-12 sm:px-6 sm:pb-16">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
              {locale === "en" ? "Observation" : "Observation"}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              {locale === "en" ? "The simulated intermediate steps" : "Die simulierten Zwischenschritte"}
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {graphType.steps.map((step, index) => (
              <article key={step.label} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="h-1 bg-sky-500" />
                <div className="p-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-sky-700">
                    {index + 1}
                  </span>
                  <h2 className="mt-4 text-lg font-bold text-slate-950">{step.label}</h2>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">{step.detail}</p>
                  <p className="mt-4 border-l-2 border-sky-500 pl-3 text-sm font-semibold leading-relaxed text-slate-800">
                    {step.observation}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <nav className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <TrackedLink
              href={`/demo/${previousType.slug}`}
              label={`← ${previousType.title}`}
              eventName="demo_detail_previous_click"
              payload={{ graphType: previousType.id }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            />
            <TrackedLink
              href={`/demo/${nextType.slug}`}
              label={`${nextType.title} →`}
              eventName="demo_detail_next_click"
              payload={{ graphType: nextType.id }}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
            />
          </nav>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function getTraceTone(actor: "User" | "System" | "Graph" | "LLM"): string {
  if (actor === "User") {
    return "border-sky-200 bg-sky-50";
  }
  if (actor === "System") {
    return "border-slate-200 bg-slate-50";
  }
  if (actor === "Graph") {
    return "border-emerald-200 bg-emerald-50";
  }

  return "border-violet-200 bg-violet-50";
}

const ACCENT_CLASSES = {
  sky: {
    wrapper: "border-sky-200",
    header: "border-b border-sky-100 bg-sky-50",
    label: "text-sky-600",
    title: "text-sky-950",
    dot: "bg-sky-500",
  },
  emerald: {
    wrapper: "border-emerald-200",
    header: "border-b border-emerald-100 bg-emerald-50",
    label: "text-emerald-700",
    title: "text-emerald-950",
    dot: "bg-emerald-500",
  },
  violet: {
    wrapper: "border-violet-200",
    header: "border-b border-violet-100 bg-violet-50",
    label: "text-violet-700",
    title: "text-violet-950",
    dot: "bg-violet-500",
  },
} as const;

function LearningBoxColumn({
  title,
  subtitle,
  boxes,
  accent,
}: {
  title: string;
  subtitle: string;
  boxes: Array<{ title: string; body: string }>;
  accent: keyof typeof ACCENT_CLASSES;
}): React.JSX.Element {
  const cls = ACCENT_CLASSES[accent];
  return (
    <section className={`overflow-hidden rounded-3xl border bg-white ${cls.wrapper}`}>
      <div className={`px-5 py-4 ${cls.header}`}>
        <p className={`text-xs font-bold uppercase tracking-[0.16em] ${cls.label}`}>{subtitle}</p>
        <h3 className={`mt-1 text-2xl font-bold ${cls.title}`}>{title}</h3>
      </div>
      <div className="space-y-3 p-5">
        {boxes.map((box) => (
          <article key={box.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start gap-2">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cls.dot}`} />
              <h4 className="text-base font-bold text-slate-950">{box.title}</h4>
            </div>
            <p className="mt-2 pl-4 text-sm font-medium leading-relaxed text-slate-700">{box.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
