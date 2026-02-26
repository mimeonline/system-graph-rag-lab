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

  it("builds deduplicated context elements with source attribution", () => {
    const result = buildContextCandidates("Feedback loops context und systemisches Denken");
    expect(result.contextElements.length).toBe(result.references.length);

    const contextNodeIds = result.contextElements.map((element) => element.nodeId);
    expect(new Set(contextNodeIds).size).toBe(contextNodeIds.length);

    expect(
      result.contextElements.every((element) => element.source.kind === "candidate"),
    ).toBe(true);

    expect(
      result.contextElements.every((element) => element.source.candidateId === element.nodeId),
    ).toBe(true);

    expect(
      result.contextElements.every((element) => element.summary.length <= 280),
    ).toBe(true);
  });
});
