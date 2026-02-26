import { describe, expect, it } from "vitest";

import { getStatusHint } from "@/components/organisms/query-panel-status";

describe("getStatusHint", () => {
  it("provides loading guidance with a clear next action", () => {
    const hint = getStatusHint("loading");

    expect(hint.statusText).toContain("Antwort wird vom Backend angefordert");
    expect(hint.nextAction).toContain("Bitte nicht erneut absenden");
  });

  it("uses the provided error message while keeping the next action stable", () => {
    const hint = getStatusHint("error", "Verbindung zum Backend fehlgeschlagen.");

    expect(hint.statusText).toBe("Verbindung zum Backend fehlgeschlagen.");
    expect(hint.nextAction).toContain("Fehler prüfen");
  });

  it("describes the empty result state and how to recover", () => {
    const hint = getStatusHint("empty");

    expect(hint.statusText).toContain("keine Referenzkonzepte");
    expect(hint.nextAction).toContain("Frage präziser formulieren");
  });
});
