import { useEffect, useMemo, useRef, useState } from "react";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
// @ts-expect-error cytoscape-dagre ships no types
import dagre from "cytoscape-dagre";
import type { HomeGraphModel, HomeGraphNode } from "@/features/home/graph-view-model";

type GraphPreviewProps = {
  model: HomeGraphModel;
  variant?: "default" | "expanded";
};

const GRAPH_HEIGHT_PX_BY_VARIANT: Record<NonNullable<GraphPreviewProps["variant"]>, number> = {
  default: 400,
  expanded: 560,
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

function buildLayout(variant: NonNullable<GraphPreviewProps["variant"]>): cytoscape.LayoutOptions {
  return {
    name: "dagre",
    rankDir: "TB",
    fit: true,
    animate: true,
    animationDuration: 280,
    nodeSep: variant === "expanded" ? 62 : 46,
    rankSep: variant === "expanded" ? 104 : 82,
    edgeSep: 24,
    padding: 20,
  } as unknown as cytoscape.LayoutOptions;
}

/**
 * Renders the query graph via Cytoscape + Dagre for robust auto-layout on all widths.
 */
export function GraphPreview({ model, variant = "default" }: GraphPreviewProps): React.JSX.Element {
  const graphHeightPx = GRAPH_HEIGHT_PX_BY_VARIANT[variant];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const elements = useMemo(() => toElements(model), [model]);

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
      layout: buildLayout(variant),
      userPanningEnabled: true,
      userZoomingEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: true,
      wheelSensitivity: 0.18,
    });

    const updateTooltip = (event: cytoscape.EventObject, text: string): void => {
      const position = event.renderedPosition ?? event.position;
      if (!position) {
        return;
      }
      setTooltip({
        x: position.x + 14,
        y: position.y - 12,
        text,
      });
    };

    cy.on("mouseover", "node", (event) => {
      const kind = String(event.target.data("kind") ?? "");
      updateTooltip(event, getNodeTooltipText(kind));
    });

    cy.on("mouseover", "edge", (event) => {
      const label = String(event.target.data("label") ?? "");
      updateTooltip(event, getEdgeTooltipText(label));
    });

    cy.on("mousemove", "node,edge", (event) => {
      const position = event.renderedPosition ?? event.position;
      if (!position) {
        return;
      }
      setTooltip((current) =>
        current
          ? {
              ...current,
              x: position.x + 14,
              y: position.y - 12,
            }
          : current,
      );
    });

    cy.on("mouseout", "node,edge", () => {
      setTooltip(null);
    });

    cy.on("pan zoom", () => {
      setTooltip(null);
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
  }, [elements, variant]);

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Graph-Ansicht</h3>
        <span className="text-xs font-semibold text-slate-500">
          {model.isFallback ? "Lernansicht" : "query-basiert"}
        </span>
      </div>

      <p className="text-sm text-slate-600">{model.caption}</p>
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
        Drag zum Verschieben, Scroll zum Zoomen. Knoten sind automatisch ohne Überlappung angeordnet.
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
