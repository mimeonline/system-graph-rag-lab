"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type EssayNodeKind = "cluster" | "essay";
type FlowMode = "desktop" | "mobile";
type TooltipSide = "top" | "bottom";

type EssayClusterData = {
  id: string;
  title: string;
};

type EssayNodeData = {
  id: string;
  parent: string;
  slug: string;
  title: string;
  thesis: string;
};

type TooltipState = {
  open: boolean;
  text: string;
  x: number;
  y: number;
  side: TooltipSide;
};

const CLUSTERS: EssayClusterData[] = [
  { id: "cluster-problem", title: "Problemraum" },
  { id: "cluster-structure", title: "Struktur & Differenzierung" },
  { id: "cluster-quality", title: "Qualitäts- & Architekturprinzipien" },
  { id: "cluster-organization", title: "Organisation & Anwendung" },
  { id: "cluster-positioning", title: "Positionierung" },
];

const ESSAYS: EssayNodeData[] = [
  {
    id: "essay-problem-1",
    parent: "cluster-problem",
    slug: "warum-ki-antworten-fuer-entscheidungen-nicht-ausreichen",
    title: "Warum KI-Antworten für Entscheidungen nicht ausreichen",
    thesis: "Plausibilität ersetzt keine nachvollziehbare Herleitung in entscheidungsrelevanten Kontexten.",
  },
  {
    id: "essay-structure-1",
    parent: "cluster-structure",
    slug: "was-graphrag-strukturell-anders-macht-als-klassisches-rag",
    title: "Was GraphRAG strukturell anders macht als klassisches RAG",
    thesis: "GraphRAG ergänzt Textretrieval um explizite Beziehungen und macht dadurch den Argumentationspfad sichtbar.",
  },
  {
    id: "essay-structure-2",
    parent: "cluster-structure",
    slug: "kontextdisziplin-warum-weniger-kontext-oft-bessere-antworten-erzeugt",
    title: "Kontextdisziplin: Warum weniger Kontext oft bessere Antworten erzeugt",
    thesis: "Gezielte Kontextauswahl reduziert Rauschen und erhöht die Belastbarkeit der Antwort.",
  },
  {
    id: "essay-quality-1",
    parent: "cluster-quality",
    slug: "qualitaetskriterien-fuer-ein-produktives-graphrag-system",
    title: "Qualitätskriterien für ein produktives GraphRAG-System",
    thesis: "Ein produktives System braucht klare Qualitätskriterien für Retrieval, Herleitung und Antwortstabilität.",
  },
  {
    id: "essay-quality-2",
    parent: "cluster-quality",
    slug: "prompt-transparenz-als-vertrauensfaktor",
    title: "Prompt-Transparenz als Vertrauensfaktor",
    thesis: "Transparente Prompt-Bausteine machen die Antwortentstehung prüfbar und diskutierbar.",
  },
  {
    id: "essay-organization-1",
    parent: "cluster-organization",
    slug: "graphrag-als-entscheidungs-interface-fuer-organisationen",
    title: "GraphRAG als Entscheidungs-Interface für Organisationen",
    thesis: "GraphRAG verbindet Fachkontext, Belege und Entscheidungspfade in einer arbeitsfähigen Oberfläche.",
  },
  {
    id: "essay-organization-2",
    parent: "cluster-organization",
    slug: "system-thinking-als-idealer-use-case-fuer-graphrag",
    title: "System Thinking als idealer Use Case für GraphRAG",
    thesis: "System Thinking zeigt, warum relationale Kontextstruktur in komplexen Problemräumen entscheidend ist.",
  },
  {
    id: "essay-positioning-1",
    parent: "cluster-positioning",
    slug: "von-plausiblen-antworten-zu-pruefbaren-entscheidungen",
    title: "Von plausiblen Antworten zu prüfbaren Entscheidungen",
    thesis: "Der Mehrwert entsteht, wenn Antworten nicht nur plausibel klingen, sondern belastbar überprüft werden können.",
  },
];

const FLOW_EDGES: ElementDefinition[] = [
  { data: { id: "flow-problem-structure", source: "cluster-problem", target: "cluster-structure" } },
  { data: { id: "flow-structure-quality", source: "cluster-structure", target: "cluster-quality" } },
  { data: { id: "flow-quality-organization", source: "cluster-quality", target: "cluster-organization" } },
  { data: { id: "flow-organization-positioning", source: "cluster-organization", target: "cluster-positioning" } },
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) {
    return label;
  }
  return `${label.slice(0, Math.max(0, maxLength - 1))}…`;
}

function buildElements(): ElementDefinition[] {
  const clusterNodes: ElementDefinition[] = CLUSTERS.map((cluster) => ({
    data: {
      id: cluster.id,
      label: cluster.title,
      kind: "cluster" as EssayNodeKind,
    },
  }));

  const essayNodes: ElementDefinition[] = ESSAYS.map((essay) => ({
    data: {
      id: essay.id,
      parent: essay.parent,
      kind: "essay" as EssayNodeKind,
      slug: essay.slug,
      title: essay.title,
      thesis: essay.thesis,
      label: truncateLabel(essay.title, 58),
    },
  }));

  return [...clusterNodes, ...essayNodes, ...FLOW_EDGES];
}

function applyDeterministicPositions(cy: Core, mode: FlowMode, width: number, height: number): void {
  const safeWidth = Math.max(width, 360);
  const safeHeight = Math.max(height, mode === "desktop" ? 540 : 1240);

  const desktopColumns = [0.08, 0.29, 0.5, 0.71, 0.92].map((factor) => safeWidth * factor);
  const mobileTop = Math.max(90, safeHeight * 0.1);
  const mobileBottom = Math.max(90, safeHeight * 0.1);
  const mobileStep = (safeHeight - mobileTop - mobileBottom) / 4;
  const mobileRows = [0, 1, 2, 3, 4].map((index) => mobileTop + mobileStep * index);

  const singleOffset = 0;
  const pairOffset =
    mode === "desktop"
      ? Math.min(74, Math.max(56, safeHeight * 0.08))
      : Math.min(44, Math.max(34, safeHeight * 0.04));

  const clusterCenter = (index: number) => {
    if (mode === "desktop") {
      return { x: desktopColumns[index] ?? safeWidth * 0.92, y: safeHeight * 0.45 };
    }
    return { x: safeWidth * 0.5, y: mobileRows[index] ?? safeHeight * 0.82 };
  };

  const essayPositionMap: Record<string, { index: number; variant: "single" | "upper" | "lower" }> = {
    "essay-problem-1": { index: 0, variant: "single" },
    "essay-structure-1": { index: 1, variant: "upper" },
    "essay-structure-2": { index: 1, variant: "lower" },
    "essay-quality-1": { index: 2, variant: "upper" },
    "essay-quality-2": { index: 2, variant: "lower" },
    "essay-organization-1": { index: 3, variant: "upper" },
    "essay-organization-2": { index: 3, variant: "lower" },
    "essay-positioning-1": { index: 4, variant: "single" },
  };

  cy.batch(() => {
    cy.nodes().unlock();

    for (const [essayId, placement] of Object.entries(essayPositionMap)) {
      const center = clusterCenter(placement.index);
      const yOffset =
        placement.variant === "single" ? singleOffset : placement.variant === "upper" ? -pairOffset : pairOffset;
      const xOffset = mode === "desktop" ? 0 : 0;

      cy.$id(essayId).position({
        x: center.x + xOffset,
        y: center.y + yOffset,
      });
    }

    cy.nodes('[kind = "essay"]').lock();
  });

  cy.resize();
  if (mode === "desktop") {
    cy.fit(cy.elements(), 24);
    cy.center();
    return;
  }
  cy.zoom(1);
  cy.pan({ x: 0, y: 0 });
}

export function GraphEssaysSurface(): React.JSX.Element {
  const router = useRouter();
  const graphBoxRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    open: false,
    text: "",
    x: 0,
    y: 0,
    side: "top",
  });

  const elements = useMemo(() => buildElements(), []);

  useEffect(() => {
    const container = containerRef.current;
    const graphBox = graphBoxRef.current;
    if (!container || !graphBox) {
      return;
    }

    const cy = cytoscape({
      container,
      elements,
      layout: { name: "preset" },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: true,
      autolock: false,
      wheelSensitivity: 0,
      minZoom: 0.45,
      maxZoom: 1.2,
      style: [
        {
          selector: 'node[kind = "cluster"]',
          style: {
            label: "data(label)",
            "font-size": 10.5,
            "font-weight": 700,
            color: "#475569",
            "text-valign": "top",
            "text-halign": "center",
            "text-margin-y": 12,
            "text-wrap": "wrap",
            "text-max-width": "154px",
            "background-color": "#dbeafe",
            "background-opacity": 0.32,
            "border-width": 0,
            "padding": "12px",
            shape: "roundrectangle",
            "compound-sizing-wrt-labels": "exclude",
            "min-width": "176px",
            "min-height": "148px",
            "z-compound-depth": "bottom",
            "events": "no",
          },
        },
        {
          selector: 'node[kind = "essay"]',
          style: {
            label: "data(label)",
            color: "#0f172a",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": 11,
            "font-weight": 600,
            "text-wrap": "wrap",
            "text-max-width": "152px",
            shape: "roundrectangle",
            width: 168,
            height: 74,
            "border-width": 1.3,
            "border-color": "#64748b",
            "background-color": "#f8fafc",
            "overlay-opacity": 0,
            "z-index": 20,
          },
        },
        {
          selector: 'node[kind = "essay"]:hover',
          style: {
            "border-color": "#2563eb",
            "background-color": "#eef5ff",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1,
            "line-color": "#94a3b8",
            "line-opacity": 0.42,
            "curve-style": "straight",
            "target-arrow-shape": "none",
            "source-arrow-shape": "none",
            "overlay-opacity": 0,
            "events": "no",
            "z-index": 5,
          },
        },
      ],
    });

    const applyLayout = () => {
      if (!isCyActive(cy) || !container) {
        return;
      }
      const mode: FlowMode = window.innerWidth >= 900 ? "desktop" : "mobile";
      applyDeterministicPositions(cy, mode, container.clientWidth, container.clientHeight);
      setTooltipState((current) => ({ ...current, open: false }));
    };

    const rafId = window.requestAnimationFrame(() => {
      applyLayout();
      window.requestAnimationFrame(() => {
        applyLayout();
      });
    });

    const handleResize = () => {
      applyLayout();
    };

    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(() => {
      applyLayout();
    });
    resizeObserver.observe(container);
    resizeObserver.observe(graphBox);

    const handleNodeMouseOver = (event: cytoscape.EventObject) => {
      if (!isCyActive(cy)) {
        return;
      }
      const node = event.target;
      if (String(node.data("kind")) !== "essay") {
        return;
      }

      const rendered = node.renderedPosition();
      const boxWidth = container.clientWidth;
      const boxHeight = container.clientHeight;
      const estimatedTooltipWidth = 320;
      const left = clamp(rendered.x + 8, 10, Math.max(10, boxWidth - estimatedTooltipWidth - 10));
      const top = clamp(rendered.y, 14, Math.max(14, boxHeight - 14));
      const side: TooltipSide = rendered.y < 92 ? "bottom" : "top";

      setTooltipState({
        open: true,
        text: String(node.data("thesis") ?? ""),
        x: left,
        y: top,
        side,
      });
    };

    const handleNodeMouseOut = () => {
      setTooltipState((current) => ({ ...current, open: false }));
    };

    const handleTapNode = (event: cytoscape.EventObject) => {
      const node = event.target;
      if (String(node.data("kind")) !== "essay") {
        return;
      }
      const slug = String(node.data("slug") ?? "");
      if (!slug) {
        return;
      }
      router.push(`/blog/${slug}`);
    };

    cy.on("mouseover", 'node[kind = "essay"]', handleNodeMouseOver);
    cy.on("mouseout", 'node[kind = "essay"]', handleNodeMouseOut);
    cy.on("tap", 'node[kind = "essay"]', handleTapNode);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(rafId);
      cy.off("mouseover", 'node[kind = "essay"]', handleNodeMouseOver);
      cy.off("mouseout", 'node[kind = "essay"]', handleNodeMouseOut);
      cy.off("tap", 'node[kind = "essay"]', handleTapNode);
      if (isCyActive(cy)) {
        cy.destroy();
      }
    };
  }, [elements, router]);

  return (
    <TooltipProvider delayDuration={70}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Graph Surface</p>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            read only
          </span>
        </div>

        <div
          ref={graphBoxRef}
          className="relative h-[1240px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#f7fafc] md:h-[clamp(420px,52vh,520px)]"
        >
          <div ref={containerRef} className="h-full w-full" aria-label="Graph Essays Cytoscape Surface" />

          <Tooltip open={tooltipState.open}>
            <TooltipTrigger asChild>
              <span
                className="pointer-events-none absolute h-1 w-1"
                style={{ left: `${tooltipState.x}px`, top: `${tooltipState.y}px` }}
                aria-hidden
              />
            </TooltipTrigger>
            <TooltipContent side={tooltipState.side} align="start" sideOffset={8} className="max-w-[320px]">
              {tooltipState.text}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
