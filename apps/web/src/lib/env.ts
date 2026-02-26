const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 10;
const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 60;

export type QueryRuntimeEnv = {
  openAiApiKey: string | null;
  openAiModel: string | null;
  openAiEmbeddingsModel: string | null;
  neo4jUri: string | null;
  neo4jDatabase: string | null;
  neo4jUsername: string | null;
  neo4jPassword: string | null;
  neo4jVectorIndexName: string | null;
  allowDestructiveSeedReset: string | null;
  rateLimitMaxRequests: number;
  rateLimitWindowSeconds: number;
};

/**
 * Reads an optional env var and normalizes empty or whitespace-only values to null.
 */
function readOptionalEnv(key: string): string | null {
  const raw = process.env[key];
  if (!raw) {
    return null;
  }

  const value = raw.trim();
  return value.length > 0 ? value : null;
}

/**
 * Reads a positive integer env var and falls back when value is missing or invalid.
 */
function readOptionalNumberEnv(key: string, fallback: number): number {
  const value = readOptionalEnv(key);
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Collects query runtime configuration from process environment variables.
 */
export function getQueryRuntimeEnv(): QueryRuntimeEnv {
  return {
    openAiApiKey: readOptionalEnv("OPENAI_API_KEY"),
    openAiModel: readOptionalEnv("OPENAI_MODEL"),
    openAiEmbeddingsModel: readOptionalEnv("OPENAI_EMBEDDINGS_MODEL"),
    neo4jUri: readOptionalEnv("NEO4J_URI"),
    neo4jDatabase: readOptionalEnv("NEO4J_DATABASE"),
    neo4jUsername: readOptionalEnv("NEO4J_USERNAME"),
    neo4jPassword: readOptionalEnv("NEO4J_PASSWORD"),
    neo4jVectorIndexName: readOptionalEnv("NEO4J_VECTOR_INDEX_NAME"),
    allowDestructiveSeedReset: readOptionalEnv("ALLOW_DESTRUCTIVE_SEED_RESET"),
    rateLimitMaxRequests: readOptionalNumberEnv(
      "RATE_LIMIT_MAX_REQUESTS",
      DEFAULT_RATE_LIMIT_MAX_REQUESTS,
    ),
    rateLimitWindowSeconds: readOptionalNumberEnv(
      "RATE_LIMIT_WINDOW_SECONDS",
      DEFAULT_RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}
