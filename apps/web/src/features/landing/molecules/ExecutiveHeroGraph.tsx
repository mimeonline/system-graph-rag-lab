"use client";

import { useEffect, useRef, useState } from "react";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ELEMENTS: ElementDefinition[] = [
  {
    data: { id: "q", label: "Frage", kind: "question" },
    position: { x: 240, y: 34 },
  },
  {
    data: { id: "c1", label: "Konzept", kind: "concept" },
    position: { x: 80, y: 102 },
  },
  {
    data: { id: "c2", label: "Konzept", kind: "concept" },
    position: { x: 240, y: 102 },
  },
  {
    data: { id: "c3", label: "Konzept", kind: "concept" },
    position: { x: 400, y: 102 },
  },
  {
    data: { id: "e1", label: "Beleg", kind: "evidence" },
    position: { x: 150, y: 172 },
  },
  {
    data: { id: "e2", label: "Beleg", kind: "evidence" },
    position: { x: 330, y: 172 },
  },
  {
    data: { id: "w", label: "Entscheidung", kind: "impact" },
    position: { x: 240, y: 236 },
  },
  { data: { id: "q-c1", source: "q", target: "c1", etype: "relevance" } },
  { data: { id: "q-c2", source: "q", target: "c2", etype: "relevance" } },
  { data: { id: "q-c3", source: "q", target: "c3", etype: "relevance" } },
  { data: { id: "c1-e1", source: "c1", target: "e1", etype: "evidence" } },
  { data: { id: "c2-e1", source: "c2", target: "e1", etype: "evidence" } },
  { data: { id: "c2-e2", source: "c2", target: "e2", etype: "evidence" } },
  { data: { id: "c3-e2", source: "c3", target: "e2", etype: "evidence" } },
  { data: { id: "e1-w", source: "e1", target: "w", etype: "impact" } },
  { data: { id: "e2-w", source: "e2", target: "w", etype: "impact" } },
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

type TooltipKind = "question" | "concept" | "evidence" | "impact";
type TooltipSide = "top" | "bottom";
type HeroTooltipState = {
  open: boolean;
  text: string;
  x: number;
  y: number;
  side: TooltipSide;
};

const TOOLTIP_TEXT_BY_KIND: Record<TooltipKind, string> = {
  question: "Welches Problem oder welche Entscheidung soll geklärt werden?",
  concept: "Strukturierende Begriffe, die die Herleitung ordnen.",
  evidence: "Prüfbare Grundlage: Dokument, Messwert oder Quelle.",
  impact: "Ableitung aus Beziehungen, nachvollziehbar als Pfad.",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function ExecutiveHeroGraph(): React.JSX.Element {
  const graphBoxRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltipState, setTooltipState] = useState<HeroTooltipState>({
    open: false,
    text: "",
    x: 0,
    y: 0,
    side: "top",
  });

  useEffect(() => {
    const container = containerRef.current;
    const graphBox = graphBoxRef.current;
    if (!container || !graphBox) {
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
            width: 108,
            height: 32,
            "font-size": 9.5,
            "background-color": "#f8fafc",
            "border-color": "#64748b",
            "text-max-width": "100px",
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
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width <= 0 || height <= 0) {
        return;
      }
      cy.resize();
      cy.fit(undefined, 16);
      cy.center();
    };

    const rafId = window.requestAnimationFrame(() => {
      fitGraph();
      window.requestAnimationFrame(() => {
        fitGraph();
      });
    });

    const delayedFitTimer = window.setTimeout(() => {
      fitGraph();
    }, 120);

    let postFontsFitTimer: number | null = null;
    const fonts = document.fonts;
    if (fonts?.ready) {
      void fonts.ready.then(() => {
        fitGraph();
        postFontsFitTimer = window.setTimeout(() => {
          fitGraph();
        }, 0);
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      fitGraph();
    });
    resizeObserver.observe(container);
    resizeObserver.observe(graphBox);

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

    const handleNodeMouseOver = (event: cytoscape.EventObject) => {
      if (!isCyActive(cy)) {
        return;
      }
      const node = event.target;
      const kind = String(node.data("kind") ?? "concept") as TooltipKind;
      const text = TOOLTIP_TEXT_BY_KIND[kind] ?? TOOLTIP_TEXT_BY_KIND.concept;
      const rendered = node.renderedPosition();
      const boxWidth = container.clientWidth;
      const boxHeight = container.clientHeight;
      const estimatedTooltipWidth = 220;
      const left = clamp(rendered.x + 10, 10, Math.max(10, boxWidth - estimatedTooltipWidth - 10));
      const top = clamp(rendered.y, 14, Math.max(14, boxHeight - 14));
      const side: TooltipSide = rendered.y < 70 ? "bottom" : "top";

      setTooltipState({
        open: true,
        text,
        x: left,
        y: top,
        side,
      });
    };

    const handleNodeMouseOut = () => {
      setTooltipState((current) => ({ ...current, open: false }));
    };

    cy.on("mouseover", "node", handleNodeMouseOver);
    cy.on("mouseout", "node", handleNodeMouseOut);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(delayedFitTimer);
      if (postFontsFitTimer) {
        window.clearTimeout(postFontsFitTimer);
      }
      cy.off("mouseover", "node", handleNodeMouseOver);
      cy.off("mouseout", "node", handleNodeMouseOut);
      if (timer) {
        clearInterval(timer);
      }
      if (isCyActive(cy)) {
        cy.destroy();
      }
    };
  }, []);

  return (
    <TooltipProvider delayDuration={70}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Story Graph</p>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            read only
          </span>
        </div>

        <div
          ref={graphBoxRef}
          className="relative w-full overflow-hidden rounded-xl border border-slate-200/80 bg-[#f7fafc] aspect-[16/10] min-h-[250px]"
        >
          <div ref={containerRef} className="h-full w-full" aria-label="Kuratiertes, read-only Cytoscape Hero Graph" />

          <Tooltip open={tooltipState.open}>
            <TooltipTrigger asChild>
              <span
                className="pointer-events-none absolute h-1 w-1"
                style={{ left: `${tooltipState.x}px`, top: `${tooltipState.y}px` }}
                aria-hidden
              />
            </TooltipTrigger>
            <TooltipContent
              side={tooltipState.side}
              align="start"
              sideOffset={8}
              className="max-w-[220px]"
            >
              {tooltipState.text}
            </TooltipContent>
          </Tooltip>

          <p className="pointer-events-none absolute bottom-2 left-3 text-[11px] text-slate-500">
            Strukturierte Herleitung statt isolierter Textantwort.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
