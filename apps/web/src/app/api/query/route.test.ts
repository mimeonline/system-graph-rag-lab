import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/query/route";
import { MAX_REFERENCES_IN_RESPONSE } from "@/features/query/answer";

const runMock = vi.fn();
const sessionMock = {
  run: runMock,
  close: vi.fn().mockResolvedValue(undefined),
};
const driverMock = {
  session: vi.fn(() => sessionMock),
  close: vi.fn().mockResolvedValue(undefined),
};

const DEFAULT_NEO4J_VECTOR_INDEX_NAME = "node_embedding_index";

vi.mock("neo4j-driver", () => ({
  __esModule: true,
  default: {
    driver: () => driverMock,
    auth: {
      basic: () => ({}),
    },
  },
}));

const originalOpenAiModel = process.env.OPENAI_MODEL;
const originalOpenAiApiKey = process.env.OPENAI_API_KEY;
const originalOpenAiEmbeddingsModel = process.env.OPENAI_EMBEDDINGS_MODEL;
const originalNeo4jUri = process.env.NEO4J_URI;
const originalNeo4jDatabase = process.env.NEO4J_DATABASE;
const originalNeo4jUsername = process.env.NEO4J_USERNAME;
const originalNeo4jPassword = process.env.NEO4J_PASSWORD;
const originalNeo4jVectorIndexName = process.env.NEO4J_VECTOR_INDEX_NAME;

beforeEach(() => {
  runMock.mockReset();
});

afterEach(() => {
  runMock.mockReset();
  driverMock.session.mockClear();
  driverMock.close.mockClear();
  sessionMock.close.mockClear();
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

  if (originalOpenAiEmbeddingsModel === undefined) {
    delete process.env.OPENAI_EMBEDDINGS_MODEL;
  } else {
    process.env.OPENAI_EMBEDDINGS_MODEL = originalOpenAiEmbeddingsModel;
  }

  if (originalNeo4jUri === undefined) {
    delete process.env.NEO4J_URI;
  } else {
    process.env.NEO4J_URI = originalNeo4jUri;
  }

  if (originalNeo4jDatabase === undefined) {
    delete process.env.NEO4J_DATABASE;
  } else {
    process.env.NEO4J_DATABASE = originalNeo4jDatabase;
  }

  if (originalNeo4jUsername === undefined) {
    delete process.env.NEO4J_USERNAME;
  } else {
    process.env.NEO4J_USERNAME = originalNeo4jUsername;
  }

  if (originalNeo4jPassword === undefined) {
    delete process.env.NEO4J_PASSWORD;
  } else {
    process.env.NEO4J_PASSWORD = originalNeo4jPassword;
  }

  if (originalNeo4jVectorIndexName === undefined) {
    delete process.env.NEO4J_VECTOR_INDEX_NAME;
  } else {
    process.env.NEO4J_VECTOR_INDEX_NAME = originalNeo4jVectorIndexName;
  }
});

type FetchResponse = {
  ok?: boolean;
  status?: number;
  statusText?: string;
  json: unknown;
  text?: string;
};

function stubOpenAiFetch(options: { embeddings?: FetchResponse; chat?: FetchResponse }) {
  vi.stubGlobal("fetch", vi.fn(async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.includes("/embeddings")) {
      if (!options.embeddings) {
        throw new Error("Unexpected embeddings call.");
      }

      const body = options.embeddings.json ?? {};
      const textBody =
        options.embeddings.text ??
        (typeof body === "string" ? body : JSON.stringify(body, null, 0));
      return {
        ok: options.embeddings.ok ?? true,
        status: options.embeddings.status ?? 200,
        statusText: options.embeddings.statusText ?? "OK",
        json: async () => options.embeddings.json,
        text: async () => textBody,
      };
    }

    if (url.includes("/chat/completions")) {
      if (!options.chat) {
        throw new Error("Unexpected chat call.");
      }

      const body = options.chat.json ?? {};
      const textBody =
        options.chat.text ??
        (typeof body === "string" ? body : JSON.stringify(body, null, 0));
      return {
        ok: options.chat.ok ?? true,
        status: options.chat.status ?? 200,
        statusText: options.chat.statusText ?? "OK",
        json: async () => options.chat.json,
        text: async () => textBody,
      };
    }

    throw new Error(`Unhandled fetch target: ${url}`);
  }));
}

function createRecord(values: Record<string, unknown>) {
  return {
    get(key: string) {
      return values[key];
    },
  };
}

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
    stubOpenAiFetch({
      chat: {
        json: {
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
        },
      },
    });

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
    stubOpenAiFetch({
      chat: {
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
        json: {
          error: {
            message: "Upstream meltdown",
            code: "server_error",
          },
        },
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Was ist ein Hebelpunkt?" }),
      }),
    );

    const body = (await response.json()) as {
      status: string;
      error: { code: string; retryable: boolean; message: string };
    };

    expect(response.status).toBe(502);
    expect(body.status).toBe("error");
    expect(body.error.code).toBe("LLM_UPSTREAM_ERROR");
    expect(body.error.retryable).toBe(true);
    expect(body.error.message).toContain("OpenAI API error 502");
    expect(body.error.message).toContain("Upstream meltdown");
    expect(body.error.message).toContain("server_error");
  });

  it("treats OpenAI 4xx errors as non-retryable upstream failures", async () => {
    process.env.OPENAI_MODEL = "gpt-5-mini";
    process.env.OPENAI_API_KEY = "test-key";
    stubOpenAiFetch({
      chat: {
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: {
          error: {
            message: "Ungültiger Parameter",
            code: "invalid_input",
          },
        },
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Was ist ein Hebelpunkt?" }),
      }),
    );

    const body = (await response.json()) as {
      status: string;
      error: { code: string; retryable: boolean; message: string };
    };

    expect(response.status).toBe(502);
    expect(body.status).toBe("error");
    expect(body.error.code).toBe("LLM_UPSTREAM_ERROR");
    expect(body.error.retryable).toBe(false);
    expect(body.error.message).toContain("OpenAI API error 400");
    expect(body.error.message).toContain("Ungültiger Parameter");
    expect(body.error.message).toContain("code=invalid_input");
    expect(body.error.message).toContain("invalid_input");
  });

  it("uses Neo4j vector retrieval when configured", async () => {
    process.env.OPENAI_MODEL = "gpt-5-mini";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_EMBEDDINGS_MODEL = "text-embedding-3-small";
    process.env.NEO4J_URI = "bolt://localhost:7687";
    process.env.NEO4J_DATABASE = "neo4j";
    process.env.NEO4J_USERNAME = "neo4j";
    process.env.NEO4J_PASSWORD = "secret";

    runMock.mockResolvedValueOnce({
      records: [createRecord({ nodeId: "concept:feedback_loops", score: 0.91 })],
    });
    runMock.mockResolvedValueOnce({ records: [] });

    stubOpenAiFetch({
      embeddings: {
        json: {
          data: [{ embedding: [0.1, 0.2, 0.3, 0.4] }],
        },
      },
      chat: {
        json: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  main: "Graph Main",
                  coreRationale: "Graph Rationale",
                }),
              },
            },
          ],
        },
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Wie wirken Feedback Loops auf Systeme?" }),
      }),
    );

    const body = (await response.json()) as {
      status: string;
      references: Array<{ nodeId: string }>;
      context: { elements: Array<{ nodeId: string; source: { kind: string } }> };
      meta: { retrievedNodeCount: number };
    };

    expect(runMock).toHaveBeenCalled();
    const firstVectorCall = runMock.mock.calls[0]?.[1];
    expect(firstVectorCall).toBeDefined();
    expect(firstVectorCall).toEqual(
      expect.objectContaining({ vectorIndex: "node_embedding_index" }),
    );

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.references.length).toBeGreaterThan(0);
    expect(body.references[0].nodeId).toBe("concept:feedback_loops");
    expect(body.meta.retrievedNodeCount).toBe(body.references.length);
    expect(
      body.context.elements.some((element) => element.nodeId === "concept:feedback_loops"),
    ).toBe(true);
  });

  it("uses the default Neo4j vector index when the env var is missing", async () => {
    process.env.OPENAI_MODEL = "gpt-5-mini";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_EMBEDDINGS_MODEL = "text-embedding-3-small";
    process.env.NEO4J_URI = "bolt://localhost:7687";
    process.env.NEO4J_DATABASE = "neo4j";
    process.env.NEO4J_USERNAME = "neo4j";
    process.env.NEO4J_PASSWORD = "secret";
    delete process.env.NEO4J_VECTOR_INDEX_NAME;

    runMock.mockResolvedValueOnce({
      records: [createRecord({ nodeId: "concept:feedback_loops", score: 0.78 })],
    });
    runMock.mockResolvedValueOnce({ records: [] });

    stubOpenAiFetch({
      embeddings: {
        json: {
          data: [{ embedding: [0.1, 0.2, 0.3] }],
        },
      },
      chat: {
        json: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  main: "Default Index Main",
                  coreRationale: "Default Index Rationale",
                }),
              },
            },
          ],
        },
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Wie wirken Feedback Loops auf Systeme?" }),
      }),
    );

    const body = (await response.json()) as {
      status: string;
      references: Array<{ nodeId: string }>;
    };

    const firstCall = runMock.mock.calls[0];
    expect(firstCall).toBeDefined();
    const vectorParams = firstCall?.[1] as Record<string, unknown>;
    expect(vectorParams.vectorIndex).toBe(DEFAULT_NEO4J_VECTOR_INDEX_NAME);
    expect(body.status).toBe("ok");
    expect(body.references.length).toBeGreaterThan(0);
  });

  it("maps Neo4j downtime to GRAPH_BACKEND_UNAVAILABLE", async () => {
    process.env.OPENAI_MODEL = "gpt-5-mini";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_EMBEDDINGS_MODEL = "text-embedding-3-small";
    process.env.NEO4J_URI = "bolt://localhost:7687";
    process.env.NEO4J_DATABASE = "neo4j";
    process.env.NEO4J_USERNAME = "neo4j";
    process.env.NEO4J_PASSWORD = "secret";
    process.env.NEO4J_VECTOR_INDEX_NAME = "node_embedding_index";

    runMock.mockRejectedValueOnce(new Error("Connection lost"));

    stubOpenAiFetch({
      embeddings: {
        json: {
          data: [{ embedding: [0.1, 0.2] }],
        },
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Wie wirken Feedback Loops auf Systeme?" }),
      }),
    );

    const body = (await response.json()) as { status: string; error: { code: string } };

    expect(response.status).toBe(503);
    expect(body.status).toBe("error");
    expect(body.error.code).toBe("GRAPH_BACKEND_UNAVAILABLE");
  });

  it("falls back to lexical retrieval when vector index is missing", async () => {
    process.env.OPENAI_MODEL = "gpt-5-mini";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_EMBEDDINGS_MODEL = "text-embedding-3-small";
    process.env.NEO4J_URI = "bolt://localhost:7687";
    process.env.NEO4J_DATABASE = "neo4j";
    process.env.NEO4J_USERNAME = "neo4j";
    process.env.NEO4J_PASSWORD = "secret";
    process.env.NEO4J_VECTOR_INDEX_NAME = "node_embedding_index";

    runMock.mockRejectedValueOnce({ code: "Neo.ClientError.Schema.IndexNotFound" });

    stubOpenAiFetch({
      embeddings: {
        json: {
          data: [{ embedding: [0.4, 0.3, 0.2] }],
        },
      },
      chat: {
        json: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  main: "Fallback Main",
                  coreRationale: "Fallback Rationale",
                }),
              },
            },
          ],
        },
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Wie wirken Feedback Loops auf Systeme?" }),
      }),
    );

    const body = (await response.json()) as {
      status: string;
      references: unknown[];
      context: { elements: { source: { kind: string } }[] };
    };

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.references.length).toBeGreaterThan(0);
    expect(
      body.context.elements.every((element) => element.source.kind === "candidate"),
    ).toBe(true);
  });
});
