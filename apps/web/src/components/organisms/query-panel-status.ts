export type QueryPanelStatus = "idle" | "loading" | "success" | "error" | "empty";

export type QueryPanelStatusHint = {
  statusText: string;
  nextAction: string;
};

const STATUS_HINTS: Record<QueryPanelStatus, QueryPanelStatusHint> = {
  idle: {
    statusText:
      "Formuliere eine Frage und sende sie ab, um Hauptantwort, Referenzen und Kernnachweis sichtbar zu machen.",
    nextAction: "Frage formulieren und absenden.",
  },
  loading: {
    statusText: "Antwort wird vom Backend angefordert. Bitte einen Moment Geduld.",
    nextAction: "Bitte nicht erneut absenden oder die Seite neu laden.",
  },
  success: {
    statusText: "Antwort verfügbar: Haupttext, Referenzen und Kernnachweis folgen unten.",
    nextAction: "Antwort prüfen und ggf. weitere Fragen anschließen.",
  },
  error: {
    statusText: "Beim Laden der Antwort ist ein Problem aufgetreten; bitte erneut senden.",
    nextAction: "Fehler prüfen und die Anfrage erneut absenden.",
  },
  empty: {
    statusText:
      "Die Anfrage lieferte keine Referenzkonzepte oder Antwortdaten aus dem verfügbaren Kontext.",
    nextAction: "Frage präziser formulieren oder Kontext ergänzen und erneut absenden.",
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
