export type QueryPanelStatus = "idle" | "loading" | "success" | "error" | "empty";

export type QueryPanelStatusHint = {
  statusText: string;
  nextAction: string;
};

const STATUS_HINTS: Record<QueryPanelStatus, QueryPanelStatusHint> = {
  idle: {
    statusText: "Stell eine einfache, konkrete Frage. Dann zeigen wir dir die Antwort Schritt für Schritt.",
    nextAction: "Frage auswählen oder eingeben und absenden.",
  },
  loading: {
    statusText: "Wir suchen gerade die wichtigsten Zusammenhänge.",
    nextAction: "Kurz warten, die Antwort wird aufgebaut.",
  },
  success: {
    statusText: "Fertig. Du siehst jetzt die Kurzantwort, die Belege und sinnvolle nächste Schritte.",
    nextAction: "Ergebnis lesen und eine Anschlussfrage stellen, wenn etwas offen ist.",
  },
  error: {
    statusText: "Das hat gerade nicht geklappt.",
    nextAction: "Bitte erneut senden.",
  },
  empty: {
    statusText: "Dazu haben wir noch zu wenig passenden Kontext.",
    nextAction: "Frage einfacher oder konkreter formulieren und erneut senden.",
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
