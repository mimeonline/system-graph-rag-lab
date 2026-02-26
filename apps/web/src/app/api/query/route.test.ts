import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/query/route";
import { MAX_REFERENCES_IN_RESPONSE } from "@/features/query/answer";

const originalOpenAiModel = process.env.OPENAI_MODEL;
const originalOpenAiApiKey = process.env.OPENAI_API_KEY;

afterEach(() => {
  vi.restoreAllMocks();

  if (originalOpenAiModel === undefined) {
    delete process.env.OPENAI_MODEL;
  } else {
    process.env.OPENAI_MODEL = originalOpenAiModel;
  }

  if (originalOpenAiApiKey === undefined) {
    delete process.env.OPENAI_API_KEY;
  } else {
    process.env.OPENAI_API_KEY = originalOpenAiApiKey;
  }
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
    process.env.OPENAI_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                main: "Test Main",
                coreRationale: "Test Rationale",
              }),
            },
          },
        ],
      }),
    }));

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
    expect(body.references.length).toBeLessThanOrEqual(MAX_REFERENCES_IN_RESPONSE);
  });

  it("maps OpenAI failures to LLM_UPSTREAM_ERROR", async () => {
    process.env.OPENAI_MODEL = "gpt-5-mini";
    process.env.OPENAI_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({}),
    }));

    const response = await POST(
      new Request("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Was ist ein Hebelpunkt?" }),
      }),
    );

    const body = (await response.json()) as { status: string; error: { code: string } };

    expect(response.status).toBe(502);
    expect(body.status).toBe("error");
    expect(body.error.code).toBe("LLM_UPSTREAM_ERROR");
  });
});
