"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { QueryInput } from "@/components/molecules/query-input";
import { buildQueryViewModel, type QueryViewModel } from "@/features/query/view-model";
import type { QuerySuccessResponse } from "@/features/query/contracts";

type QueryPanelStatus = "idle" | "loading" | "success" | "error";

const DEFAULT_QUERY =
  "Welche Zielkonflikte entstehen zwischen Entkopplung und Betriebsaufwand in eventgetriebenen Systemen?";

const STATUS_HELPER: Record<QueryPanelStatus, string> = {
  idle: "Formuliere eine Frage und sende sie ab, um Hauptantwort, Referenzen und Kernnachweis sichtbar zu machen.",
  loading: "Antwort wird vom Backend angefordert. Bitte einen Moment Geduld.",
  success: "Antwort verfügbar: Haupttext, Referenzen und Kernnachweis folgen unten.",
  error: "Beim Laden der Antwort ist ein Problem aufgetreten; bitte erneut senden.",
};

export function QueryPanel(): React.JSX.Element {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [viewModel, setViewModel] = useState<QueryViewModel | null>(null);
  const [status, setStatus] = useState<QueryPanelStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const helperText = errorMessage ?? STATUS_HELPER[status];

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
      setViewModel(buildQueryViewModel(payload, trimmedQuery));
      setStatus("success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unerwarteter Fehler während der Anfrage.";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const references = viewModel?.references ?? [];
  const hasReferences = references.length > 0;
  const mainAnswer =
    viewModel?.answer.main ??
    "Sobald die Query gesendet wurde, erscheint hier die Hauptantwort.";
  const coreRationale =
    viewModel?.answer.coreRationale ??
    "Hier wird der knappe P0-Kernnachweis angezeigt, sobald eine Antwort vorliegt.";

  return (
    <div className="grid gap-6">
      <QueryInput
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        helperText={helperText}
        isSubmitting={status === "loading"}
      />

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              Hauptantwort
            </h2>
            <p className="text-xs text-slate-500">Aktuelle Frage: {viewModel?.query ?? query}</p>
          </div>
          <span
            aria-live="polite"
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500"
          >
            {status === "loading"
              ? "wird geladen"
              : status === "success"
              ? "aktiv"
              : status === "error"
              ? "fehler"
              : "idle"}
          </span>
        </div>
        <p className="text-sm leading-7 text-slate-700">{mainAnswer}</p>
        <p className="text-xs text-slate-500">
          Kontextbudget: {viewModel?.contextTokens ?? 0} Token (Schätzung der verwendeten Kontexte).
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Referenzkonzepte
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {hasReferences ? `${references.length} Referenz${references.length > 1 ? "en" : ""}` : "bereit"}
          </span>
        </div>
        {hasReferences ? (
          <ul className="space-y-2">
            {references.map((reference) => (
              <li
                key={reference.nodeId}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900"
              >
                <span>{reference.title}</span>
                <span className="text-xs font-normal uppercase tracking-[0.2em] text-slate-500">
                  {reference.nodeType}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">
            Nach erfolgreicher Antwort zeigen wir hier maximal drei Referenzkonzepte an.
          </p>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Knapper P0-Kernnachweis
          </h2>
          <span className="text-xs font-semibold text-slate-500">core rationale</span>
        </div>
        <p className="text-sm leading-7 text-slate-700">{coreRationale}</p>
      </section>
    </div>
  );
}
