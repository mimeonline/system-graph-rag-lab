import { createSeedDataset } from "@/features/seed-data/seed-data";

type FullGraphNode = {
  id: string;
  label: string;
  nodeType: string;
  description: string;
};

type FullGraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

type FullGraphResponse = {
  status: "ok";
  graph: {
    nodes: FullGraphNode[];
    edges: FullGraphEdge[];
  };
};

/**
 * Returns the full System Thinking graph from seed data for explorer traversal.
 */
export async function GET(): Promise<Response> {
  const dataset = createSeedDataset();

  const nodes: FullGraphNode[] = dataset.nodes.map((node) => ({
    id: node.id,
    label: node.title ?? node.name ?? node.id,
    nodeType: node.nodeType,
    description: node.shortDescription ?? node.summary,
  }));

  const edges: FullGraphEdge[] = dataset.edges.map((edge) => ({
    id: `${edge.type}:${edge.fromNodeId}:${edge.toNodeId}`,
    source: edge.fromNodeId,
    target: edge.toNodeId,
    label: edge.type,
  }));

  const body: FullGraphResponse = {
    status: "ok",
    graph: { nodes, edges },
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
