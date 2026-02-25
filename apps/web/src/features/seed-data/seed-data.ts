import {
  ONTOLOGY_NODE_TYPES,
  ONTOLOGY_RELATION_TYPES,
  isAllowedOntologyRelation,
  type OntologyNodeType,
  type OntologyRelationType,
} from "@/features/ontology/ontology";

export type SeedNode = {
  id: string;
  nodeType: OntologyNodeType;
  title?: string;
  name?: string;
  summary: string;
  embedding?: number[];
};

export type SeedEdge = {
  type: OntologyRelationType;
  fromNodeId: string;
  toNodeId: string;
};

export type SeedDataset = {
  nodes: SeedNode[];
  edges: SeedEdge[];
};

export type SeedValidationResult = {
  valid: boolean;
  errors: string[];
};

const AUTHOR_COUNT = 10;
const BOOK_COUNT = 20;
const CONCEPT_COUNT = 70;
const PROBLEM_COUNT = 30;

/**
 * Zweck:
 * Erzeugt ein kleines, deterministisches Embedding fuer Demo- und Testdaten.
 *
 * Input:
 * - seed: numerischer Startwert fuer die Ableitung der vier Embedding-Dimensionen
 *
 * Output:
 * - number[] mit genau vier Werten
 *
 * Fehlerfall:
 * - Kein expliziter Throw; bei ungeeigneten Inputs kann die Qualitaet der Werte sinken
 *
 * Beispiel:
 * - buildEmbedding(1) -> [0.01, 0.04, 0.07, 0.1]
 */
function buildEmbedding(seed: number): number[] {
  return [
    Number((seed / 100).toFixed(2)),
    Number(((seed + 3) / 100).toFixed(2)),
    Number(((seed + 6) / 100).toFixed(2)),
    Number(((seed + 9) / 100).toFixed(2)),
  ];
}

/**
 * Zweck:
 * Baut einen deterministischen Seed-Datensatz fuer die vier Ontologie-Node-Typen
 * und die erlaubten Relations-Typen auf.
 *
 * Input:
 * - keiner
 *
 * Output:
 * - SeedDataset mit arrays fuer nodes und edges
 *
 * Fehlerfall:
 * - Kein expliziter Throw; Fachfehler werden nachgelagert ueber validateSeedDataset erkannt
 *
 * Beispiel:
 * - const dataset = createSeedDataset()
 * - dataset.nodes.length === 130
 * - dataset.edges.length === 315
 */
export function createSeedDataset(): SeedDataset {
  const authors: SeedNode[] = Array.from({ length: AUTHOR_COUNT }, (_, index) => ({
    id: `author:${index + 1}`,
    nodeType: "Author",
    name: `Author ${index + 1}`,
    summary: `Autor ${index + 1} mit Fokus auf systemisches Denken.`,
  }));

  const books: SeedNode[] = Array.from({ length: BOOK_COUNT }, (_, index) => ({
    id: `book:${index + 1}`,
    nodeType: "Book",
    title: `Systems Book ${index + 1}`,
    summary: `Buch ${index + 1} zu Prinzipien von Systemmodellen.`,
  }));

  const concepts: SeedNode[] = Array.from({ length: CONCEPT_COUNT }, (_, index) => ({
    id: `concept:${index + 1}`,
    nodeType: "Concept",
    title: `Concept ${index + 1}`,
    summary: `Konzept ${index + 1} fuer Analyse von Systemdynamik.`,
    embedding: buildEmbedding(index + 1),
  }));

  const problems: SeedNode[] = Array.from({ length: PROBLEM_COUNT }, (_, index) => ({
    id: `problem:${index + 1}`,
    nodeType: "Problem",
    title: `Problem ${index + 1}`,
    summary: `Problem ${index + 1} in vernetzten Organisationssystemen.`,
    embedding: buildEmbedding(index + 101),
  }));

  const nodes: SeedNode[] = [...authors, ...books, ...concepts, ...problems];

  const edges: SeedEdge[] = [];

  for (let index = 0; index < books.length; index += 1) {
    edges.push({
      type: "WROTE",
      fromNodeId: authors[index % authors.length].id,
      toNodeId: books[index].id,
    });
  }

  for (let index = 0; index < books.length; index += 1) {
    edges.push({
      type: "EXPLAINS",
      fromNodeId: books[index].id,
      toNodeId: concepts[(index * 3) % concepts.length].id,
    });
    edges.push({
      type: "EXPLAINS",
      fromNodeId: books[index].id,
      toNodeId: concepts[(index * 3 + 1) % concepts.length].id,
    });
    edges.push({
      type: "EXPLAINS",
      fromNodeId: books[index].id,
      toNodeId: concepts[(index * 3 + 2) % concepts.length].id,
    });
  }

  for (let index = 0; index < books.length; index += 1) {
    edges.push({
      type: "ADDRESSES",
      fromNodeId: books[index].id,
      toNodeId: problems[(index * 2) % problems.length].id,
    });
    edges.push({
      type: "ADDRESSES",
      fromNodeId: books[index].id,
      toNodeId: problems[(index * 2 + 1) % problems.length].id,
    });
  }

  for (let index = 0; index < problems.length; index += 1) {
    edges.push({
      type: "RELATES_TO",
      fromNodeId: problems[index].id,
      toNodeId: concepts[(index * 2) % concepts.length].id,
    });
    edges.push({
      type: "RELATES_TO",
      fromNodeId: problems[index].id,
      toNodeId: concepts[(index * 2 + 1) % concepts.length].id,
    });
    edges.push({
      type: "RELATES_TO",
      fromNodeId: problems[index].id,
      toNodeId: concepts[(index * 2 + 2) % concepts.length].id,
    });
  }

  for (let index = 0; index < concepts.length; index += 1) {
    edges.push({
      type: "INFLUENCES",
      fromNodeId: concepts[index].id,
      toNodeId: concepts[(index + 1) % concepts.length].id,
    });
  }

  for (let index = 0; index < concepts.length; index += 2) {
    edges.push({
      type: "CONTRASTS_WITH",
      fromNodeId: concepts[index].id,
      toNodeId: concepts[(index + 5) % concepts.length].id,
    });
  }

  return { nodes, edges };
}

/**
 * Zweck:
 * Prueft einen Seed-Datensatz auf Schema-, Referenz- und Ontologie-Konformitaet.
 *
 * Input:
 * - dataset: SeedDataset
 *
 * Output:
 * - SeedValidationResult mit valid-Flag und Fehlerliste
 *
 * Fehlerfall:
 * - Kein Throw; alle Validierungsfehler werden gesammelt in errors zurueckgegeben
 *
 * Beispiel:
 * - const result = validateSeedDataset(createSeedDataset())
 * - result.valid === true
 */
export function validateSeedDataset(dataset: SeedDataset): SeedValidationResult {
  const errors: string[] = [];
  const nodeMap = new Map<string, SeedNode>();

  for (const node of dataset.nodes) {
    if (!ONTOLOGY_NODE_TYPES.includes(node.nodeType)) {
      errors.push(`Node ${node.id} hat ungueltigen Node-Type ${node.nodeType}.`);
    }

    if (!node.id.trim()) {
      errors.push("Node mit leerer ID gefunden.");
      continue;
    }

    if (nodeMap.has(node.id)) {
      errors.push(`Node-ID ${node.id} ist nicht eindeutig.`);
      continue;
    }

    if (!node.summary.trim()) {
      errors.push(`Node ${node.id} hat leeres Pflichtfeld summary.`);
    }

    if (node.nodeType === "Author") {
      if (!node.name || !node.name.trim()) {
        errors.push(`Author ${node.id} hat kein Pflichtfeld name.`);
      }
    } else if (!node.title || !node.title.trim()) {
      errors.push(`Node ${node.id} hat kein Pflichtfeld title.`);
    }

    if (node.nodeType === "Concept" || node.nodeType === "Problem") {
      if (!node.embedding || node.embedding.length === 0) {
        errors.push(`Node ${node.id} hat kein Pflichtfeld embedding.`);
      }
    }

    nodeMap.set(node.id, node);
  }

  const edgeKeys = new Set<string>();

  for (const edge of dataset.edges) {
    if (!ONTOLOGY_RELATION_TYPES.includes(edge.type)) {
      errors.push(`Edge ${edge.fromNodeId}->${edge.toNodeId} hat ungueltigen Typ ${edge.type}.`);
      continue;
    }

    const edgeKey = `${edge.type}:${edge.fromNodeId}:${edge.toNodeId}`;
    if (edgeKeys.has(edgeKey)) {
      errors.push(`Edge ${edgeKey} ist nicht eindeutig.`);
      continue;
    }
    edgeKeys.add(edgeKey);

    const fromNode = nodeMap.get(edge.fromNodeId);
    const toNode = nodeMap.get(edge.toNodeId);

    if (!fromNode || !toNode) {
      errors.push(`Edge ${edgeKey} referenziert unbekannte Nodes.`);
      continue;
    }

    if (!isAllowedOntologyRelation(edge.type, fromNode.nodeType, toNode.nodeType)) {
      errors.push(
        `Edge ${edgeKey} verletzt Ontologie-Regel fuer ${fromNode.nodeType} -> ${toNode.nodeType}.`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
