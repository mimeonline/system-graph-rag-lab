import { useEffect, useMemo, useRef, useState } from "react";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
// @ts-expect-error cytoscape-dagre ships no types
import dagre from "cytoscape-dagre";
import type { HomeGraphModel, HomeGraphNode } from "@/features/home/graph-view-model";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type GraphLayoutMode = "force" | "hierarchy-vertical" | "hierarchy-horizontal";

type GraphPreviewProps = {
  model: HomeGraphModel;
  variant?: "default" | "expanded";
  interactive?: boolean;
  initialLayout?: GraphLayoutMode;
};

const GRAPH_HEIGHT_PX_BY_VARIANT: Record<NonNullable<GraphPreviewProps["variant"]>, number> = {
  default: 400,
  expanded: 640,
};

const NODE_SIZE_BY_KIND: Record<HomeGraphNode["kind"], { width: number; height: number }> = {
  query: { width: 120, height: 42 },
  reference: { width: 116, height: 48 },
  evidence: { width: 120, height: 52 },
};

let dagreRegistered = false;

const NODE_TYPE_LEGEND: Array<{
  key: string;
  label: string;
  bgClass: string;
  borderClass: string;
}> = [
  { key: "query", label: "Frage", bgClass: "bg-blue-100", borderClass: "border-blue-800" },
  { key: "concept", label: "Concept", bgClass: "bg-blue-100", borderClass: "border-blue-700" },
  { key: "tool", label: "Tool", bgClass: "bg-emerald-100", borderClass: "border-emerald-700" },
  { key: "problem", label: "Problem", bgClass: "bg-orange-100", borderClass: "border-orange-700" },
  { key: "book", label: "Book", bgClass: "bg-violet-100", borderClass: "border-violet-700" },
  { key: "author", label: "Author", bgClass: "bg-amber-100", borderClass: "border-amber-700" },
  { key: "evidence", label: "Beleg", bgClass: "bg-slate-100", borderClass: "border-slate-500" },
  { key: "answer", label: "Antwort", bgClass: "bg-indigo-100", borderClass: "border-indigo-700" },
];

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

function buildLayout(mode: GraphLayoutMode, nodeCount: number): cytoscape.LayoutOptions {
  if (mode === "force") {
    const denseGraph = nodeCount >= 40;
    return {
      name: "cose",
      animate: true,
      animationDuration: denseGraph ? 1100 : 850,
      animationEasing: "ease-out-cubic",
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
    animate: true,
    animationDuration: 260,
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
      const isDestroyed = (cy as unknown as { destroyed?: () => boolean }).destroyed?.() ?? false;
      if (isDestroyed || node.removed()) {
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
  variant = "default",
  interactive = false,
  initialLayout = "hierarchy-vertical",
}: GraphPreviewProps): React.JSX.Element {
  const baseGraphHeightPx = GRAPH_HEIGHT_PX_BY_VARIANT[variant];
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);
  const [layoutMode, setLayoutMode] = useState<GraphLayoutMode>(initialLayout);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenHeightPx, setFullscreenHeightPx] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string; isNode?: boolean } | null>(null);
  const nodeCount = model.nodes.length;
  const forceSeedPositions = useMemo(
    () => (layoutMode === "force" ? computeForceSeedPositions(model.nodes) : null),
    [layoutMode, model.nodes],
  );
  const elements = useMemo(() => {
    if (!forceSeedPositions) {
      return toElements(model);
    }

    const nodesWithSeed = model.nodes.map((node) => ({
      ...node,
      x: forceSeedPositions.get(node.id)?.x ?? node.x,
      y: forceSeedPositions.get(node.id)?.y ?? node.y,
    }));

    return toElements({ ...model, nodes: nodesWithSeed });
  }, [model, forceSeedPositions]);
  const visibleLegendItems = useMemo(() => {
    const presentTypes = new Set(model.nodes.map((node) => normalizeNodeType(node)));
    return NODE_TYPE_LEGEND.filter((entry) => presentTypes.has(entry.key));
  }, [model.nodes]);
  const graphHeightPx = isFullscreen
    ? Math.max(520, (fullscreenHeightPx ?? 900) - (interactive ? 190 : 140))
    : baseGraphHeightPx;

  useEffect(() => {
    setLayoutMode(initialLayout);
  }, [initialLayout]);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setFullscreenHeightPx(window.innerHeight);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (!isFullscreen) {
        return;
      }
      setFullscreenHeightPx(window.innerHeight);
      const cy = cyRef.current;
      if (cy) {
        cy.resize();
        cy.fit(undefined, 20);
      }
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
          selector: ".focus-node",
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
      layout: buildLayout(layoutMode, nodeCount),
      userPanningEnabled: true,
      userZoomingEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: false,
      wheelSensitivity: 0.18,
    });

    const cancelPulse = runInitialNodePulse(cy);

    cy.on("mouseover", "node", (event) => {
      const position = event.renderedPosition ?? event.position;
      if (!position) {
        return;
      }
      const fullLabel = String(event.target.data("fullLabel") ?? "");
      const nodeType = String(event.target.data("nodeType") ?? event.target.data("kind") ?? "");
      setTooltip({
        x: position.x + 14,
        y: position.y - 12,
        text: getNodeTooltipText(nodeType, fullLabel),
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
      cy.elements().removeClass("muted");
      cy.elements().removeClass("focus-node");
      cy.elements().removeClass("focus-edge");
    };

    cy.on("tap", "node", (event) => {
      const node = event.target;
      clearFocus();

      const focusElements = node.closedNeighborhood();
      cy.elements().addClass("muted");
      focusElements.removeClass("muted");
      node.addClass("focus-node");
      node.connectedEdges().addClass("focus-edge");
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        clearFocus();
      }
    });

    if (layoutMode === "force") {
      cy.one("layoutstop", () => {
        resolveRenderedNodeOverlaps(cy, 26, 30);
        cy.fit(undefined, 30);
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      cy.resize();
      cy.fit(undefined, 20);
    });
    resizeObserver.observe(container);

    cyRef.current = cy;
    return () => {
      cancelPulse();
      resizeObserver.disconnect();
      cy.removeAllListeners();
      cy.destroy();
      cyRef.current = null;
      setTooltip(null);
    };
  }, [elements, layoutMode, nodeCount]);

  const handleFit = () => {
    cyRef.current?.fit(undefined, 20);
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

  return (
    <section
      ref={wrapperRef}
      className={`space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${
        isFullscreen ? "h-screen w-screen overflow-auto rounded-none border-0 p-4 sm:p-6" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Graph-Ansicht</h3>
        <span className="text-xs font-semibold text-slate-500">
          {model.isFallback ? "Lernansicht" : "query-basiert"}
        </span>
      </div>

      <p className="text-sm text-slate-600">{model.caption}</p>

      {interactive ? (
        <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 md:grid-cols-[minmax(190px,260px)_auto_auto] md:items-center">
          <div className="space-y-1">
            <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Layout
            </span>
            <Select value={layoutMode} onValueChange={(value) => setLayoutMode(value as GraphLayoutMode)}>
              <SelectTrigger className="h-9 w-full bg-white text-sm md:w-[240px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="force">Force</SelectItem>
                <SelectItem value="hierarchy-vertical">Hierarchy Vertical</SelectItem>
                <SelectItem value="hierarchy-horizontal">Hierarchy Horizontal</SelectItem>
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
      ) : null}

      {visibleLegendItems.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
          <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Legende</span>
          {visibleLegendItems.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
            >
              <span className={`h-2.5 w-2.5 rounded-full border ${item.bgClass} ${item.borderClass}`} />
              {item.label}
            </span>
          ))}
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
        {interactive
          ? "Drag zum Traversieren, Scroll zum Zoomen, Layout frei wechselbar."
          : "Drag zum Traversieren und Scroll zum Zoomen. Für Layoutwechsel den Graph Explorer öffnen."}
      </p>
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

function getNodeTooltipText(nodeTypeRaw: string, fullLabel: string): string {
  const nodeType = nodeTypeRaw.toLowerCase();
  const cleanLabel = stripNodeTypePrefix(fullLabel, nodeType);

  if (nodeType === "query") {
    return `${cleanLabel}\nFrage: Das ist dein Ausgangspunkt.`;
  }
  if (nodeType === "evidence") {
    return `${cleanLabel}\nBeleg: Konkrete Quelle oder Fakt, der ein Konzept stützt.`;
  }
  if (nodeType === "author") {
    return `${cleanLabel}\nAuthor: Person hinter einem Werk oder Ansatz.`;
  }
  if (nodeType === "book") {
    return `${cleanLabel}\nBook: Literaturquelle mit konzeptueller Einordnung.`;
  }
  if (nodeType === "tool") {
    return `${cleanLabel}\nTool: Methode oder Werkzeug zur Anwendung im Systemdenken.`;
  }
  if (nodeType === "problem") {
    return `${cleanLabel}\nProblem: Typisches Muster oder Herausforderung im System.`;
  }
  return `${cleanLabel}\nConcept: Relevanter Gedanke aus dem Graphen zur aktuellen Frage.`;
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
