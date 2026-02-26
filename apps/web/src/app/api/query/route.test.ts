import { afterEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/query/route";

const originalOpenAiModel = process.env.OPENAI_MODEL;

afterEach(() => {
  if (originalOpenAiModel === undefined) {
    delete process.env.OPENAI_MODEL;
    return;
  }

  process.env.OPENAI_MODEL = originalOpenAiModel;
});

describe("POST /api/query", () => {
  it("returns 500 when OPENAI_MODEL is missing", async () => {
    delete process.env.OPENAI_MODEL;

    const response = await POST(
      new Request("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Wie wirken Feedback Loops auf Systeme?" }),
      }),
    );

    const body = (await response.json()) as {
      status: string;
      error: { code: string };
    };

    expect(response.status).toBe(500);
    expect(body.status).toBe("error");
    expect(body.error.code).toBe("INTERNAL_ERROR");
    expect(response.headers.get("X-Request-Id")).toBeTruthy();
  });

  it("returns contract shaped empty success in bootstrap mode", async () => {
    process.env.OPENAI_MODEL = "gpt-5-mini";

    const response = await POST(
      new Request("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Wie wirken Feedback Loops auf Systeme?" }),
      }),
    );

    const body = (await response.json()) as {
      status: string;
      state: string;
      references: unknown[];
      context: { elements: { source: { kind: string } }[] };
      meta: { topK: number; hopDepth: number; retrievedNodeCount: number };
      answer: { main: string; coreRationale: string };
    };

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.state).toBe("answer");
    expect(body.meta.topK).toBe(6);
    expect(body.meta.hopDepth).toBe(1);
    expect(body.meta.retrievedNodeCount).toBe(body.references.length);
    expect(Array.isArray(body.references)).toBe(true);
    expect(body.references.length).toBeGreaterThan(0);
    expect(Array.isArray(body.context.elements)).toBe(true);
    expect(body.context.elements.length).toBe(body.references.length);
    expect(
      body.context.elements.every((element) => element.source.kind === "candidate"),
    ).toBe(true);
    expect(body.meta.contextTokens).toBeGreaterThanOrEqual(0);
    expect(body.answer.main.length).toBeGreaterThan(0);
    expect(body.answer.coreRationale.length).toBeGreaterThan(0);
  });
});
