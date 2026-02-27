"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { TrackedLink } from "@/components/molecules/tracked-link";
import { TrackedPageView } from "@/components/molecules/tracked-page-view";
import { trackLiteEvent } from "@/lib/analytics-lite";
import type { StoryStep } from "@/features/story/contracts";

const GraphRagJourney3D = dynamic(
  () => import("@/features/story/organisms/GraphRagJourney3D").then((m) => m.GraphRagJourney3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">
        Data Journey lädt...
      </div>
    ),
  },
);

const STORY_STEPS: StoryStep[] = [
  {
    id: "problem",
    title: "1. Problem klarmachen",
    stepHeadline: "Schritt 1: Das eigentliche Problem scharfstellen",
    stepSubline: "Bevor wir Daten ziehen, klären wir, worum es wirklich geht. Das reduziert Missverständnisse von Anfang an.",
    goal: "Alltag: Alle reden über das gleiche Thema, aber jeder meint etwas anderes.",
    visualState: "problem",
    scenePreset: "isolated-problem",
    camera: { x: 0, y: 0.2, z: 5.9 },
    motionClip: "/images/story/problem-loop.gif",
    tokenState: "raw",
    highlightNodes: ["q"],
    animationMode: "pulse",
    overlayNotes: [
      "Ein einzelner Token startet im Rauschfeld.",
      "Viele Wege sind sichtbar, aber keiner stabil genug.",
      "Der Token driftet ohne verlässliche Struktur zurück.",
    ],
    narration:
      "Wir starten mit einer echten Team-Situation: viel Meinung, wenig gemeinsame Definition. Der erste Schritt ist deshalb: Problem sauber schneiden.",
    problemStatement: "Kennst du: Viele Rückfragen, weil unklar ist, was die eigentliche Kernfrage ist.",
    modelChange: "Die Frage wird so formuliert, dass später nur passender Kontext überhaupt in Frage kommt.",
    valueStatement: "Du sparst Schleifen, weil alle über dasselbe Problem sprechen.",
    edgeLegend: [
      { type: "noise", color: "#94a3b8", label: "Kontextrauschen ohne stabile Relevanz" },
      { type: "question", color: "#3b82f6", label: "Frageknoten als Startpunkt" },
    ],
    llmInputPreview: {
      nodes: ["Frage"],
      edges: ["Unscharfe Verknüpfungen"],
      budget: "~20 Tokens",
    },
    beforeAfter: {
      llmOnly: "Ohne Graph bleibt die Frage oft zu breit, die Antwort klingt gut, trifft aber nicht.",
      graphRag: "Mit Graph wird der Problemraum zuerst begrenzt, dadurch wird die Antwort treffsicherer.",
    },
    references: [{ label: "Question Framing", href: "https://en.wikipedia.org/wiki/Question" }],
  },
  {
    id: "retrieval",
    title: "2. Relevanten Kontext einsammeln",
    stepHeadline: "Schritt 2: Wichtiges vom Rauschen trennen",
    stepSubline: "Jetzt wählen wir nur den Kontext aus, der zur Frage passt. So bleibt der Fokus hoch und die Antwort stabil.",
    goal: "Alltag: Zu viele Infos, aber nur ein kleiner Teil hilft wirklich weiter.",
    visualState: "retrieval",
    scenePreset: "scored-retrieval",
    camera: { x: 0, y: 0.15, z: 6.2 },
    motionClip: "/images/story/retrieval-loop.gif",
    tokenState: "filtered",
    highlightNodes: ["r1", "r2", "r3"],
    animationMode: "flow",
    overlayNotes: [
      "Drei Gates öffnen nur für hochrelevante Treffer.",
      "Nicht passende Kandidaten bleiben sichtbar, aber gedimmt.",
      "Der Token nimmt den höchsten Score-Pfad.",
    ],
    narration:
      "Statt alles zu laden, zieht GraphRAG nur die stärksten Treffer und deren direkte Nachbarn in den Kontext.",
    problemStatement: "Kennst du: Man liest 20 Dinge und ist danach weniger klar als vorher.",
    modelChange: "Scoring + Hop-Logik sortieren Wichtiges nach vorne und blenden Nebenspuren aus.",
    valueStatement: "Du bekommst schneller einen belastbaren Überblick statt Datenmüll.",
    edgeLegend: [
      { type: "relevance", color: "#38bdf8", label: "Relevanzpfad Frage -> Top-Knoten" },
      { type: "discarded", color: "#cbd5e1", label: "Ausgeblendete Niedrig-Scorer" },
    ],
    llmInputPreview: {
      nodes: ["Frage", "Top-Knoten A", "Top-Knoten B", "Top-Knoten C"],
      edges: ["3 Relevanzkanten"],
      budget: "~55 Tokens",
    },
    beforeAfter: {
      llmOnly: "Ohne Graph landet oft zu viel gemischter Kontext im Prompt.",
      graphRag: "Mit Graph gehen nur Top-Treffer und relevante Nachbarn weiter.",
    },
    references: [{ label: "Retrieval-augmented generation", href: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" }],
  },
  {
    id: "graph",
    title: "3. Zusammenhänge sichtbar machen",
    stepHeadline: "Schritt 3: Beziehungen statt Einzelinfos verstehen",
    stepSubline: "Hier zeigt der Graph, was was beeinflusst. Dadurch werden Ursacheketten und Nebenwirkungen greifbar.",
    goal: "Alltag: Ursache und Wirkung werden oft verwechselt, wenn man nur Einzelinfos sieht.",
    visualState: "graph",
    scenePreset: "relational-graph",
    camera: { x: 0.2, y: 0.2, z: 6.3 },
    motionClip: "/images/story/graph-loop.gif",
    tokenState: "linked",
    highlightNodes: ["r1", "r2", "r3", "e1", "e2"],
    animationMode: "orbit",
    overlayNotes: [
      "Top-Knoten verbinden sich mit Belegen und Ursache-Kanten.",
      "Der Token springt entlang 1-2 Hops durch den Subgraph.",
      "Die Beziehungslogik wird sichtbar statt implizit.",
    ],
    narration:
      "Hier kommt der eigentliche GraphRAG-Vorteil: nicht nur Inhalte, sondern die Beziehungen zwischen den Inhalten werden genutzt.",
    problemStatement: "Kennst du: Ein Team optimiert lokal und woanders wird es dadurch schlechter.",
    modelChange: "Der Graph zeigt direkt, welche Knoten sich beeinflussen und über welche Kanten.",
    valueStatement: "Du erkennst Nebenwirkungen früher und triffst robustere Entscheidungen.",
    edgeLegend: [
      { type: "relevance", color: "#60a5fa", label: "Frage -> Konzept-Relevanz" },
      { type: "evidence", color: "#22c55e", label: "Konzept -> Beleg-Kante" },
      { type: "causal", color: "#a78bfa", label: "Konzept -> Konzept-Wirkbezug" },
    ],
    llmInputPreview: {
      nodes: ["Frage", "3 Konzepte", "2 Evidenzen"],
      edges: ["Relevanz", "Beleg", "Kausal"],
      budget: "~95 Tokens",
    },
    beforeAfter: {
      llmOnly: "Ohne Graph erklärt das Modell oft nur Symptome.",
      graphRag: "Mit Graph siehst du Ursacheketten und Belegpfade.",
    },
    references: [{ label: "Knowledge graph", href: "https://en.wikipedia.org/wiki/Knowledge_graph" }],
  },
  {
    id: "synthesis",
    title: "4. Sauber ins LLM übergeben",
    stepHeadline: "Schritt 4: Kontext kontrolliert in die Synthese geben",
    stepSubline: "Das LLM bekommt ein klares, begrenztes Paket. Damit wird die Antwort nachvollziehbar statt Blackbox.",
    goal: "Alltag: Gute Antworten brauchen einen klaren, kontrollierten Input.",
    visualState: "synthesis",
    scenePreset: "context-synthesis",
    camera: { x: 0, y: 0.1, z: 6 },
    motionClip: "/images/story/synthesis-loop.gif",
    tokenState: "synthesized",
    highlightNodes: ["ctx1", "ctx2", "ctx3", "out"],
    animationMode: "flow",
    overlayNotes: [
      "Der Token wird in drei Kontext-Pakete aufgeteilt.",
      "Pakete fließen geordnet in den LLM-Container.",
      "Ein konsolidierter Output-Token verlässt das Modell.",
    ],
    narration:
      "Der Input wird jetzt als nachvollziehbares Paket übergeben: welche Nodes, welche Kanten, welches Budget.",
    problemStatement: "Kennst du: Gleiche Frage, aber jedes Mal eine andere Antwortqualität.",
    modelChange: "Der Kontext wird standardisiert und kontrolliert in das Modell eingespeist.",
    valueStatement: "Antworten werden konsistenter und ihre Herkunft bleibt nachvollziehbar.",
    edgeLegend: [
      { type: "context-flow", color: "#22d3ee", label: "Kontextfluss in das LLM" },
      { type: "output-flow", color: "#34d399", label: "LLM -> Antwort-Prototyp" },
    ],
    llmInputPreview: {
      nodes: ["Kontextpaket 1", "Kontextpaket 2", "Kontextpaket 3"],
      edges: ["3 Input-Flows", "1 Output-Flow"],
      budget: "~130 Tokens",
    },
    beforeAfter: {
      llmOnly: "Ohne Graph bleibt oft unklar, was genau im Prompt gelandet ist.",
      graphRag: "Mit Graph ist der Input explizit und damit prüfbar.",
    },
    references: [{ label: "Prompt engineering", href: "https://en.wikipedia.org/wiki/Prompt_engineering" }],
  },
  {
    id: "decision",
    title: "5. In klare nächste Schritte übersetzen",
    stepHeadline: "Schritt 5: Von Analyse zu Handlung kommen",
    stepSubline: "Am Ende wird aus Komplexität ein klarer nächster Schritt, den du im Alltag direkt umsetzen kannst.",
    goal: "Alltag: Am Ende zählt, ob du weißt, was du morgen konkret tun sollst.",
    visualState: "decision",
    scenePreset: "decision-subgraph",
    camera: { x: 0.15, y: 0.2, z: 5.8 },
    motionClip: "/images/story/decision-loop.gif",
    tokenState: "actionable",
    highlightNodes: ["a1", "a2", "a3", "action"],
    animationMode: "focus",
    overlayNotes: [
      "Der finale Token landet im Action-Knoten.",
      "Nur entscheidungsrelevante Teile des Graphen bleiben aktiv.",
      "Ein Pulse markiert den nächsten konkreten Schritt.",
    ],
    narration:
      "Der letzte Schritt reduziert Komplexität auf eine handhabbare Entscheidung mit klarer Begründung.",
    problemStatement: "Kennst du: Gute Analyse, aber danach trotzdem keine klare Priorität.",
    modelChange: "Aus der Herleitung wird ein fokussierter Entscheidungs-Subgraph mit Handlungspfad.",
    valueStatement: "Du gehst mit einem konkreten nächsten Schritt raus, nicht mit einem langen Fließtext.",
    edgeLegend: [
      { type: "decision-path", color: "#22c55e", label: "Pfad zur nächsten Aktion" },
      { type: "supporting-link", color: "#60a5fa", label: "Stützende Herleitungskanten" },
    ],
    llmInputPreview: {
      nodes: ["Antwortkern", "Priorisierte Aktionen", "Risiko-Hinweise"],
      edges: ["2 Entscheidungswege", "1 Priorisierungspfad"],
      budget: "~145 Tokens",
    },
    beforeAfter: {
      llmOnly: "Ohne Graph endet es oft bei allgemeinen Tipps.",
      graphRag: "Mit Graph bekommst du priorisierte Maßnahmen mit nachvollziehbarer Herleitung.",
    },
    references: [{ label: "Decision-making", href: "https://en.wikipedia.org/wiki/Decision-making" }],
    cta: { label: "Zur Live-Demo", href: "/" },
  },
];

export function GraphRagStoryTemplate(): React.JSX.Element {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [compareMode, setCompareMode] = useState<"llmOnly" | "graphRag">("graphRag");
  const activeStep = STORY_STEPS[activeStepIndex] ?? STORY_STEPS[0];

  const progress = useMemo(() => ((activeStepIndex + 1) / STORY_STEPS.length) * 100, [activeStepIndex]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-slate-900">
      <TrackedPageView page="/story/graphrag" />
      <SiteHeader />
      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto w-full max-w-[1180px] space-y-4">
          <section className="space-y-3 pt-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">GraphRAG Story</p>
            <h1 className="text-[2rem] font-semibold tracking-tight text-slate-950">{activeStep?.stepHeadline}</h1>
            <p className="max-w-[72ch] text-[0.96rem] leading-7 text-slate-700">
              {activeStep?.stepSubline}
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500" style={{ width: `${progress}%` }} />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_390px]">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <GraphRagJourney3D step={activeStep} />
              <p className="mt-2 text-xs text-slate-500">
                Hybrid-Ansicht: interaktive 3D-Kernbewegung plus Motion-Loop pro Schritt.
              </p>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Aktueller Schritt</p>
              <h2 className="text-[1.15rem] font-semibold text-slate-900">{activeStep?.title}</h2>
              <p className="text-[0.92rem] leading-6 text-slate-700">{activeStep?.goal}</p>

              <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Was war das Problem?</p>
                <p className="mt-1 text-[0.9rem] leading-6 text-slate-700">{activeStep?.problemStatement}</p>
              </section>

              <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Was verändert sich im Modell?</p>
                <p className="mt-1 text-[0.9rem] leading-6 text-slate-700">{activeStep?.modelChange}</p>
              </section>

              <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Was geht ins LLM?</p>
                <p className="mt-1 text-[0.85rem] leading-6 text-slate-700">
                  <span className="font-semibold">Nodes:</span> {activeStep?.llmInputPreview.nodes.join(", ")}
                </p>
                <p className="text-[0.85rem] leading-6 text-slate-700">
                  <span className="font-semibold">Edges:</span> {activeStep?.llmInputPreview.edges.join(", ")}
                </p>
                <p className="text-[0.85rem] leading-6 text-slate-700">
                  <span className="font-semibold">Budget:</span> {activeStep?.llmInputPreview.budget}
                </p>
              </section>

              <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Was ist der konkrete Nutzen?</p>
                <p className="mt-1 text-[0.9rem] leading-6 text-slate-700">{activeStep?.valueStatement}</p>
              </section>

              <section className="rounded-lg border border-violet-200 bg-violet-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-violet-800">Vorher / Nachher</p>
                <div className="mt-2 inline-flex rounded-md border border-violet-200 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setCompareMode("llmOnly")}
                    className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                      compareMode === "llmOnly" ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-violet-50"
                    }`}
                  >
                    Ohne Graph
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompareMode("graphRag")}
                    className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                      compareMode === "graphRag" ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-violet-50"
                    }`}
                  >
                    Mit Graph
                  </button>
                </div>
                <p className="mt-2 text-[0.86rem] leading-6 text-slate-700">
                  {compareMode === "llmOnly" ? activeStep?.beforeAfter.llmOnly : activeStep?.beforeAfter.graphRag}
                </p>
              </section>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Quellen</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {activeStep?.references.map((reference) => (
                    <li key={reference.href}>
                      <TrackedLink
                        href={reference.href}
                        label={reference.label}
                        eventName="story_reference_click"
                        payload={{ step: activeStep.id, href: reference.href }}
                        className="text-sky-700 underline decoration-sky-300 underline-offset-2"
                        external
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {activeStepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = activeStepIndex - 1;
                      setActiveStepIndex(nextIndex);
                      setCompareMode("graphRag");
                      trackLiteEvent("story_step_change", { step: STORY_STEPS[nextIndex]?.id ?? "unknown" });
                    }}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Zurueck
                  </button>
                ) : null}
                {activeStepIndex < STORY_STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = activeStepIndex + 1;
                      setActiveStepIndex(nextIndex);
                      setCompareMode("graphRag");
                      trackLiteEvent("story_step_change", { step: STORY_STEPS[nextIndex]?.id ?? "unknown" });
                    }}
                    className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Weiter
                  </button>
                ) : null}
                {activeStep?.cta ? (
                  <TrackedLink
                    href={activeStep.cta.href}
                    label={activeStep.cta.label}
                    eventName="story_cta_click"
                    payload={{ step: activeStep.id }}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  />
                ) : null}
              </div>
            </section>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">LinkedIn-Teaser</p>
            <blockquote className="mt-2 rounded-md border-l-4 border-violet-300 bg-violet-50 px-4 py-3 text-sm leading-6 text-slate-800">
              &quot;GraphRAG macht aus Rohsignalen eine nachvollziehbare Entscheidungskette. Genau das erzeugt Vertrauen in komplexen Umgebungen.&quot;
            </blockquote>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
