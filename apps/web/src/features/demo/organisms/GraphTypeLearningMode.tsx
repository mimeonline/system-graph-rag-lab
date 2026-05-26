"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Play, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { TrackedLink } from "@/components/molecules/tracked-link";
import { DemoGraphSimulationSvg } from "@/features/demo/molecules/DemoGraphSimulationSvg";
import {
  DEMO_GRAPH_TYPES,
  getDemoGraphType,
  type DemoGraphTypeId,
} from "@/features/demo/graph-type-learning-model";

type GraphTypeLearningModeProps = {
  locale: "de" | "en";
  showLiveModeLink?: boolean;
};

export function GraphTypeLearningMode({
  locale,
  showLiveModeLink = false,
}: GraphTypeLearningModeProps): React.JSX.Element {
  const isEn = locale === "en";
  const [activeTypeId, setActiveTypeId] = useState<DemoGraphTypeId>("document");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeType = useMemo(() => getDemoGraphType(activeTypeId), [activeTypeId]);

  const copy = {
    eyebrow: isEn ? "Learning mode" : "Lernmodus",
    title: isEn ? "Five graph types, one EU AI Act decision." : "Fünf Graph-Typen, eine EU-AI-Act-Entscheidung.",
    intro: isEn
      ? "The simulation uses the EU AI Act as source material and shows how the same launch question changes with the graph model."
      : "Die Simulation nutzt den EU AI Act als Quellmaterial und zeigt, wie sich dieselbe Launch-Frage je nach Graphmodell verändert.",
    source: isEn ? "Source basis" : "Quellenbasis",
    sourceBody: isEn
      ? "Official Regulation (EU) 2024/1689 plus a high-level summary for orientation."
      : "Offizielle Verordnung (EU) 2024/1689 plus High-Level-Zusammenfassung zur Orientierung.",
    simulation: isEn ? "Simulated observation" : "Simulierte Observation",
    graphView: isEn ? "Graph view" : "Graph-Ansicht",
    questionLabel: isEn ? "Demo question" : "Demo-Frage",
    structureLabel: isEn ? "Typical structure" : "Typische Struktur",
    riskLabel: isEn ? "Main risk" : "Hauptrisiko",
    liveMode: isEn ? "Live mode stays below" : "Live-Modus bleibt unten",
    liveModeBody: isEn
      ? "The existing System Thinking demo continues to use the real query pipeline."
      : "Die bestehende System-Thinking-Demo nutzt weiter die echte Query-Pipeline.",
    liveModeCta: isEn ? "Jump to live mode" : "Zum Live-Modus",
    detailCta: isEn ? "Open detail page" : "Detailseite öffnen",
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStepIndex((current) => (current + 1) % activeType.steps.length);
    }, 3400);

    return () => window.clearInterval(timer);
  }, [activeType.steps.length]);

  return (
    <section id="lernmodus" className="mx-auto w-full max-w-295 px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.6fr)] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{copy.eyebrow}</p>
            <h2 className="headline-wrap mt-3 max-w-3xl text-[1.75rem] font-bold leading-tight tracking-tight text-slate-950 sm:text-[2.35rem]">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-600 sm:text-[1.05rem]">
              {copy.intro}
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-sky-600" aria-hidden />
              <span>{copy.source}</span>
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">{copy.sourceBody}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {DEMO_GRAPH_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = type.id === activeType.id;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setActiveTypeId(type.id);
                  setActiveStepIndex(0);
                }}
                className={[
                  "group min-h-28 rounded-2xl border p-4 text-left transition-all",
                  isActive
                    ? "border-sky-500 bg-white shadow-lg shadow-sky-900/10"
                    : "border-slate-200 bg-white/70 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white",
                ].join(" ")}
                aria-pressed={isActive}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[1.55rem] font-bold leading-none tabular-nums text-slate-300">{type.number}</span>
                  <Icon
                    className={["h-5 w-5", isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600"].join(" ")}
                    aria-hidden
                  />
                </span>
                <span className="mt-3 block text-sm font-bold text-slate-950">{type.title}</span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{type.badge}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(330px,0.65fr)]">
          <section className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/80 via-sky-50/50 to-slate-50/30" />
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{copy.graphView}</p>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={activeType.id}
                    className="mt-1 text-xl font-bold text-slate-950"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeType.title}
                  </motion.h3>
                </AnimatePresence>
              </div>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sky-700">
                {copy.simulation}
              </span>
            </div>

            <DemoGraphSimulationSvg graphType={activeType} activeStepIndex={activeStepIndex} />
          </section>

          <aside className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.section
                key={activeType.id}
                className="glass-panel rounded-3xl p-5 sm:p-6"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.24 }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{activeType.badge}</p>
                <p className="mt-2 text-base font-semibold leading-relaxed text-slate-900">{activeType.useCase}</p>

              <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{copy.questionLabel}</dt>
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{activeType.question}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{copy.structureLabel}</dt>
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{activeType.structure}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{copy.riskLabel}</dt>
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{activeType.risk}</dd>
                  </div>
                </dl>

                <TrackedLink
                  href={`/demo/${activeType.slug}`}
                  label={copy.detailCta}
                  eventName="demo_graph_type_detail_click"
                  payload={{ graphType: activeType.id }}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-sky-600"
                />
              </motion.section>
            </AnimatePresence>

            <section className="glass-panel rounded-3xl p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Play className="h-4 w-4 text-sky-600" aria-hidden />
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">{copy.simulation}</h3>
              </div>
              <ol className="space-y-3">
                {activeType.steps.map((step, index) => {
                  const isActive = index === activeStepIndex;

                  return (
                    <li key={step.label}>
                      <button
                        type="button"
                        onClick={() => setActiveStepIndex(index)}
                        className={[
                          "w-full rounded-2xl border p-4 text-left transition-all",
                          isActive
                            ? "border-sky-300 bg-sky-50 shadow-sm"
                            : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white",
                        ].join(" ")}
                      >
                        <span className="flex items-start gap-3">
                          <span
                            className={[
                              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                              isActive ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-500",
                            ].join(" ")}
                          >
                            {index + 1}
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-slate-950">{step.label}</span>
                            <span className="mt-1 block text-sm font-medium leading-relaxed text-slate-600">{step.detail}</span>
                            {isActive ? (
                              <motion.span
                                className="mt-2 block border-l-2 border-sky-500 pl-3 text-sm font-semibold leading-relaxed text-slate-800"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {step.observation}
                              </motion.span>
                            ) : null}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>

            {showLiveModeLink ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-bold text-slate-950">{copy.liveMode}</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">{copy.liveModeBody}</p>
                <TrackedLink
                  href="/demo/live"
                  label={copy.liveModeCta}
                  eventName="demo_live_mode_click"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-sky-600"
                  icon={<ArrowDown className="h-4 w-4" aria-hidden />}
                />
              </section>
            ) : null}
          </aside>
        </div>
      </motion.div>
    </section>
  );
}
