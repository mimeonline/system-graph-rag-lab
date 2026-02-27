import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSeedDataset } from "../src/features/seed-data/seed-data";

const EMBEDDINGS_ENDPOINT = "https://api.openai.com/v1/embeddings";
const TARGET_EMBEDDING_DIMENSIONS = 4;
const TARGET_NODE_TYPES = new Set(["Concept", "Tool", "Problem"]);

type EmbeddingResponse = {
  data?: Array<{
    embedding?: number[];
    index?: number;
  }>;
};

/**
 * Validates that an env var value is present and returns a trimmed string.
 */
function assertNonEmpty(value: string | undefined, field: string): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required env var: ${field}`);
  }

  return value.trim();
}

/**
 * Escapes regex metacharacters so IDs can be matched literally in RegExp patterns.
 */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Formats one embedding vector as a deterministic TypeScript array literal.
 */
function formatEmbedding(vector: number[]): string {
  return `[${vector.map((value) => Number(value.toFixed(8))).join(", ")}]`;
}

/**
 * Builds the embedding input text from node label and descriptions.
 */
function buildEmbeddingText(node: {
  title?: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  summary: string;
}): string {
  const label = node.title ?? node.name ?? "";
  const description =
    node.longDescription?.trim() ||
    node.shortDescription?.trim() ||
    node.summary;
  return `${label}\n${description}`.trim();
}

/**
 * Requests embeddings for all inputs and validates response order and dimensions.
 */
async function fetchEmbeddings(options: {
  apiKey: string;
  model: string;
  inputs: string[];
}): Promise<number[][]> {
  const response = await fetch(EMBEDDINGS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      input: options.inputs,
      dimensions: TARGET_EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Embedding request failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as EmbeddingResponse;
  if (!Array.isArray(payload.data) || payload.data.length !== options.inputs.length) {
    throw new Error("Embedding response length mismatch.");
  }

  const vectors = payload.data
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((item) => item.embedding);

  for (const vector of vectors) {
    if (!Array.isArray(vector) || vector.length !== TARGET_EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Embedding dimensions mismatch. Expected ${TARGET_EMBEDDING_DIMENSIONS}.`,
      );
    }
  }

  return vectors as number[][];
}

/**
 * Refreshes seed embeddings by calling OpenAI and replacing vectors in seed-data.ts.
 */
async function main(): Promise<void> {
  const apiKey = assertNonEmpty(process.env.OPENAI_API_KEY, "OPENAI_API_KEY");
  const model = process.env.OPENAI_EMBEDDINGS_MODEL?.trim() || "text-embedding-3-small";
  const dataset = createSeedDataset();
  const targetNodes = dataset.nodes.filter((node) => TARGET_NODE_TYPES.has(node.nodeType));

  const inputs = targetNodes.map((node) => buildEmbeddingText(node));
  const vectors = await fetchEmbeddings({ apiKey, model, inputs });
  const vectorByNodeId = new Map<string, number[]>();
  for (let index = 0; index < targetNodes.length; index += 1) {
    vectorByNodeId.set(targetNodes[index]!.id, vectors[index]!);
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const seedDataPath = path.resolve(scriptDir, "../src/features/seed-data/seed-data.ts");
  let content = readFileSync(seedDataPath, "utf8");

  let replacedCount = 0;
  for (const [nodeId, vector] of vectorByNodeId.entries()) {
    const pattern = new RegExp(
      `(id:\\s*"${escapeRegex(nodeId)}"[\\s\\S]*?embedding:\\s*)\\[[^\\]]*\\]`,
      "m",
    );
    if (!pattern.test(content)) {
      continue;
    }

    content = content.replace(pattern, `$1${formatEmbedding(vector)}`);
    replacedCount += 1;
  }

  writeFileSync(seedDataPath, content, "utf8");
  console.log(
    `Updated embeddings for ${replacedCount}/${targetNodes.length} nodes using model ${model} (dimensions=${TARGET_EMBEDDING_DIMENSIONS}).`,
  );
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Embedding refresh failed.");
  }
  process.exitCode = 1;
});
