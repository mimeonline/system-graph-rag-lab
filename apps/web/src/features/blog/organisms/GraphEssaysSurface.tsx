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
  titleDesktop: string;
  titleMobile: string;
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

const FLOATING_NODE_STYLE: Record<string, string | number> = {
  "shadow-blur": 30,
  "shadow-color": "#0f172a",
  "shadow-opacity": 0.26,
  "shadow-offset-x": 0,
  "shadow-offset-y": 12,
  "transition-property": "shadow-opacity, shadow-blur, border-color, background-color",
  "transition-duration": "180ms",
};

const FLOATING_NODE_HOVER_STYLE: Record<string, string | number> = {
  "shadow-opacity": 0.38,
  "shadow-blur": 34,
  "shadow-offset-y": 15,
};

const CLUSTERS: EssayClusterData[] = [
  { id: "cluster-problem", titleDesktop: "Problemraum", titleMobile: "Problemraum" },
  { id: "cluster-structure", titleDesktop: "Struktur", titleMobile: "Struktur" },
  { id: "cluster-quality", titleDesktop: "Qualität", titleMobile: "Qualität" },
  { id: "cluster-organization", titleDesktop: "Organisation", titleMobile: "Organisation" },
  { id: "cluster-positioning", titleDesktop: "Positionierung", titleMobile: "Positionierung" },
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

const ROUTE_EDGES: ElementDefinition[] = [
  { data: { id: "route-1", source: "essay-problem-1", target: "essay-structure-1", lane: "main" } },
  { data: { id: "route-2", source: "essay-structure-1", target: "essay-quality-1", lane: "main" } },
  { data: { id: "route-3", source: "essay-quality-1", target: "essay-organization-1", lane: "main" } },
  { data: { id: "route-4", source: "essay-organization-1", target: "essay-positioning-1", lane: "main" } },
  { data: { id: "route-5", source: "essay-structure-1", target: "essay-structure-2", lane: "drill" } },
  { data: { id: "route-6", source: "essay-quality-1", target: "essay-quality-2", lane: "drill" } },
  { data: { id: "route-7", source: "essay-organization-1", target: "essay-organization-2", lane: "drill" } },
  { data: { id: "route-8", source: "essay-structure-2", target: "essay-quality-2", lane: "bridge" } },
  { data: { id: "route-9", source: "essay-quality-2", target: "essay-organization-2", lane: "bridge" } },
  { data: { id: "route-10", source: "essay-organization-2", target: "essay-positioning-1", lane: "bridge" } },
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
      clusterLabel: cluster.titleDesktop,
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

  return [...clusterNodes, ...essayNodes, ...ROUTE_EDGES];
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
    for (const cluster of CLUSTERS) {
      cy.$id(cluster.id).data("clusterLabel", mode === "desktop" ? cluster.titleDesktop : cluster.titleMobile);
    }

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
            label: "data(clusterLabel)",
            "font-size": 11,
            "font-weight": 700,
            color: "#dbeafe",
            "text-valign": "top",
            "text-halign": "center",
            "text-margin-y": 12,
            "text-wrap": "wrap",
            "text-max-width": "160px",
            "background-color": "#e7f0ff",
            "background-opacity": 0.18,
            "border-width": 0,
            "padding": "12px",
            shape: "roundrectangle",
            "compound-sizing-wrt-labels": "exclude",
            "min-width": "212px",
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
            "border-color": "#60a5fa",
            "background-color": "#ffffff",
            "overlay-opacity": 0,
            "z-index": 20,
            ...FLOATING_NODE_STYLE,
          },
        },
        {
          selector: 'node[kind = "essay"]:hover',
          style: {
            "border-color": "#2563eb",
            "background-color": "#fefefe",
            ...FLOATING_NODE_HOVER_STYLE,
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.2,
            "line-color": "#cbd5e1",
            "line-opacity": 0.45,
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#93c5fd",
            "arrow-scale": 0.74,
            "source-arrow-shape": "none",
            "overlay-opacity": 0,
            "events": "no",
            "z-index": 5,
          },
        },
        {
          selector: 'edge[lane = "main"]',
          style: {
            width: 1.8,
            "line-color": "#dbeafe",
            "line-opacity": 0.92,
            "target-arrow-color": "#dbeafe",
            "control-point-distances": [26],
            "control-point-weights": [0.5],
          },
        },
        {
          selector: 'edge[lane = "drill"]',
          style: {
            width: 1.3,
            "line-color": "#bfdbfe",
            "line-opacity": 0.72,
            "target-arrow-color": "#bfdbfe",
          },
        },
        {
          selector: 'edge[lane = "bridge"]',
          style: {
            width: 1.2,
            "line-color": "#94a3b8",
            "line-opacity": 0.5,
            "target-arrow-color": "#94a3b8",
            "line-style": "dashed",
            "line-dash-pattern": [4, 4],
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
      const offsetLeft = container.offsetLeft;
      const offsetTop = container.offsetTop;
      const estimatedTooltipWidth = 320;
      const left = clamp(rendered.x + offsetLeft + 8, 10, Math.max(10, boxWidth + offsetLeft - estimatedTooltipWidth - 10));
      const top = clamp(rendered.y + offsetTop, offsetTop + 14, Math.max(offsetTop + 14, boxHeight + offsetTop - 14));
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
        <div
          ref={graphBoxRef}
          className="relative h-[1320px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-[linear-gradient(180deg,#0b2b57_0%,#0c3a74_100%)] md:h-[clamp(460px,56vh,560px)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_70%_at_18%_22%,rgba(147,197,253,0.22),transparent_70%),radial-gradient(90%_60%_at_78%_72%,rgba(96,165,250,0.2),transparent_75%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_35%,rgba(15,23,42,0.2)_100%)]" />
          <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between border-b border-white/15 bg-[#0a1f3f]/55 px-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">Argumentationsfluss als Route</p>
            <span className="rounded-full border border-slate-400/40 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
              read only
            </span>
          </div>

          <div className="relative flex-1">
            <div ref={containerRef} className="h-full w-full" aria-label="Graph Essays Cytoscape Surface" />
          </div>

          <div className="flex min-h-14 items-center gap-2 border-t border-white/15 bg-white/92 px-4 py-2">
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              Route als Story
            </span>
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              Dunkler Premium-Canvas
            </span>
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              Knoten als Stops
            </span>
          </div>
        </div>

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
    </TooltipProvider>
  );
}
