"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { QueryInput } from "@/components/molecules/query-input";
import { GraphPreview } from "@/components/molecules/graph-preview";
import { AnswerCard } from "@/components/organisms/answer-card";
import { ActionCard } from "@/components/organisms/action-card";
import { RationaleCard } from "@/components/organisms/rationale-card";
import {
  getStatusHint,
  type QueryPanelStatus,
} from "@/components/organisms/query-panel-status";
import { PipelineStepper } from "@/features/home/molecules/PipelineStepper";
import { buildHomeGraphModel } from "@/features/home/graph-view-model";
import type { QuerySuccessResponse } from "@/features/query/contracts";
import { buildQueryViewModel, type QueryViewModel } from "@/features/query/view-model";

const DEFAULT_QUERY =
  "Wo verlieren wir im Alltag Zeit, weil Aufgaben zwischen Teams hin und her gehen?";
const QUERY_SUGGESTIONS = [
  "Wo verlieren wir im Alltag Zeit, weil Aufgaben zwischen Teams hin und her gehen?",
  "Warum gibt es trotz neuer Tools immer noch so viele Abstimmungen?",
  "Was passiert, wenn wir schneller liefern wollen als unser Betrieb mitkommt?",
  "Welche Nebenwirkungen hat es, wenn jedes Team nur lokal optimiert?",
  "Wie bekommen wir mehr Stabilität, ohne Releases komplett auszubremsen?",
];

/**
 * Renders the interactive query workflow and orchestrates API request state.
 */
export function QueryPanel(): React.JSX.Element {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [viewModel, setViewModel] = useState<QueryViewModel | null>(null);
  const [status, setStatus] = useState<QueryPanelStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExpandedGraph, setShowExpandedGraph] = useState(false);

  const statusHint = getStatusHint(status, errorMessage);
  const helperText = statusHint.statusText;
  const statusAction = statusHint.nextAction;

  /**
   * Submits the current query to the API and updates panel state from the response.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setErrorMessage("Bitte gib eine gültige Frage ein.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmedQuery }),
        cache: "no-store",
      });

      if (!response.ok) {
        const remoteMessage = await response.text();
        throw new Error(remoteMessage || "Antwort konnte nicht geladen werden.");
      }

      const payload = (await response.json()) as QuerySuccessResponse;
      const viewModel = buildQueryViewModel(payload, trimmedQuery);
      setViewModel(viewModel);
      setStatus(viewModel.references.length === 0 ? "empty" : "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unerwarteter Fehler während der Anfrage.";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const references = viewModel?.references ?? [];
  const derivationDetails = viewModel?.derivationDetails ?? [];
  const nextSteps = viewModel?.nextSteps ?? [];
  const hasReferences = references.length > 0;
  const hasDerivationDetails = derivationDetails.length > 0;
  const mainAnswer =
    viewModel?.answer.main ??
    "Sobald die Query gesendet wurde, erscheint hier die Hauptantwort.";
  const coreRationale =
    viewModel?.answer.coreRationale ??
    "Hier wird der knappe P0-Kernnachweis angezeigt, sobald eine Antwort vorliegt.";
  const graphModel = buildHomeGraphModel(viewModel, query);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(330px,37%)]">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-slate-900">Antwortführung</h2>

        <PipelineStepper status={status} />

        <QueryInput
          query={query}
          suggestions={QUERY_SUGGESTIONS}
          onSuggestionSelect={setQuery}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          helperText={helperText}
          nextAction={statusAction}
          isSubmitting={status === "loading"}
        />

        <AnswerCard
          query={viewModel?.query ?? query}
          answer={mainAnswer}
          contextTokens={viewModel?.contextTokens ?? 0}
          status={status}
        />

        <ActionCard
          steps={
            nextSteps.length > 0
              ? nextSteps
              : ["Noch keine Handlungsschritte verfügbar. Sende eine Frage, um konkrete Schritte zu erhalten."]
          }
        />

        <RationaleCard coreRationale={coreRationale} />
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">Kontext und Tools</h2>
          <button
            type="button"
            onClick={() => setShowExpandedGraph((value) => !value)}
            className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            Graph groß anzeigen
          </button>
        </div>

        <GraphPreview model={graphModel} />

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              Referenzkonzepte
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {hasReferences
                ? `${references.length} Referenz${references.length > 1 ? "en" : ""}`
                : "Warten auf Antwort"}
            </span>
          </div>
          {hasReferences ? (
            <ul className="space-y-2">
              {references.map((reference) => (
                <li
                  key={reference.nodeId}
                  className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{reference.title}</span>
                    <span className="text-xs font-normal uppercase tracking-[0.2em] text-slate-500">
                      {reference.nodeType}
                    </span>
                  </div>
                  {reference.explanationUrl && (
                    <p className="text-xs text-slate-600">
                      <a
                        className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2"
                        href={reference.explanationUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Erklärung öffnen
                      </a>
                    </p>
                  )}
                  <p className="text-xs text-slate-600">{reference.citation}</p>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {reference.tools.map((tool) => (
                      <li
                        key={tool.label}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
                        title={tool.label}
                      >
                        <a
                          className="block whitespace-nowrap overflow-hidden text-ellipsis text-slate-700 underline decoration-slate-300 underline-offset-2"
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {tool.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              Nach erfolgreicher Antwort zeigen wir hier maximal drei Referenzkonzepte mit konkreten Tools an.
            </p>
          )}
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              Herleitungsdetails
            </h3>
            <span className="text-xs font-semibold text-slate-500">kontextuelle Tiefe</span>
          </div>
          {hasDerivationDetails ? (
            <ul className="space-y-3">
              {derivationDetails.map((detail) => (
                <li
                  key={detail.nodeId}
                  className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-900"
                >
                  <div className="text-sm font-semibold text-slate-900">{detail.label}</div>
                  <p className="text-sm leading-6 text-slate-700">{detail.summary}</p>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold uppercase tracking-[0.2em] text-slate-500">Quelle:</span>{" "}
                    {detail.sourceUrl ? (
                      <a
                        className="underline decoration-slate-300 underline-offset-2"
                        href={detail.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {detail.sourceLabel}
                      </a>
                    ) : (
                      <span>{detail.sourceLabel}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              Nach erfolgreicher Antwort erscheinen hier die wichtigsten Kontextsummaries plus Quelle.
            </p>
          )}
        </section>
      </section>

      <AnimatePresence>
        {showExpandedGraph ? (
          <motion.div
            key="graph-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 sm:p-6"
            onClick={() => setShowExpandedGraph(false)}
          >
            <motion.div
              initial={{ y: 16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-h-[94vh] w-full max-w-5xl overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">Graph im Fokus</p>
                <button
                  type="button"
                  onClick={() => setShowExpandedGraph(false)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Schließen
                </button>
              </div>
              <GraphPreview model={graphModel} variant="expanded" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
