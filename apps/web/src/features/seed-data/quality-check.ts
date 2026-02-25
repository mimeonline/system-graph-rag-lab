import {
  ONTOLOGY_NODE_TYPES,
  ONTOLOGY_RELATION_TYPES,
  isAllowedOntologyRelation,
} from "@/features/ontology/ontology";
import type {
  CuratedSourceEntry,
  SeedDataset,
  SeedEdge,
  SeedNode,
  SeedSourceType,
} from "@/features/seed-data/seed-data";

export type SeedQualityCounters = {
  checked: number;
  beanstandet: number;
  ausgeschlossen: number;
};

export type SeedQualityIssue = {
  scope: "source" | "node" | "edge";
  entryId: string;
  sourceType: SeedSourceType;
  reason: string;
};

export type SeedQualityReport = {
  sources: SeedQualityCounters;
  nodes: SeedQualityCounters;
  edges: SeedQualityCounters;
  bySourceType: Record<SeedSourceType, SeedQualityCounters>;
  issues: SeedQualityIssue[];
};

export type SeedQualityCheckResult = {
  valid: boolean;
  dataset: SeedDataset;
  report: SeedQualityReport;
};

function createCounters(checked = 0): SeedQualityCounters {
  return {
    checked,
    beanstandet: 0,
    ausgeschlossen: 0,
  };
}

function pushIssue(
  report: SeedQualityReport,
  scope: SeedQualityIssue["scope"],
  entryId: string,
  sourceType: SeedSourceType,
  reason: string,
): void {
  report.issues.push({
    scope,
    entryId,
    sourceType,
    reason,
  });
}

function markBeanstandet(
  counters: SeedQualityCounters,
  sourceTypeCounters: SeedQualityCounters,
): void {
  counters.beanstandet += 1;
  counters.ausgeschlossen += 1;
  sourceTypeCounters.beanstandet += 1;
  sourceTypeCounters.ausgeschlossen += 1;
}

/**
 * Zweck:
 * Fuehrt die Qualitätsprüfung für Seed-Daten aus und erzeugt ein Prüfprotokoll mit
 * geprueften, beanstandeten und ausgeschlossenen Einträgen inklusive Herkunftssplit.
 *
 * Input:
 * - dataset: Normalisierte Seed-Datenbasis mit sources, nodes und edges.
 *
 * Output:
 * - SeedQualityCheckResult mit gefiltertem, qualitätsgesichertem Datensatz und Prüfprotokoll.
 *
 * Fehlerfall:
 * - Kein Throw; Verstöße werden im report.issues erfasst und betroffene Einträge ausgeschlossen.
 *
 * Beispiel:
 * - const result = runSeedDatasetQualityCheck(createSeedDataset())
 * - result.report.bySourceType.primary_md.checked > 0
 */
export function runSeedDatasetQualityCheck(dataset: SeedDataset): SeedQualityCheckResult {
  const report: SeedQualityReport = {
    sources: createCounters(dataset.sources.length),
    nodes: createCounters(dataset.nodes.length),
    edges: createCounters(dataset.edges.length),
    bySourceType: {
      primary_md: createCounters(),
      optional_internet: createCounters(),
    },
    issues: [],
  };

  const curatedSourceKeys = new Set<string>();
  const validSources: CuratedSourceEntry[] = [];

  for (const source of dataset.sources) {
    report.bySourceType[source.sourceType].checked += 1;

    let hasIssue = false;
    const sourceKey = `${source.sourceType}:${source.sourceFile}`;

    if (!source.sourceFile.trim()) {
      hasIssue = true;
      pushIssue(report, "source", source.sourceId, source.sourceType, "leeres sourceFile");
    }

    if (curatedSourceKeys.has(sourceKey)) {
      hasIssue = true;
      pushIssue(report, "source", source.sourceId, source.sourceType, "duplizierte Quelle");
    }

    if (
      source.internalSource.sourceType !== source.sourceType ||
      source.internalSource.sourceFile !== source.sourceFile
    ) {
      hasIssue = true;
      pushIssue(
        report,
        "source",
        source.sourceId,
        source.sourceType,
        "inkonsistente internalSource-Felder",
      );
    }

    if (!source.publicReference.citation.trim()) {
      hasIssue = true;
      pushIssue(report, "source", source.sourceId, source.sourceType, "leere publicReference.citation");
    }

    if (hasIssue) {
      markBeanstandet(report.sources, report.bySourceType[source.sourceType]);
      continue;
    }

    curatedSourceKeys.add(sourceKey);
    validSources.push(source);
  }

  const nodeMap = new Map<string, SeedNode>();
  const validNodes: SeedNode[] = [];

  for (const node of dataset.nodes) {
    report.bySourceType[node.sourceType].checked += 1;

    let hasIssue = false;

    if (!node.id.trim()) {
      hasIssue = true;
      pushIssue(report, "node", node.id || "<empty>", node.sourceType, "leere node id");
    }

    if (!ONTOLOGY_NODE_TYPES.includes(node.nodeType)) {
      hasIssue = true;
      pushIssue(report, "node", node.id, node.sourceType, "ungueltiger nodeType");
    }

    if (nodeMap.has(node.id)) {
      hasIssue = true;
      pushIssue(report, "node", node.id, node.sourceType, "duplizierte node id");
    }

    if (!node.summary.trim()) {
      hasIssue = true;
      pushIssue(report, "node", node.id, node.sourceType, "leeres summary");
    }

    if (node.nodeType === "Author") {
      if (!node.name || !node.name.trim()) {
        hasIssue = true;
        pushIssue(report, "node", node.id, node.sourceType, "fehlendes name fuer Author");
      }
    } else if (!node.title || !node.title.trim()) {
      hasIssue = true;
      pushIssue(report, "node", node.id, node.sourceType, "fehlendes title");
    }

    if ((node.nodeType === "Concept" || node.nodeType === "Tool" || node.nodeType === "Problem") && (!node.embedding || node.embedding.length === 0)) {
      hasIssue = true;
      pushIssue(report, "node", node.id, node.sourceType, "fehlendes embedding");
    }

    const sourceKey = `${node.sourceType}:${node.sourceFile}`;
    if (!curatedSourceKeys.has(sourceKey)) {
      hasIssue = true;
      pushIssue(report, "node", node.id, node.sourceType, "unbekannte Quelle");
    }

    if (
      node.internalSource.sourceType !== node.sourceType ||
      node.internalSource.sourceFile !== node.sourceFile
    ) {
      hasIssue = true;
      pushIssue(report, "node", node.id, node.sourceType, "inkonsistente internalSource-Felder");
    }

    if (!node.publicReference.citation.trim()) {
      hasIssue = true;
      pushIssue(report, "node", node.id, node.sourceType, "leere publicReference.citation");
    }

    if (hasIssue) {
      markBeanstandet(report.nodes, report.bySourceType[node.sourceType]);
      continue;
    }

    nodeMap.set(node.id, node);
    validNodes.push(node);
  }

  const edgeKeys = new Set<string>();
  const validEdges: SeedEdge[] = [];

  for (const edge of dataset.edges) {
    report.bySourceType[edge.sourceType].checked += 1;

    let hasIssue = false;
    const edgeKey = `${edge.type}:${edge.fromNodeId}:${edge.toNodeId}`;

    if (!ONTOLOGY_RELATION_TYPES.includes(edge.type)) {
      hasIssue = true;
      pushIssue(report, "edge", edgeKey, edge.sourceType, "ungueltiger relation type");
    }

    if (edgeKeys.has(edgeKey)) {
      hasIssue = true;
      pushIssue(report, "edge", edgeKey, edge.sourceType, "duplizierte relation");
    }

    const fromNode = nodeMap.get(edge.fromNodeId);
    const toNode = nodeMap.get(edge.toNodeId);
    if (!fromNode || !toNode) {
      hasIssue = true;
      pushIssue(report, "edge", edgeKey, edge.sourceType, "referenziert ungueltige nodes");
    } else if (!isAllowedOntologyRelation(edge.type, fromNode.nodeType, toNode.nodeType)) {
      hasIssue = true;
      pushIssue(report, "edge", edgeKey, edge.sourceType, "verletzt ontologie relation");
    }

    if (!edge.sourceFile.trim()) {
      hasIssue = true;
      pushIssue(report, "edge", edgeKey, edge.sourceType, "leeres sourceFile");
    }

    const sourceKey = `${edge.sourceType}:${edge.sourceFile}`;
    if (!curatedSourceKeys.has(sourceKey)) {
      hasIssue = true;
      pushIssue(report, "edge", edgeKey, edge.sourceType, "unbekannte Quelle");
    }

    if (
      edge.internalSource.sourceType !== edge.sourceType ||
      edge.internalSource.sourceFile !== edge.sourceFile
    ) {
      hasIssue = true;
      pushIssue(report, "edge", edgeKey, edge.sourceType, "inkonsistente internalSource-Felder");
    }

    if (!edge.publicReference.citation.trim()) {
      hasIssue = true;
      pushIssue(report, "edge", edgeKey, edge.sourceType, "leere publicReference.citation");
    }

    if (hasIssue) {
      markBeanstandet(report.edges, report.bySourceType[edge.sourceType]);
      continue;
    }

    edgeKeys.add(edgeKey);
    validEdges.push(edge);
  }

  return {
    valid: report.issues.length === 0,
    dataset: {
      sources: validSources,
      nodes: validNodes,
      edges: validEdges,
    },
    report,
  };
}
