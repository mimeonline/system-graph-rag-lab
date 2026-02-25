import {
  createSeedDataset,
  validateSeedDataset,
  type SeedDataset,
  type SeedEdge,
  type SeedNode,
} from "@/features/seed-data/seed-data";

export type RuntimeSeedReadNode = Pick<
  SeedNode,
  "id" | "nodeType" | "title" | "name" | "summary" | "sourceType" | "sourceFile"
>;

export type RuntimeSeedReadEdge = Pick<
  SeedEdge,
  "type" | "fromNodeId" | "toNodeId" | "sourceType" | "sourceFile"
>;

export type RuntimeSeedReadResult = {
  nodes: RuntimeSeedReadNode[];
  edges: RuntimeSeedReadEdge[];
};

type RuntimeSeedReadOptions = {
  datasetFactory?: () => SeedDataset;
};

/**
 * Zweck:
 * Liest die normalisierte Seed-Datenbasis fuer den Runtime-Zugriff auf Nodes und Relationen.
 *
 * Input:
 * - options.datasetFactory: optionaler Factory-Hook fuer Tests, Default ist createSeedDataset
 *
 * Output:
 * - RuntimeSeedReadResult mit lesbaren Nodes und Relationen inklusive sourceType/sourceFile
 *
 * Fehlerfall:
 * - Throwt Error, wenn die Datenbasis gegen die Seed-Validierungsregeln verstoesst
 *
 * Beispiel:
 * - const result = readSeedDatasetForRuntime()
 * - result.nodes[0].sourceType ist primary_md oder optional_internet
 */
export function readSeedDatasetForRuntime(
  options: RuntimeSeedReadOptions = {},
): RuntimeSeedReadResult {
  const datasetFactory = options.datasetFactory ?? createSeedDataset;
  const dataset = datasetFactory();
  const validation = validateSeedDataset(dataset);

  if (!validation.valid) {
    throw new Error(`Seed-Datenbasis ist ungueltig: ${validation.errors.join(" | ")}`);
  }

  return {
    nodes: dataset.nodes.map((node) => ({
      id: node.id,
      nodeType: node.nodeType,
      title: node.title,
      name: node.name,
      summary: node.summary,
      sourceType: node.sourceType,
      sourceFile: node.sourceFile,
    })),
    edges: dataset.edges.map((edge) => ({
      type: edge.type,
      fromNodeId: edge.fromNodeId,
      toNodeId: edge.toNodeId,
      sourceType: edge.sourceType,
      sourceFile: edge.sourceFile,
    })),
  };
}
