import { describe, expect, it } from "vitest";

import { getStatusHint } from "@/components/organisms/query-panel-status";

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
