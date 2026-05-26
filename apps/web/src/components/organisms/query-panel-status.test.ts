import { describe, expect, it } from "vitest";

import {
  getStatusHint,
  getUserFacingQueryErrorMessage,
} from "@/components/organisms/query-panel-status";

const copy = {
  idle: {
    statusText: "Stell eine einfache, konkrete Frage.",
    nextAction: "Frage auswählen oder eingeben und absenden.",
  },
  loading: {
    statusText: "Wir suchen gerade die wichtigsten Zusammenhänge.",
    nextAction: "Kurz warten, die Antwort wird aufgebaut.",
  },
  success: {
    statusText: "Fertig.",
    nextAction: "Ergebnis lesen.",
  },
  error: {
    statusText: "Das hat gerade nicht geklappt.",
    nextAction: "Bitte erneut senden.",
  },
  empty: {
    statusText: "Dazu haben wir noch zu wenig passenden Kontext.",
    nextAction: "Frage einfacher oder konkreter formulieren und erneut senden.",
  },
} as const;

describe("getStatusHint", () => {
  it("provides loading guidance with a clear next action", () => {
    const hint = getStatusHint("loading", copy);

    expect(hint.statusText).toContain("wichtigsten Zusammenhänge");
    expect(hint.nextAction).toContain("Kurz warten");
  });

  it("uses the provided error message while keeping the next action stable", () => {
    const hint = getStatusHint("error", copy, "Verbindung zum Backend fehlgeschlagen.");

    expect(hint.statusText).toBe("Verbindung zum Backend fehlgeschlagen.");
    expect(hint.nextAction).toContain("erneut senden");
  });

  it("describes the empty result state and how to recover", () => {
    const hint = getStatusHint("empty", copy);

    expect(hint.statusText).toContain("zu wenig passenden Kontext");
    expect(hint.nextAction).toContain("einfacher oder konkreter");
  });
});

describe("getUserFacingQueryErrorMessage", () => {
  const errorCopy = {
    fallback: "Antwort konnte nicht geladen werden.",
    graphUnavailable: "Der Wissensgraph ist gerade nicht erreichbar. Bitte versuche es gleich noch einmal.",
    rateLimit: "Die Demo erhält gerade viele Anfragen. Bitte versuche es in Kürze erneut.",
    llmUnavailable: "Der Antwortdienst ist gerade nicht erreichbar. Bitte versuche es gleich noch einmal.",
  };

  it("maps graph backend downtime to a user-facing message", () => {
    const message = getUserFacingQueryErrorMessage(
      JSON.stringify({
        status: "error",
        error: {
          code: "GRAPH_BACKEND_UNAVAILABLE",
          message: "Der Graph-Backend-Service ist derzeit nicht erreichbar.",
        },
      }),
      errorCopy,
    );

    expect(message).toBe(errorCopy.graphUnavailable);
    expect(message).not.toContain("Backend");
    expect(message).not.toContain("GRAPH_BACKEND_UNAVAILABLE");
  });

  it("hides unexpected JSON payloads behind the generic fallback", () => {
    const message = getUserFacingQueryErrorMessage(
      JSON.stringify({ status: "error", error: { code: "INTERNAL_ERROR" } }),
      errorCopy,
    );

    expect(message).toBe(errorCopy.fallback);
  });
});
