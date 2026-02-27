"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";

type QueryInputProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  helperText?: string;
  nextAction?: string;
  isSubmitting: boolean;
};

const DEFAULT_HELPER_TEXT =
  "Kernfluss: Frage absenden und Hauptantwort, Referenzen sowie P0-Kernnachweis im nächsten Abschnitt prüfen.";

/**
 * Renders the query form with helper status text and submit action.
 */
export function QueryInput({
  query,
  onSubmit,
  onQueryChange,
  helperText,
  nextAction,
  isSubmitting,
}: QueryInputProps): React.JSX.Element {
  return (
    <form className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5" onSubmit={onSubmit}>
      <label className="block space-y-2" htmlFor="query">
        <span className="text-sm font-medium text-slate-900">Frage</span>
        <textarea
          className="h-32 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          id="query"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
        />
      </label>
      <p className="text-sm text-slate-600">{helperText ?? DEFAULT_HELPER_TEXT}</p>
      {nextAction && (
        <p className="text-xs font-semibold text-slate-900">
          Nächste Aktion: {nextAction}
        </p>
      )}
      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Antwort wird geladen…" : "Antwort anzeigen"}
      </Button>
    </form>
  );
}
