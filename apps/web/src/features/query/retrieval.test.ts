import { describe, expect, it } from "vitest";
import {
  CONTEXT_BUDGET_TOKENS,
  TOP_K,
} from "@/features/query/contracts";
import { buildContextCandidates } from "@/features/query/retrieval";

describe("buildContextCandidates", () => {
  it("returns deterministic top-3 order across repeated runs", () => {
    const query = "Feedback loops, Systemgrenzen und Interdependenzen";
    const first = buildContextCandidates(query);
    const second = buildContextCandidates(query);

    const firstTopIds = first.references.slice(0, 3).map((reference) => reference.nodeId);
    const secondTopIds = second.references.slice(0, 3).map((reference) => reference.nodeId);

    expect(firstTopIds).toEqual(secondTopIds);
  });

  it("produces duplicate-free references and honors token budget", () => {
    const result = buildContextCandidates("Ganzheitliche Sicht auf Feedback-Loops und Hebelpunkte");
    const nodeIds = result.references.map((reference) => reference.nodeId);

    expect(new Set(nodeIds).size).toBe(nodeIds.length);
    expect(result.references.length).toBeLessThanOrEqual(TOP_K);
    expect(result.contextTokens).toBeLessThanOrEqual(CONTEXT_BUDGET_TOKENS);
  });
});
