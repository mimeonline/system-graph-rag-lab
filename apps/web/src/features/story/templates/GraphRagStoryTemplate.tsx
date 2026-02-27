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
        3D Journey lädt…
      </div>
    ),
  },
);

const STORY_STEPS: StoryStep[] = [
  {
    id: "problem",
    title: "1. Problem sichtbar machen",
    goal: "Wir starten mit einer präzisen Frage statt mit einer vagen Hypothese.",
    visualState: "problem",
    scenePreset: "isolated-problem",
    camera: { x: 0, y: 0.2, z: 5.9 },
    highlightNodes: ["q"],
    animationMode: "pulse",
    overlayNotes: [
      "Nur ein zentraler Frageknoten ist sicher.",
      "Viel Kontextrauschen ohne strukturierte Verknüpfung.",
      "Risiko: plausible, aber unscharfe Antworten.",
    ],
    narration:
      "Die Reise beginnt mit einem klaren Problemrahmen. Ohne saubere Frage produziert auch ein gutes Modell nur diffuse Antworten.",
    references: [{ label: "Question Framing", href: "https://en.wikipedia.org/wiki/Question" }],
  },
  {
    id: "retrieval",
    title: "2. Retrieval priorisiert Kontext",
    goal: "Relevante Knoten werden mit Score und Hop ausgewählt.",
    visualState: "retrieval",
    scenePreset: "scored-retrieval",
    camera: { x: 0, y: 0.15, z: 6.2 },
    highlightNodes: ["r1", "r2", "r3"],
    animationMode: "flow",
    overlayNotes: [
      "Nur die Top-Knoten zur Frage werden aktiviert.",
      "Irrelevante Knoten bleiben sichtbar, aber gedimmt.",
      "Mehr-Hop erweitert gezielt den Kontext statt alles einzuladen.",
    ],
    narration:
      "Statt blind Text zu ziehen, priorisiert GraphRAG semantisch passende Knoten und kann gezielt Nachbarn einbeziehen.",
    references: [{ label: "Retrieval-augmented generation", href: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" }],
  },
  {
    id: "graph",
    title: "3. Graph-Kontext verknüpft Beziehungen",
    goal: "Knoten und Kanten zeigen Struktur, nicht nur Textblöcke.",
    visualState: "graph",
    scenePreset: "relational-graph",
    camera: { x: 0.2, y: 0.2, z: 6.3 },
    highlightNodes: ["r1", "r2", "r3", "e1", "e2"],
    animationMode: "orbit",
    overlayNotes: [
      "Relevanzknoten verbinden sich mit Evidenzknoten.",
      "Kanten zeigen Ursache-, Einfluss- und Belegbeziehungen.",
      "Das ist der Unterschied zu klassischem RAG-Chunking.",
    ],
    narration:
      "Die zentrale Stärke ist die sichtbare Beziehungsebene: Welche Konzepte beeinflussen sich, welche Belege stützen welche Aussage.",
    references: [{ label: "Knowledge graph", href: "https://en.wikipedia.org/wiki/Knowledge_graph" }],
  },
  {
    id: "synthesis",
    title: "4. Synthese mit transparentem Kontextpaket",
    goal: "Das LLM antwortet auf Basis klar begrenzter, nachvollziehbarer Inputs.",
    visualState: "synthesis",
    scenePreset: "context-synthesis",
    camera: { x: 0, y: 0.1, z: 6 },
    highlightNodes: ["ctx1", "ctx2", "ctx3", "out"],
    animationMode: "flow",
    overlayNotes: [
      "Kontext-Pakete fließen kontrolliert ins Modell.",
      "Nicht alles aus dem Graph geht in den Prompt.",
      "Antworten bleiben prüfbar, weil Herkunft sichtbar ist.",
    ],
    narration:
      "Im Prompt landet nicht beliebiger Text, sondern ein strukturiertes Paket aus Referenzen, Knoten-Typen und Herleitungsdetails.",
    references: [{ label: "Prompt engineering", href: "https://en.wikipedia.org/wiki/Prompt_engineering" }],
  },
  {
    id: "decision",
    title: "5. Entscheidung und nächste Schritte",
    goal: "Die Antwort wird in konkrete Handlungsoptionen überführt.",
    visualState: "decision",
    scenePreset: "decision-subgraph",
    camera: { x: 0.15, y: 0.2, z: 5.8 },
    highlightNodes: ["a1", "a2", "a3", "action"],
    animationMode: "focus",
    overlayNotes: [
      "Komplexität wird zu einem fokussierten Entscheidungs-Subgraph verdichtet.",
      "Action-Knoten markiert den nächsten sinnvollen Schritt.",
      "Ergebnis: von plausibel zu handlungsfähig und überprüfbar.",
    ],
    narration:
      "Das Ergebnis ist kein abstrakter Essay, sondern eine prüfbare Antwort mit Quellen und umsetzbaren nächsten Schritten.",
    references: [{ label: "Decision-making", href: "https://en.wikipedia.org/wiki/Decision-making" }],
    cta: { label: "Zur Live-Demo", href: "/" },
  },
];

export function GraphRagStoryTemplate(): React.JSX.Element {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = STORY_STEPS[activeStepIndex] ?? STORY_STEPS[0];

  const progress = useMemo(() => {
    return ((activeStepIndex + 1) / STORY_STEPS.length) * 100;
  }, [activeStepIndex]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-slate-900">
      <TrackedPageView page="/story/graphrag" />
      <SiteHeader />
      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto w-full max-w-[1180px] space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">GraphRAG Story</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-tight text-slate-950">Eine visuelle Reise von der Frage zur Entscheidung</h1>
            <p className="mt-2 max-w-[72ch] text-[0.96rem] leading-7 text-slate-700">
              Schritt für Schritt wird sichtbar, wie GraphRAG Kontext auswählt, Beziehungen nutzbar macht und daraus eine belastbare Entscheidung ableitet.
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500" style={{ width: `${progress}%` }} />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <GraphRagJourney3D step={activeStep} />
              <p className="mt-2 text-xs text-slate-500">
                Szenische 3D-Visualisierung je Schritt. So wird die technische Herleitung zur verständlichen Story.
              </p>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Aktueller Schritt</p>
              <h2 className="text-[1.2rem] font-semibold text-slate-900">{activeStep?.title}</h2>
              <p className="text-[0.92rem] leading-6 text-slate-700">{activeStep?.goal}</p>
              <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[0.92rem] leading-6 text-slate-700">
                {activeStep?.narration}
              </p>

              <section className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Was im 3D-Bild passiert</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-[0.9rem] leading-6 text-slate-700">
                  {activeStep?.overlayNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
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

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Prompt-Transparenz</p>
                <p className="mt-1 text-[0.9rem] leading-6 text-slate-700">
                  Das LLM erhält ein strukturiertes Kontextpaket aus ausgewählten Nodes, Beziehungen und Belegen statt isolierter Textfragmente.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {activeStepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = activeStepIndex - 1;
                      setActiveStepIndex(nextIndex);
                      trackLiteEvent("story_step_change", { step: STORY_STEPS[nextIndex]?.id ?? "unknown" });
                    }}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Zurück
                  </button>
                ) : null}
                {activeStepIndex < STORY_STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = activeStepIndex + 1;
                      setActiveStepIndex(nextIndex);
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
              &quot;GraphRAG macht aus einer plausiblen Antwort eine sichtbare Herleitung. Genau das schafft Vertrauen in komplexen Entscheidungen.&quot;
            </blockquote>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
