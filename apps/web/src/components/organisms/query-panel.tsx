"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { QueryInput } from "@/components/molecules/query-input";
import { GraphPreview } from "@/components/molecules/graph-preview";
import { buildHomeGraphModel } from "@/features/home/graph-view-model";
import { buildQueryViewModel, type QueryViewModel } from "@/features/query/view-model";
import type { QuerySuccessResponse } from "@/features/query/contracts";
import {
  getStatusHint,
  type QueryPanelStatus,
} from "@/components/organisms/query-panel-status";

const DEFAULT_QUERY =
  "Welche Zielkonflikte entstehen zwischen Entkopplung und Betriebsaufwand in eventgetriebenen Systemen?";

const STATUS_LABELS: Record<QueryPanelStatus, string> = {
  idle: "idle",
  loading: "wird geladen",
  success: "aktiv",
  error: "fehler",
  empty: "leer",
};

/**
 * Renders the interactive query workflow and orchestrates API request state.
 */
export function QueryPanel(): React.JSX.Element {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [viewModel, setViewModel] = useState<QueryViewModel | null>(null);
  const [status, setStatus] = useState<QueryPanelStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  const nextSteps = viewModel?.nextSteps ?? [
    "Frage absenden, damit konkrete Handlungsschritte generiert werden.",
  ];
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
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,36%)]">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-slate-900">Antwortführung</h2>

        <QueryInput
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          helperText={helperText}
          nextAction={statusAction}
          isSubmitting={status === "loading"}
        />

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                Antwort
              </h3>
              <p className="text-xs text-slate-500">Aktuelle Frage: {viewModel?.query ?? query}</p>
            </div>
            <span
              aria-live="polite"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500"
            >
              {STATUS_LABELS[status]}
            </span>
          </div>
          <p className="text-sm leading-7 text-slate-700">{mainAnswer}</p>
          <p className="text-xs text-slate-500">
            Kontextbudget: {viewModel?.contextTokens ?? 0} Token (Schätzung der verwendeten Kontexte).
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              Was bringt mir das jetzt?
            </h3>
            <span className="text-xs font-semibold text-slate-500">nächste Schritte</span>
          </div>
          <ul className="space-y-2">
            {nextSteps.map((step) => (
              <li key={step} className="text-sm leading-6 text-slate-700">
                {step}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              Knapper P0-Kernnachweis
            </h3>
            <span className="text-xs font-semibold text-slate-500">core rationale</span>
          </div>
          <p className="text-sm leading-7 text-slate-700">{coreRationale}</p>
        </section>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-slate-900">Kontext und Tools</h2>

        <GraphPreview model={graphModel} />

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              Referenzkonzepte
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {hasReferences ? `${references.length} Referenz${references.length > 1 ? "en" : ""}` : "bereit"}
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
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {reference.tools.map((tool) => (
                      <li
                        key={tool}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                      >
                        {tool}
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
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Quelle: {detail.sourceFile}
                  </p>
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
    </div>
  );
}
