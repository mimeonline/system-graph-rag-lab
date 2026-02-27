import { describe, expect, it } from "vitest";

import { getStatusHint } from "@/components/organisms/query-panel-status";

describe("getStatusHint", () => {
  it("provides loading guidance with a clear next action", () => {
    const hint = getStatusHint("loading");

    expect(hint.statusText).toContain("wichtigsten Zusammenhänge");
    expect(hint.nextAction).toContain("Kurz warten");
  });

  it("uses the provided error message while keeping the next action stable", () => {
    const hint = getStatusHint("error", "Verbindung zum Backend fehlgeschlagen.");

    expect(hint.statusText).toBe("Verbindung zum Backend fehlgeschlagen.");
    expect(hint.nextAction).toContain("erneut senden");
  });

  it("describes the empty result state and how to recover", () => {
    const hint = getStatusHint("empty");

    expect(hint.statusText).toContain("zu wenig passenden Kontext");
    expect(hint.nextAction).toContain("einfacher oder konkreter");
  });
});
