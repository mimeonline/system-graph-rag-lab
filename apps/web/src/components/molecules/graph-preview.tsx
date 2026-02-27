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

function buildLayout(mode: GraphLayoutMode): cytoscape.LayoutOptions {
  if (mode === "force") {
    return {
      name: "cose",
      animate: true,
      animationDuration: 260,
      fit: true,
      padding: 20,
      nodeRepulsion: 14000,
      nodeOverlap: 20,
      idealEdgeLength: 100,
      edgeElasticity: 120,
      gravity: 0.35,
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

/**
 * Cytoscape graph preview with optional explorer controls.
 */
export function GraphPreview({
  model,
  variant = "default",
  interactive = false,
}: GraphPreviewProps): React.JSX.Element {
  const baseGraphHeightPx = GRAPH_HEIGHT_PX_BY_VARIANT[variant];
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);
  const [layoutMode, setLayoutMode] = useState<GraphLayoutMode>("hierarchy-vertical");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenHeightPx, setFullscreenHeightPx] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const elements = useMemo(() => toElements(model), [model]);
  const graphHeightPx = isFullscreen
    ? Math.max(520, (fullscreenHeightPx ?? 900) - (interactive ? 190 : 140))
    : baseGraphHeightPx;

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
      layout: buildLayout(layoutMode),
      userPanningEnabled: true,
      userZoomingEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: false,
      wheelSensitivity: 0.18,
    });

    cy.on("mouseover", "node", (event) => {
      const position = event.renderedPosition ?? event.position;
      if (!position) {
        return;
      }
      setTooltip({
        x: position.x + 14,
        y: position.y - 12,
        text: getNodeTooltipText(String(event.target.data("kind") ?? "")),
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

    const resizeObserver = new ResizeObserver(() => {
      cy.resize();
      cy.fit(undefined, 20);
    });
    resizeObserver.observe(container);

    cyRef.current = cy;
    return () => {
      resizeObserver.disconnect();
      cy.removeAllListeners();
      cy.destroy();
      cyRef.current = null;
      setTooltip(null);
    };
  }, [elements, layoutMode]);

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
            {tooltip.text}
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

function getNodeTooltipText(kind: string): string {
  if (kind === "query") {
    return "Frage: Das ist dein Ausgangspunkt.";
  }
  if (kind === "evidence") {
    return "Beleg: Konkrete Quelle oder Fakt, der ein Konzept stützt.";
  }
  return "Konzept: Relevanter Gedanke aus dem Graphen zur aktuellen Frage.";
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
