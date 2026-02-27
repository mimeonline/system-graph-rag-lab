export type QueryPanelStatus = "idle" | "loading" | "success" | "error" | "empty";

export type QueryPanelStatusHint = {
  statusText: string;
  nextAction: string;
};

const STATUS_HINTS: Record<QueryPanelStatus, QueryPanelStatusHint> = {
  idle: {
    statusText:
      "Bereit: Formuliere eine präzise Frage, um Hauptantwort, Referenzen und Kernbegründung sichtbar zu machen.",
    nextAction: "Frage formulieren und absenden.",
  },
  loading: {
    statusText: "Analysiere Kontext: Relevante Knoten und Belege werden priorisiert.",
    nextAction: "Bitte kurz warten und nicht erneut absenden.",
  },
  success: {
    statusText: "Antwort erstellt: Haupttext, Referenzen und Kernbegründung sind verfügbar.",
    nextAction: "Ergebnis prüfen und bei Bedarf Anschlussfrage senden.",
  },
  error: {
    statusText: "Anfrage fehlgeschlagen: Die Antwort konnte nicht geladen werden.",
    nextAction: "Fehler prüfen und Anfrage erneut senden.",
  },
  empty: {
    statusText: "Kein passender Kontext: Es wurden keine belastbaren Referenzknoten gefunden.",
    nextAction: "Frage präzisieren oder Kontext erweitern und erneut senden.",
  },
};

/**
 * Returns user-facing status copy and optional error override for the query panel.
 */
export function getStatusHint(
  status: QueryPanelStatus,
  errorMessage?: string | null,
): QueryPanelStatusHint {
  const hint = STATUS_HINTS[status];

  if (status === "error" && errorMessage) {
    return {
      statusText: errorMessage,
      nextAction: hint.nextAction,
    };
  }

  return hint;
}
