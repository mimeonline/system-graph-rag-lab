import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { ExecutiveHeroGraph } from "@/features/landing/molecules/ExecutiveHeroGraph";
import { LandingReveal } from "@/features/landing/molecules/LandingReveal";
import * as motion from "framer-motion/client";
import { getLocale } from "next-intl/server";

export async function ExecutiveLandingTemplate(): Promise<React.JSX.Element> {
  const locale = await getLocale();
  const isEn = locale === "en";

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-900">
      <TrackedPageView page="/" />
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-295 space-y-16">
          <LandingReveal>
            <section className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600"
              >
                Executive Lab
              </motion.p>

              <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="min-w-0 space-y-6 text-left"
                >
                  <h1 className="headline-wrap max-w-full text-[1.85rem] font-bold tracking-tight text-slate-950 sm:max-w-[16ch] sm:text-[3rem] leading-[1.08]">
                    {isEn ? (
                      <>
                        Decision<wbr /> capability
                        <br />
                        through <span className="text-gradient-primary">structure</span>.
                      </>
                    ) : (
                      <>
                        Entscheidungs<wbr />fähigkeit
                        <br />
                        durch <span className="text-gradient-primary">Struktur</span>.
                      </>
                    )}
                  </h1>
                  <p className="max-w-[65ch] text-[1.125rem] leading-relaxed text-slate-700 font-medium">
                    {isEn
                      ? "GraphRAG makes AI reasoning reviewable. Evidence, relations, and the reasoning path become visible architecture for decisions that can be defended."
                      : "GraphRAG macht KI-Herleitung prüfbar. Belege, Beziehungen und Ableitungspfad werden sichtbare Architektur – für Entscheidungen, die verteidigt werden können."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <TrackedLink
                      href="/demo"
                      label={isEn ? "Open demo" : "Demo starten"}
                      eventName="landing_cta_click"
                      payload={{ target: "/demo", surface: "hero-primary" }}
                      className="inline-flex rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-sky-700 hover:-translate-y-0.5"
                    />
                    <TrackedLink
                      href="#rag-vs-graphrag"
                      label="RAG vs GraphRAG"
                      eventName="landing_cta_click"
                      payload={{
                        target: "#rag-vs-graphrag",
                        surface: "hero-secondary",
                      }}
                      className="inline-flex rounded-lg border border-slate-300 glass-panel px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200/60">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {isEn ? "Reviewable value:" : "Prüfbarer Mehrwert:"}
                    </p>
                    <ul className="space-y-2 text-sm font-medium text-slate-700">
                      <li className="flex items-center gap-2.5">
                        <div className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>{isEn ? "Explicit control over context boundaries" : "Explizite Kontrolle über die Kontextgrenzen"}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <div className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>{isEn ? "Visible evidence paths from document to answer" : "Sichtbare Belegpfade vom Dokument zur Antwort"}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <div className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>{isEn ? "Stable argumentation across iterative follow-up questions" : "Stabile Argumentation bei iterativen Nachfragen"}</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <div className="w-full max-w-140 self-start justify-self-center rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 sm:p-5 lg:justify-self-end">
                  <ExecutiveHeroGraph />
                </div>
              </div>
            </section>
          </LandingReveal>

          <LandingReveal>
            <section className="full-bleed-safe relative border-y border-slate-200/50 bg-slate-50/50 py-16 sm:py-20">
              <div className="mx-auto w-full max-w-295 space-y-8 px-4 sm:px-6">
                <div className="space-y-3">
                  <h2 className="headline-wrap text-[1.5rem] font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
                    {isEn ? "What you will find here" : "Was Dich hier erwartet"}
                  </h2>
                  <p className="max-w-[88ch] text-[1.05rem] leading-relax text-slate-700 font-medium">
                    {isEn
                      ? "This lab is not a product pitch. It is an open architecture exploration showing how probabilistic models become decision-capable through structural embedding."
                      : "Dieses Lab ist kein Produkt-Pitch. Es ist eine offene Architektur-Exploration, die zeigt, wie Wahrscheinlichkeitsmodelle durch strukturelle Einbettung entscheidungsfähig werden."}
                  </p>
                  <p className="max-w-[88ch] text-[1.05rem] leading-relax text-slate-700">
                    {isEn
                      ? "As a live demo, concept space, and essay collection, start where the learning value for your architecture or governance questions is highest."
                      : "Als Live-Demo, Konzeptraum und Essay-Sammlung – steige dort ein, wo der Erkenntnisgewinn für deine Architektur- oder Governance-Fragen am größten ist."}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <TrackedLink
                    href="/demo"
                    label="Demo"
                    eventName="landing_section_click"
                    payload={{
                      target: "/demo",
                      surface: "what-to-expect-demo",
                    }}
                    className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/5"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100/50 text-sky-600">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {isEn ? "Operational demo" : "Operative Demo"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium">
                      {isEn
                        ? "Watch in real time how context and evidence are turned into a resilient decision path."
                        : "Beobachte in Echtzeit, wie aus Kontext und Belegen ein belastbarer Entscheidungsweg verarbeitet wird."}
                    </p>
                  </TrackedLink>
                  <TrackedLink
                    href="/story/graphrag"
                    label="GraphRAG Story"
                    eventName="landing_section_click"
                    payload={{
                      target: "/story/graphrag",
                      surface: "what-to-expect-story",
                    }}
                    className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/5"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100/50 text-indigo-600">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {isEn ? "Architecture story" : "Architektur Story"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium">
                      {isEn
                        ? "Compare the three-state model and see why structure beats probability."
                        : "Drei-Zustände-Modell im Vergleich: Verstehe, warum Struktur Wahrscheinlichkeit schlägt."}
                    </p>
                  </TrackedLink>
                  <TrackedLink
                    href="/essay"
                    label="Graph Essays"
                    eventName="landing_section_click"
                    payload={{
                      target: "/essay",
                      surface: "what-to-expect-essays",
                    }}
                    className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/5"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100/50 text-teal-600">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {isEn ? "System essays" : "System Essays"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium">
                      {isEn
                        ? "Deeper analyses on data governance, quality assurance, and systematic LLM limits."
                        : "Vertiefte Analysen zu Daten-Governance, Qualitätssicherung und systematischen LLM-Limitierungen."}
                    </p>
                  </TrackedLink>
                </div>
              </div>
            </section>
          </LandingReveal>

          <LandingReveal>
            <section className="full-bleed-safe relative py-16 sm:py-20">
              <div className="mx-auto w-full max-w-295 space-y-8 px-4 sm:px-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {isEn ? "System boundary" : "Systemische Grenze"}
                  </p>
                  <h2 className="headline-wrap text-[1.5rem] font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
                    {isEn ? "Why pure LLM answers are not enough" : "Warum reine LLM-Antworten nicht ausreichen"}
                  </h2>
                  <p className="max-w-[75ch] text-[1.05rem] text-slate-700 font-medium">
                    {isEn
                      ? "Models provide plausibility, not reviewability. Without visible reasoning, a decision cannot be owned or scaled."
                      : "Modelle liefern Plausibilität, keine Prüfbarkeit. Ohne sichtbare Herleitung kann eine Entscheidung nicht verantwortet oder skaliert werden."}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm font-black">
                        X
                      </span>
                      {isEn ? "Status quo (LLM-only)" : "Status Quo (LLM-only)"}
                    </h3>
                    <ul className="mt-5 space-y-3.5 text-sm text-slate-700 font-medium">
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>
                          {isEn ? "The reasoning path remains a black box (implicit)" : "Der Argumentationspfad bleibt eine Blackbox (implizit)"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>
                          {isEn ? "Source references are often loose, generic, or hallucinated" : "Quellenbezüge sind oft lose, generisch oder halluziniert"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>
                          {isEn ? "Under follow-up questions the rationale drifts or contradicts itself" : "Bei Nachfragen driftet die Begründung oder widerspricht sich"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>
                          {isEn ? "Decisions rely on text probability instead of structure" : "Entscheidungen beruhen auf Textwahrscheinlichkeit statt auf Struktur"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-600 text-sm font-black">
                        ✓
                      </span>
                      {isEn ? "GraphRAG architecture" : "GraphRAG Architektur"}
                    </h3>
                    <ul className="mt-5 space-y-3.5 text-sm text-slate-700 font-medium">
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>
                          {isEn ? "Relevant concepts and their relations are modeled explicitly (knowledge graph)" : "Relevante Konzepte und deren Beziehungen sind explizit modelliert (Wissensgraph)"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>
                          {isEn ? "Evidence paths stay traceable as explicit chains" : "Belegpfade sind als klare Ketten nachvollziehbar"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>
                          {isEn ? "The logic remains consistent across iterative follow-up questions" : "Die Logik bleibt auch bei iterativen Anschlussfragen konsistent"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>
                          {isEn ? "Decisions become auditable instead of merely highly plausible" : "Entscheidungen sind auditierbar statt nur hochplausibel"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-[0.95rem] font-medium text-slate-600 max-w-3xl">
                  {isEn
                    ? "For exploratory questions and brainstorming, LLM-only is often enough. For critical architecture assessments or strategic product decisions, visible structure and control are required."
                    : "Für explorative Fragen und Brainstorming reicht LLM-only oft aus. Für kritische Architekturabschätzungen oder strategische Produktentscheidungen braucht es jedoch sichtbare Struktur und Kontrolle."}
                </p>
              </div>
            </section>
          </LandingReveal>

          <LandingReveal>
            <section
              id="rag-vs-graphrag"
              className="full-bleed-safe relative bg-slate-50 py-16 sm:py-20"
            >
              <div className="mx-auto w-full max-w-295 space-y-8 px-4 sm:px-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {isEn ? "Method comparison" : "Methodik-Vergleich"}
                  </p>
                  <h2 className="headline-wrap text-[1.5rem] font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
                    {isEn ? "RAG gives hits. GraphRAG gives reasoning." : "RAG liefert Treffer. GraphRAG liefert Herleitung."}
                  </h2>
                  <p className="max-w-[75ch] text-[1.05rem] text-slate-700 font-medium">
                    {isEn
                      ? "Not more context, but visible justification: a direct comparison of auditability."
                      : "Nicht mehr Kontext, sondern sichtbare Begründung: Ein direkter Vergleich der Auditierbarkeit."}
                  </p>
                </div>
                <div className="overflow-hidden rounded-2xl glass-panel">
                  <div className="overflow-x-auto">
                    <table className="min-w-[640px] w-full text-left text-sm">
                    <thead className="bg-slate-100/50">
                      <tr className="text-slate-600">
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">
                          {isEn ? "Dimension" : "Dimension"}
                        </th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">
                          {isEn ? "Standard RAG" : "Standard RAG"}
                        </th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-sky-700">
                          {isEn ? "System GraphRAG" : "System GraphRAG"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 text-slate-700 font-medium">
                      <tr className="transition-colors hover:bg-white/40">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {isEn ? "Auditability" : "Auditierbarkeit"}
                        </td>
                        <td className="px-6 py-4">
                          {isEn ? "Sources are often loose, reasoning stays implicit" : "Quellen oft lose, Herleitung bleibt implizit"}
                        </td>
                        <td className="px-6 py-4 text-sky-900">
                          {isEn ? "Evidence paths explicit, decisions reviewable" : "Belegpfade explizit, Entscheidung prüfbar"}
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-white/40">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {isEn ? "Stability under follow-ups" : "Stabilität bei Nachfragen"}
                        </td>
                        <td className="px-6 py-4">
                          {isEn ? "Drifts more often on connected questions" : "Driftet häufiger bei vernetzten Fragen"}
                        </td>
                        <td className="px-6 py-4 text-sky-900">
                          {isEn ? "More stable through structured relations" : "Stabiler durch strukturierte Beziehungen"}
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-white/40">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {isEn ? "Decision capability" : "Entscheidungsfähigkeit"}
                        </td>
                        <td className="px-6 py-4">
                          {isEn ? "Answer hidden in prose" : "Antwort verborgen in Fließtext"}
                        </td>
                        <td className="px-6 py-4 text-sky-900 font-semibold">
                          {isEn ? "Reasoning as a path, directly translatable into action" : "Ableitung als Pfad, direkt übersetzbar"}
                        </td>
                      </tr>
                    </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900">
                      {isEn ? "RAG is enough when" : "RAG reicht, wenn"}
                    </h3>
                    <ul className="mt-5 space-y-3.5 text-sm text-slate-700 font-medium">
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>
                          {isEn ? "Questions are mostly document-centric and linear" : "Fragen primär dokumentzentriert und linear sind"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>
                          {isEn ? "You mainly need prose summaries" : "Du vor allem fließtextbasierte Zusammenfassungen benötigst"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>
                          {isEn ? "Strict audit evidence is not a hard requirement" : "Ein harter Audit-Nachweis keine zwingende Anforderung ist"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900">
                      {isEn ? "GraphRAG is required when" : "GraphRAG ist Pflicht, wenn"}
                    </h3>
                    <ul className="mt-5 space-y-3.5 text-sm text-slate-700 font-medium">
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>
                          {isEn ? "Cause chains, dependencies, or trade-offs are central" : "Ursachenketten, Abhängigkeiten oder Trade-offs zentral sind"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>
                          {isEn ? "Stakeholders need to visualize and audit the reasoning" : "Stakeholder die Herleitung visualisieren und auditieren wollen"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span>
                          {isEn ? "The argument must stay consistent across multiple follow-ups" : "Die Argumentation über mehrere Follow-ups konsistent bleiben muss"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </LandingReveal>

          <LandingReveal>
            <section className="full-bleed-safe relative bg-white py-20 sm:py-28">
              <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
                <div className="text-center space-y-8 glass-panel rounded-3xl p-10 sm:p-14 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-sky-50/50 to-indigo-50/50 -z-10" />
                  <h2 className="headline-wrap mx-auto max-w-[20ch] text-[1.75rem] font-bold tracking-tight text-slate-900 sm:text-[2.25rem] leading-tight">
                    {isEn ? "From plausible answers to " : "Von plausiblen Antworten zu "}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-indigo-600">
                      {isEn ? "reviewable decisions." : "prüfbaren Entscheidungen."}
                    </span>
                  </h2>
                  <p className="mx-auto max-w-[50ch] text-[1.125rem] leading-relaxed text-slate-600 font-medium">
                    {isEn
                      ? "Open the demo and follow live how context nodes, evidence, and the reasoning path work together."
                      : "Öffne die Demo und verfolge live, wie Kontextknoten, Belege und Ableitungspfad strukturiert zusammenspielen."}
                  </p>
                  <div className="pt-4">
                    <TrackedLink
                      href="/demo"
                      label={isEn ? "Open demo" : "Demo starten"}
                      eventName="landing_cta_click"
                      payload={{ target: "/demo", surface: "closing-cta" }}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-sky-600 hover:-translate-y-1 hover:shadow-sky-600/30"
                    />
                  </div>
                </div>
              </div>
            </section>
          </LandingReveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
