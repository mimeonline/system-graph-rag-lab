"use client";

import { useEffect, useRef } from "react";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";

const ELEMENTS: ElementDefinition[] = [
  {
    data: { id: "q", label: "Architektur Risiko", kind: "question" },
    position: { x: 240, y: 34 },
  },
  {
    data: { id: "c1", label: "Systemgrenze", kind: "concept" },
    position: { x: 80, y: 102 },
  },
  {
    data: { id: "c2", label: "Nebenwirkung", kind: "concept" },
    position: { x: 240, y: 102 },
  },
  {
    data: { id: "c3", label: "Kontextsteuerung", kind: "concept" },
    position: { x: 400, y: 102 },
  },
  {
    data: { id: "e1", label: "Studie", kind: "evidence" },
    position: { x: 150, y: 172 },
  },
  {
    data: { id: "e2", label: "Commit Analyse", kind: "evidence" },
    position: { x: 330, y: 172 },
  },
  {
    data: { id: "w", label: "Robustere Entscheidung", kind: "impact" },
    position: { x: 240, y: 236 },
  },
  { data: { id: "q-c1", source: "q", target: "c1", label: "Relevanz", etype: "relevance" } },
  { data: { id: "q-c2", source: "q", target: "c2", label: "Relevanz", etype: "relevance" } },
  { data: { id: "q-c3", source: "q", target: "c3", label: "Relevanz", etype: "relevance" } },
  { data: { id: "c1-e1", source: "c1", target: "e1", label: "Bezug", etype: "evidence" } },
  { data: { id: "c2-e1", source: "c2", target: "e1", label: "Bezug", etype: "evidence" } },
  { data: { id: "c3-e2", source: "c3", target: "e2", label: "Bezug", etype: "evidence" } },
  { data: { id: "c1-w", source: "c1", target: "w", label: "Einfluss", etype: "impact" } },
  { data: { id: "c2-w", source: "c2", target: "w", label: "Einfluss", etype: "impact" } },
];

function isCyActive(cy: Core | null | undefined): cy is Core {
  if (!cy) {
    return false;
  }
  try {
    return !((cy as unknown as { destroyed?: () => boolean }).destroyed?.() ?? false);
  } catch {
    return false;
  }
}

export function ExecutiveHeroGraph(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const cy = cytoscape({
      container,
      elements: ELEMENTS,
      layout: { name: "preset", fit: false },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: true,
      autolock: true,
      wheelSensitivity: 0,
      minZoom: 1,
      maxZoom: 1,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            color: "#0f172a",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": 10.5,
            "font-weight": 600,
            "text-wrap": "wrap",
            "text-max-width": "110px",
            shape: "roundrectangle",
            width: 110,
            height: 34,
            "border-width": 1.35,
            "border-color": "#64748b",
            "background-color": "#f1f5f9",
          },
        },
        {
          selector: 'node[kind = "question"]',
          style: {
            width: 138,
            height: 36,
            "font-size": 11.2,
            "font-weight": 700,
            "background-color": "#dbeafe",
            "border-color": "#2563eb",
            "border-width": 1.8,
          },
        },
        {
          selector: 'node[kind = "concept"]',
          style: {
            width: 112,
            height: 34,
            "background-color": "#e2e8f0",
            "border-color": "#475569",
          },
        },
        {
          selector: 'node[kind = "evidence"]',
          style: {
            width: 90,
            height: 28,
            "font-size": 10,
            "background-color": "#f8fafc",
            "border-color": "#64748b",
            "text-max-width": "86px",
          },
        },
        {
          selector: 'node[kind = "impact"]',
          style: {
            width: 146,
            height: 36,
            "font-size": 11.2,
            "font-weight": 700,
            "background-color": "#dcfce7",
            "border-color": "#15803d",
            "border-width": 1.8,
          },
        },
        {
          selector: "edge",
          style: {
            width: 2.1,
            "line-color": "#94a3b8",
            "target-arrow-color": "#94a3b8",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 0.68,
            "line-opacity": 0.92,
            label: "data(label)",
            "font-size": 8,
            "text-rotation": "autorotate",
            "text-margin-y": -8,
            color: "#64748b",
            "text-background-opacity": 0,
          },
        },
        {
          selector: 'edge[etype = "relevance"]',
          style: {
            "line-color": "#60a5fa",
            "target-arrow-color": "#60a5fa",
          },
        },
        {
          selector: 'edge[etype = "evidence"]',
          style: {
            "line-color": "#94a3b8",
            "target-arrow-color": "#94a3b8",
          },
        },
        {
          selector: 'edge[etype = "impact"]',
          style: {
            "line-color": "#34d399",
            "target-arrow-color": "#34d399",
          },
        },
      ],
    });

    const fitGraph = () => {
      if (!isCyActive(cy)) {
        return;
      }
      cy.resize();
      cy.fit(undefined, 16);
    };

    window.requestAnimationFrame(() => {
      fitGraph();
    });

    const delayedFitTimer = window.setTimeout(() => {
      fitGraph();
    }, 110);

    const fonts = document.fonts;
    if (fonts?.ready) {
      void fonts.ready.then(() => {
        fitGraph();
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      fitGraph();
    });
    resizeObserver.observe(container);

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: ReturnType<typeof setInterval> | null = null;

    if (!prefersReducedMotion && isCyActive(cy)) {
      let offset = 0;
      cy.edges().style({ "line-dash-pattern": [5, 5], "line-dash-offset": offset });
      timer = setInterval(() => {
        if (!isCyActive(cy)) {
          return;
        }
        offset -= 0.5;
        cy.edges().style("line-dash-offset", offset);
      }, 110);
    }

    return () => {
      resizeObserver.disconnect();
      window.clearTimeout(delayedFitTimer);
      if (timer) {
        clearInterval(timer);
      }
      if (isCyActive(cy)) {
        cy.destroy();
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Story Graph</p>
        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          read only
        </span>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl border border-slate-200/80 bg-[#f7fafc] aspect-[16/10] min-h-[250px]">
        <div ref={containerRef} className="h-full w-full" aria-label="Kuratiertes, read-only Cytoscape Hero Graph" />
        <p className="pointer-events-none absolute bottom-2 left-3 text-[11px] text-slate-500">
          Belege und Beziehungen werden als Pfad sichtbar.
        </p>
      </div>
    </div>
  );
}
