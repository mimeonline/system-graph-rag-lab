import { describe, expect, it } from "vitest";
import { parseQueryRequest } from "@/features/query/schemas";

describe("parseQueryRequest", () => {
  it("validates a valid payload", () => {
    const result = parseQueryRequest({
      query: "Wie wirken Feedback Loops auf lokale Optimierung?",
      clientRequestId: "abc-123",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.query).toContain("Feedback Loops");
      expect(result.data.clientRequestId).toBe("abc-123");
    }
  });

  it("rejects whitespace only query", () => {
    const result = parseQueryRequest({ query: "     " });
    expect(result).toEqual({
      ok: false,
      message: "Query muss zwischen 5 und 500 Zeichen enthalten.",
    });
  });

  it("rejects too long clientRequestId", () => {
    const result = parseQueryRequest({
      query: "Valid query for bootstrap",
      clientRequestId: "x".repeat(65),
    });

    expect(result).toEqual({
      ok: false,
      message: "clientRequestId darf maximal 64 Zeichen enthalten.",
    });
  });
});
