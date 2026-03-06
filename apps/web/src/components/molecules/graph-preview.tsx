import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { HomeGraphModel, HomeGraphNode } from "@/features/home/graph-view-model";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import dagre from "cytoscape-dagre";
import { useEffect, useMemo, useRef, useState } from "react";

type GraphLayoutMode = "force" | "hierarchy-vertical" | "hierarchy-horizontal";
type GraphPresetMode = "all" | "concepts-tools" | "archetypes" | "problems-interventions";
type ContextHopMode = "1" | "2";

type MiniMapSnapshot = {
  nodes: Array<{ id: string; x: number; y: number; nodeType: string }>;
  edges: Array<{ source: string; target: string }>;
};

type GraphPreviewProps = {
  model: HomeGraphModel;
  locale?: "de" | "en";
  variant?: "default" | "expanded";
  interactive?: boolean;
  initialLayout?: GraphLayoutMode;
  highlightNodeIds?: string[];
};

type PersistedExplorerSettings = {
  layoutMode: GraphLayoutMode;
  presetMode: GraphPresetMode;
  enabledEdgeLabels: string[];
  pathToAnswerMode: boolean;
  contextHopMode: ContextHopMode;
};

const GRAPH_HEIGHT_PX_BY_VARIANT: Record<NonNullable<GraphPreviewProps["variant"]>, number> = {
  default: 400,
  expanded: 560,
};
const EXPLORER_SETTINGS_STORAGE_KEY = "graph-explorer-settings-v1";

const NODE_SIZE_BY_KIND: Record<HomeGraphNode["kind"], { width: number; height: number }> = {
  query: { width: 120, height: 42 },
  reference: { width: 116, height: 48 },
  evidence: { width: 120, height: 52 },
};

let dagreRegistered = false;

function isCyActive(cy: Core | null | undefined): cy is Core {
  if (!cy) {
    return false;
  }
  try {
    const destroyed = (cy as unknown as { destroyed?: () => boolean }).destroyed?.() ?? false;
    return !destroyed;
  } catch {
    return false;
  }
}

function withCySafely(cy: Core | null | undefined, action: (activeCy: Core) => void): void {
  if (!isCyActive(cy)) {
    return;
  }
  try {
    action(cy);
  } catch {
    // Ignore race conditions while Cytoscape instance is being torn down.
  }
}

function getNodeTypeLegend(locale: "de" | "en"): Array<{
  key: string;
  label: string;
  bgClass: string;
  borderClass: string;
}> {
  return [
    { key: "query", label: locale === "en" ? "Question" : "Frage", bgClass: "bg-blue-100", borderClass: "border-blue-800" },
    { key: "concept", label: "Concept", bgClass: "bg-blue-100", borderClass: "border-blue-700" },
    { key: "tool", label: "Tool", bgClass: "bg-emerald-100", borderClass: "border-emerald-700" },
    { key: "problem", label: "Problem", bgClass: "bg-orange-100", borderClass: "border-orange-700" },
    { key: "book", label: "Book", bgClass: "bg-violet-100", borderClass: "border-violet-700" },
    { key: "author", label: "Author", bgClass: "bg-amber-100", borderClass: "border-amber-700" },
    { key: "evidence", label: locale === "en" ? "Evidence" : "Beleg", bgClass: "bg-slate-100", borderClass: "border-slate-500" },
    { key: "answer", label: locale === "en" ? "Answer" : "Antwort", bgClass: "bg-indigo-100", borderClass: "border-indigo-700" },
  ];
}

function ensureDagreRegistered(): void {
  if (!dagreRegistered) {
    cytoscape.use(dagre);
    dagreRegistered = true;
  }
}

function toElements(model: HomeGraphModel): ElementDefinition[] {
  const nodes: ElementDefinition[] = model.nodes.map((node) => {
    const size = NODE_SIZE_BY_KIND[node.kind];
    return {
      position: {
        x: node.x,
        y: node.y,
      },
      data: {
        id: node.id,
        label: fitNodeLabel(node.compactLabel ?? node.label),
        fullLabel: node.label,
        shortDescription: node.shortDescription,
        longDescription: node.longDescription,
        url: node.url,
        kind: node.kind,
        nodeType: normalizeNodeType(node),
        width: size.width,
        height: size.height,
      },
    };
  });

  const edges: ElementDefinition[] = model.edges.map((edge) => ({
    data: {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
    },
  }));

  return [...nodes, ...edges];
}

function shouldIncludeNodeByPreset(node: HomeGraphNode, preset: GraphPresetMode): boolean {
  if (preset === "all") {
    return true;
  }

  const nodeType = normalizeNodeType(node);
  const label = `${node.label} ${node.compactLabel ?? ""}`.toLowerCase();

  if (preset === "concepts-tools") {
    return nodeType === "concept" || nodeType === "tool" || nodeType === "query" || nodeType === "evidence";
  }

  if (preset === "archetypes") {
    return (
      label.includes("archetype") ||
      label.includes("trap") ||
      nodeType === "query" ||
      nodeType === "evidence"
    );
  }

  if (preset === "problems-interventions") {
    return (
      nodeType === "problem" ||
      nodeType === "tool" ||
      label.includes("leverage") ||
      label.includes("policy") ||
      nodeType === "query" ||
      nodeType === "evidence"
    );
  }

  return true;
}

function applyGraphPreset(model: HomeGraphModel, preset: GraphPresetMode): HomeGraphModel {
  const allowedNodeIds = new Set(
    model.nodes.filter((node) => shouldIncludeNodeByPreset(node, preset)).map((node) => node.id),
  );
  const filteredEdges = model.edges.filter(
    (edge) => allowedNodeIds.has(edge.source) && allowedNodeIds.has(edge.target),
  );
  const connectedNodeIds = new Set<string>();
  for (const edge of filteredEdges) {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  }
  const filteredNodes = model.nodes.filter(
    (node) => connectedNodeIds.has(node.id) || node.kind === "query",
  );

  if (filteredNodes.length === 0) {
    return model;
  }

  return {
    ...model,
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

function applyPathToAnswerFilter(model: HomeGraphModel): HomeGraphModel {
  const queryNodes = model.nodes.filter((node) => normalizeNodeType(node) === "query");
  const answerNodes = model.nodes.filter((node) => normalizeNodeType(node) === "answer");
  if (queryNodes.length === 0 || answerNodes.length === 0) {
    return model;
  }

  const answerIds = new Set(answerNodes.map((node) => node.id));
  const incomingByTarget = new Map<string, string[]>();
  for (const edge of model.edges) {
    const incoming = incomingByTarget.get(edge.target) ?? [];
    incoming.push(edge.source);
    incomingByTarget.set(edge.target, incoming);
  }

  const keepNodeIds = new Set<string>(answerNodes.map((node) => node.id));
  const queue = [...answerNodes.map((node) => node.id)];
  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) {
      continue;
    }
    const incoming = incomingByTarget.get(currentId) ?? [];
    for (const sourceId of incoming) {
      if (!keepNodeIds.has(sourceId)) {
        keepNodeIds.add(sourceId);
        queue.push(sourceId);
      }
    }
  }

  for (const queryNode of queryNodes) {
    keepNodeIds.add(queryNode.id);
  }

  const filteredEdges = model.edges.filter(
    (edge) => keepNodeIds.has(edge.source) && keepNodeIds.has(edge.target),
  );
  const connectedNodeIds = new Set<string>();
  for (const edge of filteredEdges) {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  }
  for (const queryNode of queryNodes) {
    connectedNodeIds.add(queryNode.id);
  }

  const filteredNodes = model.nodes.filter((node) => connectedNodeIds.has(node.id));
  if (filteredNodes.length === 0 || filteredEdges.length === 0 || answerIds.size === 0) {
    return model;
  }

  return {
    ...model,
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

function applyPinnedNodeContextFilter(
  model: HomeGraphModel,
  pinnedNodeId: string,
  hopDepth: number,
): HomeGraphModel {
  const hasPinnedNode = model.nodes.some((node) => node.id === pinnedNodeId);
  if (!hasPinnedNode) {
    return model;
  }

  const adjacency = new Map<string, Set<string>>();
  for (const edge of model.edges) {
    const sourceNeighbors = adjacency.get(edge.source) ?? new Set<string>();
    sourceNeighbors.add(edge.target);
    adjacency.set(edge.source, sourceNeighbors);

    const targetNeighbors = adjacency.get(edge.target) ?? new Set<string>();
    targetNeighbors.add(edge.source);
    adjacency.set(edge.target, targetNeighbors);
  }

  const keepNodeIds = new Set<string>([pinnedNodeId]);
  let frontier = new Set<string>([pinnedNodeId]);
  for (let hop = 0; hop < hopDepth; hop += 1) {
    const nextFrontier = new Set<string>();
    for (const nodeId of frontier) {
      const neighbors = adjacency.get(nodeId) ?? new Set<string>();
      for (const neighborId of neighbors) {
        if (!keepNodeIds.has(neighborId)) {
          keepNodeIds.add(neighborId);
          nextFrontier.add(neighborId);
        }
      }
    }
    frontier = nextFrontier;
    if (frontier.size === 0) {
      break;
    }
  }

  const filteredEdges = model.edges.filter(
    (edge) => keepNodeIds.has(edge.source) && keepNodeIds.has(edge.target),
  );
  const filteredNodes = model.nodes.filter((node) => keepNodeIds.has(node.id));

  return {
    ...model,
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

function buildMiniMapSnapshot(cy: Core): MiniMapSnapshot {
  const nodes = cy.nodes().map((node) => ({
    id: String(node.id()),
    x: Number(node.position("x")),
    y: Number(node.position("y")),
    nodeType: String(node.data("nodeType") ?? node.data("kind") ?? "reference"),
  }));
  const edges = cy.edges().map((edge) => ({
    source: String(edge.data("source") ?? ""),
    target: String(edge.data("target") ?? ""),
  }));
  return { nodes, edges };
}

function buildLayout(mode: GraphLayoutMode, nodeCount: number): cytoscape.LayoutOptions {
  if (mode === "force") {
    const denseGraph = nodeCount >= 40;
    return {
      name: "cose",
      animate: false,
      fit: true,
      padding: denseGraph ? 52 : 34,
      randomize: false,
      nodeDimensionsIncludeLabels: true,
      avoidOverlap: true,
      componentSpacing: denseGraph ? 180 : 120,
      nodeRepulsion: denseGraph ? 220000 : 70000,
      nodeOverlap: 0,
      idealEdgeLength: denseGraph ? 180 : 130,
      edgeElasticity: 140,
      gravity: 0.25,
      numIter: denseGraph ? 3400 : 2400,
      coolingFactor: 0.95,
      minTemp: 1.0,
    } as unknown as cytoscape.LayoutOptions;
  }

  return {
    name: "dagre",
    rankDir: mode === "hierarchy-horizontal" ? "LR" : "TB",
    fit: true,
    animate: false,
    nodeSep: 48,
    rankSep: 94,
    edgeSep: 20,
    padding: 20,
  } as unknown as cytoscape.LayoutOptions;
}

function computeForceSeedPositions(nodes: HomeGraphNode[]): Map<string, { x: number; y: number }> {
  const sorted = [...nodes].sort((a, b) => a.id.localeCompare(b.id));
  const map = new Map<string, { x: number; y: number }>();
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  sorted.forEach((node, index) => {
    const angle = index * goldenAngle;
    const radius = 120 * Math.sqrt(index + 1);
    map.set(node.id, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  });

  return resolveSeedOverlaps(map, 128);
}

function resolveSeedOverlaps(
  positions: Map<string, { x: number; y: number }>,
  minDistance: number,
): Map<string, { x: number; y: number }> {
  const entries = Array.from(positions.entries());
  const minDistanceSq = minDistance * minDistance;

  for (let iteration = 0; iteration < 18; iteration += 1) {
    let moved = false;
    for (let i = 0; i < entries.length; i += 1) {
      for (let j = i + 1; j < entries.length; j += 1) {
        const a = entries[i][1];
        const b = entries[j][1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distSq = dx * dx + dy * dy;
        if (distSq >= minDistanceSq) {
          continue;
        }

        const dist = Math.sqrt(Math.max(distSq, 0.0001));
        const push = (minDistance - dist) / 2;
        const ux = dx / dist;
        const uy = dy / dist;

        a.x -= ux * push;
        a.y -= uy * push;
        b.x += ux * push;
        b.y += uy * push;
        moved = true;
      }
    }
    if (!moved) {
      break;
    }
  }

  return new Map(entries);
}

function resolveRenderedNodeOverlaps(cy: Core, minGap: number, maxIterations: number): void {
  const nodes = cy.nodes();
  if (nodes.length <= 1) {
    return;
  }

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    let moved = false;

    cy.batch(() => {
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        if (!a) {
          continue;
        }
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          if (!b) {
            continue;
          }

          const bbA = a.boundingBox({ includeLabels: true, includeOverlays: false });
          const bbB = b.boundingBox({ includeLabels: true, includeOverlays: false });
          const dx = b.position("x") - a.position("x");
          const dy = b.position("y") - a.position("y");
          const allowedX = (bbA.w + bbB.w) / 2 + minGap;
          const allowedY = (bbA.h + bbB.h) / 2 + minGap;
          const overlapX = allowedX - Math.abs(dx);
          const overlapY = allowedY - Math.abs(dy);

          if (overlapX <= 0 || overlapY <= 0) {
            continue;
          }

          const axis = overlapX < overlapY ? "x" : "y";
          const direction =
            axis === "x"
              ? dx === 0
                ? (i + j) % 2 === 0
                  ? 1
                  : -1
                : Math.sign(dx)
              : dy === 0
                ? (i + j) % 2 === 0
                  ? 1
                  : -1
                : Math.sign(dy);
          const push = (axis === "x" ? overlapX : overlapY) / 2 + 1;

          if (axis === "x") {
            a.position("x", a.position("x") - direction * push);
            b.position("x", b.position("x") + direction * push);
          } else {
            a.position("y", a.position("y") - direction * push);
            b.position("y", b.position("y") + direction * push);
          }

          moved = true;
        }
      }
    });

    if (!moved) {
      break;
    }
  }
}

function runInitialNodePulse(cy: Core): () => void {
  const nodes = cy.nodes();
  if (nodes.length === 0) {
    return () => {};
  }
  const timerIds: number[] = [];

  nodes.forEach((node, index) => {
    const targetWidth = Number(node.data("width")) || 116;
    const targetHeight = Number(node.data("height")) || 48;
    const delay = Math.min(index * 18, 760);

    node.style({
      width: targetWidth * 0.62,
      height: targetHeight * 0.62,
      "border-width": 0.7,
    });

    const timerId = window.setTimeout(() => {
      try {
        const isDestroyed = (cy as unknown as { destroyed?: () => boolean }).destroyed?.() ?? false;
        const sameCy = node.cy() === cy;
        if (isDestroyed || !sameCy || node.removed()) {
          return;
        }
        node.animate(
          {
            style: {
              width: targetWidth,
              height: targetHeight,
              "border-width": 1.5,
            },
          },
          {
            duration: 360,
            easing: "ease-out-cubic",
            queue: false,
          },
        );
      } catch {
        // Ignore race conditions from destroyed/replaced Cytoscape instances.
      }
    }, delay);
    timerIds.push(timerId);
  });

  return () => {
    for (const timerId of timerIds) {
      window.clearTimeout(timerId);
    }
  };
}

/**
 * Cytoscape graph preview with optional explorer controls.
 */
export function GraphPreview({
  model,
  locale = "de",
  variant = "default",
  interactive = false,
  initialLayout = "hierarchy-vertical",
  highlightNodeIds = [],
}: GraphPreviewProps): React.JSX.Element {
  const copy =
    locale === "en"
      ? {
          title: "Graph view",
          fallback: "Learning view",
          current: "For the current question",
          legend: "Legend",
          passiveHint: "Drag to explore and scroll to zoom. Open Graph Explorer to change the layout.",
          activeHint: "Drag to explore, scroll to zoom, and switch layouts freely.",
        }
      : {
          title: "Graph-Ansicht",
          fallback: "Lernansicht",
          current: "Zur aktuellen Frage",
          legend: "Legende",
          passiveHint: "Drag zum Traversieren und Scroll zum Zoomen. Für Layoutwechsel den Graph Explorer öffnen.",
          activeHint: "Drag zum Traversieren, Scroll zum Zoomen, Layout frei wechselbar.",
        };
  const baseGraphHeightPx = GRAPH_HEIGHT_PX_BY_VARIANT[variant];
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [layoutMode, setLayoutMode] = useState<GraphLayoutMode>(initialLayout);
  const [presetMode, setPresetMode] = useState<GraphPresetMode>("all");
  const [enabledEdgeLabels, setEnabledEdgeLabels] = useState<Set<string>>(new Set());
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pinnedNodeId, setPinnedNodeId] = useState<string | null>(null);
  const [contextHopMode, setContextHopMode] = useState<ContextHopMode>("1");
  const [pathToAnswerMode, setPathToAnswerMode] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [miniMap, setMiniMap] = useState<MiniMapSnapshot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenHeightPx, setFullscreenHeightPx] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string; isNode?: boolean } | null>(null);
  const [didLoadSettings, setDidLoadSettings] = useState(false);
  const [isAdvancedControlsOpen, setIsAdvancedControlsOpen] = useState(false);
  const [edgeFilterQuery, setEdgeFilterQuery] = useState("");
  const edgeLabels = useMemo(
    () => [...new Set(model.edges.map((edge) => edge.label))].sort((a, b) => a.localeCompare(b)),
    [model.edges],
  );
  const filteredEdgeLabels = useMemo(() => {
    const needle = edgeFilterQuery.trim().toLowerCase();
    if (!needle) {
      return edgeLabels;
    }
    return edgeLabels.filter((label) => label.toLowerCase().includes(needle));
  }, [edgeFilterQuery, edgeLabels]);
  const presetModel = useMemo(() => applyGraphPreset(model, presetMode), [model, presetMode]);
  const filteredByEdgeModel = useMemo(() => {
    const filteredEdges = presetModel.edges.filter((edge) => enabledEdgeLabels.has(edge.label));
    const allowedNodeIds = new Set<string>();
    for (const edge of filteredEdges) {
      allowedNodeIds.add(edge.source);
      allowedNodeIds.add(edge.target);
    }
    const filteredNodes = presetModel.nodes.filter(
      (node) => allowedNodeIds.has(node.id) || node.kind === "query",
    );
    return {
      ...presetModel,
      nodes: filteredNodes.length > 0 ? filteredNodes : presetModel.nodes,
      edges: filteredEdges,
    };
  }, [presetModel, enabledEdgeLabels]);
  const supportsPathToAnswer = useMemo(
    () =>
      filteredByEdgeModel.nodes.some((node) => normalizeNodeType(node) === "query") &&
      filteredByEdgeModel.nodes.some((node) => normalizeNodeType(node) === "answer"),
    [filteredByEdgeModel.nodes],
  );
  const filteredModel = useMemo(() => {
    let nextModel = filteredByEdgeModel;
    if (pathToAnswerMode && supportsPathToAnswer) {
      nextModel = applyPathToAnswerFilter(nextModel);
    }
    if (pinnedNodeId) {
      nextModel = applyPinnedNodeContextFilter(nextModel, pinnedNodeId, Number(contextHopMode));
    }
    return nextModel;
  }, [contextHopMode, filteredByEdgeModel, pathToAnswerMode, pinnedNodeId, supportsPathToAnswer]);
  const nodeCount = filteredModel.nodes.length;
  const forceSeedPositions = useMemo(
    () => (layoutMode === "force" ? computeForceSeedPositions(filteredModel.nodes) : null),
    [layoutMode, filteredModel.nodes],
  );
  const elements = useMemo(() => {
    if (!forceSeedPositions) {
      return toElements(filteredModel);
    }

    const nodesWithSeed = filteredModel.nodes.map((node) => ({
      ...node,
      x: forceSeedPositions.get(node.id)?.x ?? node.x,
      y: forceSeedPositions.get(node.id)?.y ?? node.y,
    }));

    return toElements({ ...filteredModel, nodes: nodesWithSeed });
  }, [filteredModel, forceSeedPositions]);
  const visibleLegendItems = useMemo(() => {
    const presentTypes = new Set(filteredModel.nodes.map((node) => normalizeNodeType(node)));
    return getNodeTypeLegend(locale).filter((entry) => presentTypes.has(entry.key));
  }, [filteredModel.nodes, locale]);
  const selectedNodeDetails = useMemo(() => {
    if (!selectedNodeId) {
      return null;
    }
    const node = filteredModel.nodes.find((entry) => entry.id === selectedNodeId);
    if (!node) {
      return null;
    }

    const incoming = filteredModel.edges.filter((edge) => edge.target === selectedNodeId);
    const outgoing = filteredModel.edges.filter((edge) => edge.source === selectedNodeId);
    const neighborIds = new Set<string>();
    for (const edge of incoming) {
      neighborIds.add(edge.source);
    }
    for (const edge of outgoing) {
      neighborIds.add(edge.target);
    }
    const neighbors = filteredModel.nodes.filter((entry) => neighborIds.has(entry.id));

    return { node, incoming, outgoing, neighbors };
  }, [filteredModel.edges, filteredModel.nodes, selectedNodeId]);
  const selectedEdgeDetails = useMemo(() => {
    if (!selectedEdgeId) {
      return null;
    }
    const edge = filteredModel.edges.find((entry) => entry.id === selectedEdgeId);
    if (!edge) {
      return null;
    }
    const sourceNode = filteredModel.nodes.find((entry) => entry.id === edge.source);
    const targetNode = filteredModel.nodes.find((entry) => entry.id === edge.target);
    return { edge, sourceNode, targetNode };
  }, [filteredModel.edges, filteredModel.nodes, selectedEdgeId]);
  const graphHeightPx = isFullscreen
    ? Math.max(520, (fullscreenHeightPx ?? 900) - (interactive ? 190 : 140))
    : baseGraphHeightPx;

  useEffect(() => {
    setLayoutMode(initialLayout);
  }, [initialLayout]);

  useEffect(() => {
    if (!interactive || didLoadSettings) {
      return;
    }
    try {
      const raw = window.localStorage.getItem(EXPLORER_SETTINGS_STORAGE_KEY);
      if (!raw) {
        setDidLoadSettings(true);
        return;
      }
      const parsed = JSON.parse(raw) as PersistedExplorerSettings;
      if (parsed.layoutMode) {
        setLayoutMode(parsed.layoutMode);
      }
      if (parsed.presetMode) {
        setPresetMode(parsed.presetMode);
      }
      if (Array.isArray(parsed.enabledEdgeLabels)) {
        setEnabledEdgeLabels(new Set(parsed.enabledEdgeLabels));
      }
      setPathToAnswerMode(parsed.pathToAnswerMode === true);
      if (parsed.contextHopMode === "2") {
        setContextHopMode("2");
      }
    } catch {
      // Ignore malformed persisted settings.
    }
    setDidLoadSettings(true);
  }, [didLoadSettings, interactive]);

  useEffect(() => {
    setEnabledEdgeLabels(new Set(edgeLabels));
  }, [edgeLabels]);

  useEffect(() => {
    if (!interactive || !didLoadSettings) {
      return;
    }
    const payload: PersistedExplorerSettings = {
      layoutMode,
      presetMode,
      enabledEdgeLabels: [...enabledEdgeLabels],
      pathToAnswerMode,
      contextHopMode,
    };
    try {
      window.localStorage.setItem(EXPLORER_SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota/browser restrictions.
    }
  }, [contextHopMode, didLoadSettings, enabledEdgeLabels, interactive, layoutMode, pathToAnswerMode, presetMode]);

  useEffect(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setPinnedNodeId(null);
    setIsDescriptionExpanded(false);
  }, [model]);

  useEffect(() => {
    if (pinnedNodeId && !filteredByEdgeModel.nodes.some((node) => node.id === pinnedNodeId)) {
      setPinnedNodeId(null);
    }
  }, [filteredByEdgeModel.nodes, pinnedNodeId]);

  useEffect(() => {
    if (selectedNodeId && !filteredModel.nodes.some((node) => node.id === selectedNodeId)) {
      setSelectedNodeId(null);
    }
  }, [filteredModel.nodes, selectedNodeId]);

  useEffect(() => {
    if (selectedEdgeId && !filteredModel.edges.some((edge) => edge.id === selectedEdgeId)) {
      setSelectedEdgeId(null);
    }
  }, [filteredModel.edges, selectedEdgeId]);

  useEffect(() => {
    if (pathToAnswerMode && !supportsPathToAnswer) {
      setPathToAnswerMode(false);
    }
  }, [pathToAnswerMode, supportsPathToAnswer]);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setFullscreenHeightPx(window.innerHeight);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    setPortalContainer(wrapperRef.current);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (!isFullscreen) {
        return;
      }
      setFullscreenHeightPx(window.innerHeight);
      withCySafely(cyRef.current, (activeCy) => {
        activeCy.resize();
        activeCy.fit(undefined, 20);
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isFullscreen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    ensureDagreRegistered();
    const cy = cytoscape({
      container,
      elements,
      style: [
        {
          selector: "node",
          style: {
            shape: "roundrectangle",
            width: "data(width)",
            height: "data(height)",
            label: "data(label)",
            "text-wrap": "wrap",
            "text-max-width": "92px",
            "font-size": "11px",
            "font-weight": 600,
            "text-valign": "center",
            "text-halign": "center",
            color: "#1f2937",
            "background-color": "#ffffff",
            "border-width": 1.5,
            "border-color": "#225796",
          },
        },
        {
          selector: "node[kind = 'query']",
          style: {
            "background-color": "#dbeafe",
            "border-color": "#174379",
            color: "#102a43",
          },
        },
        {
          selector: "node[kind = 'evidence']",
          style: {
            "background-color": "#f1f5f9",
            "border-color": "#4d6589",
            color: "#334155",
          },
        },
        {
          selector: "node[nodeType = 'concept']",
          style: {
            "background-color": "#e7f0ff",
            "border-color": "#2d5f9b",
          },
        },
        {
          selector: "node[nodeType = 'tool']",
          style: {
            "background-color": "#e8f7ef",
            "border-color": "#2f855a",
          },
        },
        {
          selector: "node[nodeType = 'problem']",
          style: {
            "background-color": "#fff1eb",
            "border-color": "#c05621",
          },
        },
        {
          selector: "node[nodeType = 'book']",
          style: {
            "background-color": "#f3ecff",
            "border-color": "#6b46c1",
          },
        },
        {
          selector: "node[nodeType = 'author']",
          style: {
            "background-color": "#fff7df",
            "border-color": "#b7791f",
          },
        },
        {
          selector: ".muted",
          style: {
            opacity: 0.2,
          },
        },
        {
          selector: ".selection-muted",
          style: {
            opacity: 0.2,
          },
        },
        {
          selector: ".focus-node",
          style: {
            "border-width": 3,
            "border-color": "#0f4f94",
            opacity: 1,
          },
        },
        {
          selector: ".selection-focus-node",
          style: {
            "border-width": 3,
            "border-color": "#0f4f94",
            opacity: 1,
          },
        },
        {
          selector: ".focus-edge",
          style: {
            width: 3,
            "line-color": "#4f87c2",
            opacity: 1,
          },
        },
        {
          selector: ".selection-focus-edge",
          style: {
            width: 3,
            "line-color": "#4f87c2",
            opacity: 1,
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#b7c3d8",
            "line-style": "dashed",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "10px",
            color: "#475569",
            "text-rotation": "autorotate",
            "text-margin-y": -8,
            "text-background-color": "#f8fafc",
            "text-background-opacity": 0.95,
            "text-background-padding": "2px",
          },
        },
      ],
      layout: { name: "preset" },
      userPanningEnabled: true,
      userZoomingEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: false,
    });
    const activeLayout = cy.layout(buildLayout(layoutMode, nodeCount));

    const cancelPulse = runInitialNodePulse(cy);

    cy.on("mouseover", "node", (event) => {
      const position = event.renderedPosition ?? event.position;
      if (!position) {
        return;
      }
      const fullLabel = String(event.target.data("fullLabel") ?? "");
      const shortDescription = String(event.target.data("shortDescription") ?? "");
      const nodeType = String(event.target.data("nodeType") ?? event.target.data("kind") ?? "");
      setTooltip({
        x: position.x + 14,
        y: position.y - 12,
        text: getNodeTooltipText(nodeType, fullLabel, shortDescription),
        isNode: true,
      });
    });

    cy.on("mouseover", "edge", (event) => {
      const position = event.renderedPosition ?? event.position;
      if (!position) {
        return;
      }
      setTooltip({
        x: position.x + 14,
        y: position.y - 12,
        text: getEdgeTooltipText(String(event.target.data("label") ?? "")),
        isNode: false,
      });
    });

    cy.on("mousemove", "node,edge", (event) => {
      const position = event.renderedPosition ?? event.position;
      if (!position) {
        return;
      }
      setTooltip((current) => (current ? { ...current, x: position.x + 14, y: position.y - 12 } : null));
    });

    cy.on("mouseout", "node,edge", () => setTooltip(null));
    cy.on("pan zoom", () => setTooltip(null));

    const clearFocus = () => {
      withCySafely(cy, (activeCy) => {
        activeCy.elements().removeClass("muted");
        activeCy.elements().removeClass("focus-node");
        activeCy.elements().removeClass("focus-edge");
      });
    };

    const applyReferenceSelectionHighlight = () => {
      withCySafely(cy, (activeCy) => {
        activeCy.elements().removeClass("selection-muted");
        activeCy.elements().removeClass("selection-focus-node");
        activeCy.elements().removeClass("selection-focus-edge");
        if (highlightNodeIds.length === 0) {
          return;
        }
        const highlightedNodeSet = new Set(highlightNodeIds);
        const highlightedNodes = activeCy.nodes().filter((node) => highlightedNodeSet.has(String(node.id())));
        if (highlightedNodes.length === 0) {
          return;
        }
        const highlightedNeighborhood = highlightedNodes.closedNeighborhood();
        activeCy.elements().addClass("selection-muted");
        highlightedNeighborhood.removeClass("selection-muted");
        highlightedNodes.addClass("selection-focus-node");
        highlightedNodes.connectedEdges().addClass("selection-focus-edge");
      });
    };

    cy.on("tap", "node", (event) => {
      const node = event.target;
      clearFocus();

      withCySafely(cy, (activeCy) => {
        const focusElements = node.closedNeighborhood();
        activeCy.elements().addClass("muted");
        focusElements.removeClass("muted");
        node.addClass("focus-node");
        node.connectedEdges().addClass("focus-edge");
      });

      setSelectedNodeId(String(node.id()));
      setSelectedEdgeId(null);
      setIsDescriptionExpanded(false);
    });

    cy.on("tap", "edge", (event) => {
      const edge = event.target;
      clearFocus();
      withCySafely(cy, (activeCy) => {
        const edgeNeighborhood = edge.connectedNodes().union(edge);
        activeCy.elements().addClass("muted");
        edgeNeighborhood.removeClass("muted");
        edge.addClass("focus-edge");
        edge.connectedNodes().addClass("focus-node");
      });
      setSelectedEdgeId(String(edge.id()));
      setSelectedNodeId(null);
      setIsDescriptionExpanded(false);
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        clearFocus();
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setIsDescriptionExpanded(false);
      }
    });

    if (layoutMode === "force") {
      cy.one("layoutstop", () => {
        withCySafely(cy, (activeCy) => {
          resolveRenderedNodeOverlaps(activeCy, 44, 56);
          // Run a second pass after paint to account for final label bounds.
          window.setTimeout(() => {
            withCySafely(activeCy, (stableCy) => {
              resolveRenderedNodeOverlaps(stableCy, 44, 36);
              applyReferenceSelectionHighlight();
              stableCy.fit(undefined, 30);
              setMiniMap(buildMiniMapSnapshot(stableCy));
            });
          }, 40);
          // Third pass: catches delayed text metrics in some browsers.
          window.setTimeout(() => {
            withCySafely(activeCy, (stableCy) => {
              resolveRenderedNodeOverlaps(stableCy, 44, 18);
              applyReferenceSelectionHighlight();
              stableCy.fit(undefined, 30);
              setMiniMap(buildMiniMapSnapshot(stableCy));
            });
          }, 150);
          applyReferenceSelectionHighlight();
          activeCy.fit(undefined, 30);
          setMiniMap(buildMiniMapSnapshot(activeCy));
        });
      });
    }

    activeLayout.run();
    applyReferenceSelectionHighlight();
    withCySafely(cy, (activeCy) => {
      setMiniMap(buildMiniMapSnapshot(activeCy));
    });

    const resizeObserver = new ResizeObserver(() => {
      withCySafely(cy, (activeCy) => {
        activeCy.resize();
        applyReferenceSelectionHighlight();
        activeCy.fit(undefined, 20);
        setMiniMap(buildMiniMapSnapshot(activeCy));
      });
    });
    resizeObserver.observe(container);
    cy.on("dragfree", "node", () => {
      withCySafely(cy, (activeCy) => setMiniMap(buildMiniMapSnapshot(activeCy)));
    });
    cy.on("pan zoom", () => {
      withCySafely(cy, (activeCy) => setMiniMap(buildMiniMapSnapshot(activeCy)));
    });

    cyRef.current = cy;
    return () => {
      cancelPulse();
      resizeObserver.disconnect();
      cyRef.current = null;
      try {
        activeLayout.stop();
      } catch {
        // Ignore layout-stop races during teardown.
      }
      withCySafely(cy, (activeCy) => {
        activeCy.stop();
        activeCy.elements().stop();
        activeCy.removeAllListeners();
        activeCy.destroy();
      });
      setTooltip(null);
    };
  }, [elements, layoutMode, nodeCount, highlightNodeIds]);

  const handleFit = () => {
    withCySafely(cyRef.current, (activeCy) => {
      activeCy.fit(undefined, 20);
    });
  };

  const handleToggleFullscreen = async () => {
    const element = wrapperRef.current;
    if (!element) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await element.requestFullscreen();
  };

  const handleMiniMapJump = (x: number, y: number) => {
    withCySafely(cyRef.current, (activeCy) => {
      const zoom = activeCy.zoom();
      const width = containerRef.current?.clientWidth ?? 0;
      const height = containerRef.current?.clientHeight ?? 0;
      activeCy.pan({
        x: width / 2 - x * zoom,
        y: height / 2 - y * zoom,
      });
      setMiniMap(buildMiniMapSnapshot(activeCy));
    });
  };

  return (
    <section
      ref={wrapperRef}
      className={`space-y-4 rounded-2xl border border-slate-200/60 bg-white/70 p-5 sm:p-6 shadow-sm ${
        isFullscreen ? "h-[100dvh] w-screen overflow-auto rounded-none border-0 bg-white p-4 sm:p-6" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{copy.title}</h3>
        <span className="text-xs font-semibold text-slate-500">
          {model.isFallback ? copy.fallback : copy.current}
        </span>
      </div>

      <p className="text-sm text-slate-600">{model.caption}</p>

      {interactive ? (
        <div className="sticky top-2 z-10 space-y-3 rounded-xl border border-slate-200/60 bg-white/80 p-3 shadow-md backdrop-blur-md">
          <div className="grid gap-2 md:grid-cols-[minmax(160px,220px)_minmax(170px,240px)_auto_auto] md:items-center">
            <div className="space-y-1">
              <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Layout
              </span>
              <Select value={layoutMode} onValueChange={(value) => setLayoutMode(value as GraphLayoutMode)}>
                <SelectTrigger className="h-9 w-full bg-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent portalContainer={portalContainer}>
                  <SelectItem value="force">Force</SelectItem>
                  <SelectItem value="hierarchy-vertical">Hierarchy Vertical</SelectItem>
                  <SelectItem value="hierarchy-horizontal">Hierarchy Horizontal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Preset View
              </span>
              <Select value={presetMode} onValueChange={(value) => setPresetMode(value as GraphPresetMode)}>
                <SelectTrigger className="h-9 w-full bg-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent portalContainer={portalContainer}>
                  <SelectItem value="all">Alle Knoten</SelectItem>
                  <SelectItem value="concepts-tools">Konzepte + Tools</SelectItem>
                  <SelectItem value="archetypes">Archetypen & Traps</SelectItem>
                  <SelectItem value="problems-interventions">Probleme & Interventionen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" variant="secondary" size="default" className="h-9 px-3" onClick={handleFit}>
              Fit to Screen
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="default"
              className="h-9 px-3"
              onClick={handleToggleFullscreen}
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Erweiterte Filter
            </span>
            <button
              type="button"
              onClick={() => setIsAdvancedControlsOpen((current) => !current)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {isAdvancedControlsOpen ? "Weniger" : "Mehr"}
            </button>
          </div>
          {isAdvancedControlsOpen ? (
            <div className="space-y-2 rounded-md border border-slate-200 bg-white p-2">
              <div className="grid gap-2 md:grid-cols-[auto_auto_auto] md:items-center">
                <button
                  type="button"
                  disabled={!supportsPathToAnswer}
                  onClick={() => setPathToAnswerMode((current) => !current)}
                  className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                    pathToAnswerMode
                      ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Pfad zur Antwort {pathToAnswerMode ? "an" : "aus"}
                </button>
                <button
                  type="button"
                  disabled={!selectedNodeDetails}
                  onClick={() =>
                    setPinnedNodeId((current) =>
                      current === (selectedNodeDetails?.node.id ?? null)
                        ? null
                        : (selectedNodeDetails?.node.id ?? null),
                    )
                  }
                  className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                    pinnedNodeId
                      ? "border-amber-300 bg-amber-50 text-amber-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {pinnedNodeId ? "Pin lösen" : "Node pinnen"}
                </button>
                <div className="flex items-center gap-1 rounded-md border border-slate-300 bg-white p-1">
                  <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Kontext
                  </span>
                  <button
                    type="button"
                    onClick={() => setContextHopMode("1")}
                    className={`rounded px-2 py-1 text-xs font-semibold ${contextHopMode === "1" ? "bg-sky-100 text-sky-800" : "text-slate-600"}`}
                  >
                    1-Hop
                  </button>
                  <button
                    type="button"
                    onClick={() => setContextHopMode("2")}
                    className={`rounded px-2 py-1 text-xs font-semibold ${contextHopMode === "2" ? "bg-sky-100 text-sky-800" : "text-slate-600"}`}
                  >
                    2-Hop
                  </button>
                </div>
              </div>
              {edgeLabels.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Kantenfilter
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEnabledEdgeLabels(new Set(edgeLabels))}
                        className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Alle
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnabledEdgeLabels(new Set())}
                        className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Keine
                      </button>
                    </div>
                  </div>
                  <input
                    value={edgeFilterQuery}
                    onChange={(event) => setEdgeFilterQuery(event.target.value)}
                    placeholder="Kante suchen..."
                    className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700"
                  />
                  <div className="flex max-h-[112px] flex-wrap gap-1.5 overflow-auto pr-1">
                    {filteredEdgeLabels.map((label) => {
                      const enabled = enabledEdgeLabels.has(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() =>
                            setEnabledEdgeLabels((current) => {
                              const next = new Set(current);
                              if (next.has(label)) {
                                next.delete(label);
                              } else {
                                next.add(label);
                              }
                              return next;
                            })
                          }
                          className={`rounded-full border px-2 py-1 text-[11px] font-semibold transition ${
                            enabled
                              ? "border-sky-300 bg-sky-50 text-sky-800"
                              : "border-slate-300 bg-white text-slate-500"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {visibleLegendItems.length > 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
          <span className="block px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{copy.legend}</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {visibleLegendItems.map((item) => (
              <span
                key={item.key}
                className="inline-flex max-w-full items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] leading-none text-slate-700"
              >
                <span className={`h-2 w-2 shrink-0 rounded-full border ${item.bgClass} ${item.borderClass}`} />
                <span className="break-words">{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-sky-50/40 to-indigo-50/40"
        style={{ minHeight: `${graphHeightPx}px` }}
      >
        <div ref={containerRef} className="w-full" style={{ height: `${graphHeightPx}px` }} />
        {tooltip ? (
          <div
            className="pointer-events-none absolute z-20 max-w-[220px] rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs leading-relaxed text-slate-700 shadow-md"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            {(() => {
              const lines = tooltip.text.split("\n").filter((line) => line.trim().length > 0);
              if (lines.length === 0) {
                return null;
              }
              if (tooltip.isNode) {
                return (
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{lines[0]}</p>
                    {lines.slice(1).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                );
              }
              return <p>{tooltip.text}</p>;
            })()}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-slate-500">
        {interactive ? copy.activeHint : copy.passiveHint}
      </p>

      {interactive ? (
        <div className="mt-4 grid items-start gap-4 lg:grid-cols-[200px_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-xl border border-slate-200/60 bg-slate-50/80 p-3 shadow-sm">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Mini-Map</p>
            {miniMap && miniMap.nodes.length > 0 ? (
              <div className="h-[128px] w-full md:h-[140px]">
                <MiniMapView snapshot={miniMap} onJump={handleMiniMapJump} />
              </div>
            ) : (
              <p className="text-xs text-slate-500">Lade Übersicht…</p>
            )}
          </section>
          <section className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Node-Details
            </p>
            {selectedNodeDetails || selectedEdgeDetails ? (
              <div className="space-y-2">
                {selectedNodeDetails ? (
                  <p className="text-sm font-semibold text-slate-900">
                    {stripNodeTypePrefix(
                      selectedNodeDetails.node.label,
                      (selectedNodeDetails.node.nodeType ?? "").toLowerCase(),
                    )}
                  </p>
                ) : null}
                {selectedEdgeDetails ? (
                  <p className="text-sm font-semibold text-slate-900">
                    Kante: {selectedEdgeDetails.edge.label} (
                    {stripNodeTypePrefix(selectedEdgeDetails.sourceNode?.compactLabel ?? selectedEdgeDetails.edge.source, (selectedEdgeDetails.sourceNode?.nodeType ?? "").toLowerCase())}
                    {" -> "}
                    {stripNodeTypePrefix(selectedEdgeDetails.targetNode?.compactLabel ?? selectedEdgeDetails.edge.target, (selectedEdgeDetails.targetNode?.nodeType ?? "").toLowerCase())})
                  </p>
                ) : null}
                <Accordion type="multiple" defaultValue={["description", "neighbors"]} className="space-y-2">
                  {selectedNodeDetails ? (
                    <AccordionItem value="description">
                      <AccordionTrigger>Beschreibung</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm leading-6">
                          {getCollapsibleDescriptionText(
                            selectedNodeDetails.node.longDescription?.trim() ||
                              selectedNodeDetails.node.shortDescription?.trim(),
                            isDescriptionExpanded,
                          ) || "Keine Beschreibung verfügbar."}
                        </p>
                        {shouldShowDescriptionToggle(
                          selectedNodeDetails.node.longDescription?.trim() ||
                            selectedNodeDetails.node.shortDescription?.trim() ||
                            "",
                        ) ? (
                          <button
                            type="button"
                            onClick={() => setIsDescriptionExpanded((current) => !current)}
                            className="mt-1 text-xs font-semibold text-sky-700 underline decoration-sky-300 underline-offset-2"
                          >
                            {isDescriptionExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
                          </button>
                        ) : null}
                      </AccordionContent>
                    </AccordionItem>
                  ) : null}
                  {selectedNodeDetails ? (
                    <AccordionItem value="source">
                      <AccordionTrigger>Quelle / Link</AccordionTrigger>
                      <AccordionContent>
                        {selectedNodeDetails.node.url ? (
                          <a
                            className="inline-block text-xs font-semibold text-sky-700 underline decoration-sky-300 underline-offset-2"
                            href={selectedNodeDetails.node.url}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Link öffnen
                          </a>
                        ) : (
                          <p className="text-xs text-slate-500">Kein Link hinterlegt.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ) : null}
                  {selectedNodeDetails ? (
                    <AccordionItem value="neighbors">
                      <AccordionTrigger>Nachbarn</AccordionTrigger>
                      <AccordionContent>
                        {selectedNodeDetails.neighbors.length > 0 ? (
                          <ul className="space-y-1 text-xs text-slate-700">
                            {selectedNodeDetails.neighbors.slice(0, 8).map((neighbor) => (
                              <li key={neighbor.id}>
                                {truncateText(
                                  stripNodeTypePrefix(
                                    neighbor.compactLabel ?? neighbor.label,
                                    (neighbor.nodeType ?? "").toLowerCase(),
                                  ),
                                  54,
                                )}
                              </li>
                            ))}
                            {selectedNodeDetails.neighbors.length > 8 ? <li>...</li> : null}
                          </ul>
                        ) : (
                          <p className="text-xs text-slate-500">Keine Nachbarn sichtbar.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ) : null}
                  {selectedNodeDetails ? (
                    <AccordionItem value="edges-node">
                      <AccordionTrigger>Eingehende / Ausgehende Kanten</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Eingehend</p>
                            <p className="mt-1 text-xs text-slate-700">
                              {selectedNodeDetails.incoming.length > 0
                                ? selectedNodeDetails.incoming.slice(0, 6).map((edge) => edge.label).join(", ")
                                : "Keine"}
                              {selectedNodeDetails.incoming.length > 6 ? ", ..." : ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Ausgehend</p>
                            <p className="mt-1 text-xs text-slate-700">
                              {selectedNodeDetails.outgoing.length > 0
                                ? selectedNodeDetails.outgoing.slice(0, 6).map((edge) => edge.label).join(", ")
                                : "Keine"}
                              {selectedNodeDetails.outgoing.length > 6 ? ", ..." : ""}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : null}
                  {selectedEdgeDetails ? (
                    <AccordionItem value="edge-details">
                      <AccordionTrigger>Edge-Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 text-xs text-slate-700">
                          <p>Typ: {selectedEdgeDetails.edge.label}</p>
                          <p>
                            Von:{" "}
                            {stripNodeTypePrefix(
                              selectedEdgeDetails.sourceNode?.label ?? selectedEdgeDetails.edge.source,
                              (selectedEdgeDetails.sourceNode?.nodeType ?? "").toLowerCase(),
                            )}
                          </p>
                          <p>
                            Nach:{" "}
                            {stripNodeTypePrefix(
                              selectedEdgeDetails.targetNode?.label ?? selectedEdgeDetails.edge.target,
                              (selectedEdgeDetails.targetNode?.nodeType ?? "").toLowerCase(),
                            )}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : null}
                </Accordion>
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                Klicke einen Knoten oder eine Kante an, um Details zu sehen.
              </p>
            )}
          </section>
        </div>
      ) : null}
    </section>
  );
}

function fitNodeLabel(label: string): string {
  const compact = label.replace(/\s+/g, " ").trim();
  if (compact.length <= 20) {
    return compact;
  }

  return `${compact.slice(0, 17)}...`;
}

function truncateText(text: string, maxLength: number): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function shouldShowDescriptionToggle(text: string): boolean {
  return text.replace(/\s+/g, " ").trim().length > 180;
}

function getCollapsibleDescriptionText(text: string | undefined, expanded: boolean): string {
  const compact = (text ?? "").replace(/\s+/g, " ").trim();
  if (!compact) {
    return "";
  }
  if (expanded || compact.length <= 180) {
    return compact;
  }
  return truncateText(compact, 180);
}

function MiniMapView({
  snapshot,
  onJump,
}: {
  snapshot: MiniMapSnapshot;
  onJump: (x: number, y: number) => void;
}): React.JSX.Element {
  const width = 200;
  const height = 150;
  const xs = snapshot.nodes.map((node) => node.x);
  const ys = snapshot.nodes.map((node) => node.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const pad = 10;
  const toX = (x: number) => pad + ((x - minX) / spanX) * (width - pad * 2);
  const toY = (y: number) => pad + ((y - minY) / spanY) * (height - pad * 2);
  const fromX = (x: number) => minX + ((x - pad) / (width - pad * 2)) * spanX;
  const fromY = (y: number) => minY + ((y - pad) / (height - pad * 2)) * spanY;
  const nodeById = new Map(snapshot.nodes.map((node) => [node.id, node]));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block h-full w-full cursor-crosshair rounded-md border border-slate-200 bg-white"
      onClick={(event) => {
        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();
        const relativeX = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * width;
        const relativeY = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * height;
        const mappedX = fromX(Math.max(pad, Math.min(width - pad, relativeX)));
        const mappedY = fromY(Math.max(pad, Math.min(height - pad, relativeY)));
        onJump(mappedX, mappedY);
      }}
    >
      {snapshot.edges.map((edge, index) => {
        const source = nodeById.get(edge.source);
        const target = nodeById.get(edge.target);
        if (!source || !target) {
          return null;
        }
        return (
          <line
            key={`${edge.source}-${edge.target}-${index}`}
            x1={toX(source.x)}
            y1={toY(source.y)}
            x2={toX(target.x)}
            y2={toY(target.y)}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
        );
      })}
      {snapshot.nodes.map((node) => (
        <circle
          key={node.id}
          cx={toX(node.x)}
          cy={toY(node.y)}
          r="3"
          fill={miniMapNodeColor(node.nodeType)}
          stroke="#334155"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}

function miniMapNodeColor(nodeType: string): string {
  switch (nodeType.toLowerCase()) {
    case "tool":
      return "#bbf7d0";
    case "problem":
      return "#fed7aa";
    case "book":
      return "#e9d5ff";
    case "author":
      return "#fde68a";
    case "query":
      return "#bfdbfe";
    case "evidence":
      return "#e2e8f0";
    default:
      return "#dbeafe";
  }
}

function getNodeTooltipText(nodeTypeRaw: string, fullLabel: string, descriptionRaw?: string): string {
  const nodeType = nodeTypeRaw.toLowerCase();
  const cleanLabel = stripNodeTypePrefix(fullLabel, nodeType);
  const description = descriptionRaw?.trim();

  if (description && description.length > 0) {
    return `${cleanLabel}\n${description}`;
  }

  if (nodeType === "query") {
    return `${cleanLabel}\nFrage: Das ist dein Ausgangspunkt.`;
  }
  if (nodeType === "evidence") {
    return `${cleanLabel}\nBeleg: Konkrete Quelle oder Fakt, der ein Konzept stützt.`;
  }
  return cleanLabel;
}

function stripNodeTypePrefix(label: string, nodeType: string): string {
  const trimmed = label.trim();
  if (!trimmed) {
    return trimmed;
  }

  const prefixes = [
    nodeType,
    capitalize(nodeType),
    "concept",
    "tool",
    "author",
    "book",
    "problem",
    "evidence",
    "query",
    "answer",
    "reference",
    "konzept",
    "beleg",
    "frage",
    "antwort",
  ];
  for (const prefix of prefixes) {
    const fullPrefix = `${prefix}:`;
    if (trimmed.toLowerCase().startsWith(fullPrefix.toLowerCase())) {
      return trimmed.slice(fullPrefix.length).trim();
    }
  }
  return trimmed;
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function getEdgeTooltipText(label: string): string {
  if (label.startsWith("1")) {
    return "Relevanz: Dieses Konzept passt inhaltlich zur Frage.";
  }
  if (label.startsWith("2 Beleg")) {
    return "Beleg-Link: Dieses Konzept wird mit einer Quelle/Faktenbasis begründet.";
  }
  if (label.startsWith("2")) {
    return "Begründungs-Schritt zwischen zwei Elementen.";
  }
  return "Verbindung zwischen zwei Knoten im Herleitungsgraphen.";
}

function normalizeNodeType(node: HomeGraphNode): string {
  const source = (node.nodeType ?? node.kind).toLowerCase();
  if (source.includes("tool")) {
    return "tool";
  }
  if (source.includes("problem")) {
    return "problem";
  }
  if (source.includes("book")) {
    return "book";
  }
  if (source.includes("author")) {
    return "author";
  }
  if (source.includes("concept")) {
    return "concept";
  }
  return source;
}
