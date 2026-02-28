"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import cytoscape, { type Core, type ElementDefinition, type StylesheetCSS } from "cytoscape";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type EssayNodeKind = "cluster" | "essay";
type GraphNodeKind = EssayNodeKind | "cluster-label";
type FlowMode = "desktop" | "mobile";
type TooltipSide = "top" | "bottom";

type EssayClusterData = {
  id: string;
  titleDesktop: string;
  titleMobile: string;
};

type ClusterLabelNodeData = {
  id: string;
  clusterId: string;
  labelDesktop: string;
  labelMobile: string;
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
  { id: "cluster-problem", titleDesktop: "Problemraum", titleMobile: "Problemraum" },
  { id: "cluster-structure", titleDesktop: "Struktur", titleMobile: "Struktur" },
  { id: "cluster-quality", titleDesktop: "Qualität", titleMobile: "Qualität" },
  { id: "cluster-organization", titleDesktop: "Organisation", titleMobile: "Organisation" },
  { id: "cluster-positioning", titleDesktop: "Positionierung", titleMobile: "Positionierung" },
];

const CLUSTER_LABELS: ClusterLabelNodeData[] = CLUSTERS.map((cluster) => ({
  id: `label-${cluster.id}`,
  clusterId: cluster.id,
  labelDesktop: cluster.titleDesktop,
  labelMobile: cluster.titleMobile,
}));

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

const PRIMARY_ROUTE_NODE_IDS = [
  "essay-problem-1",
  "essay-structure-1",
  "essay-quality-1",
  "essay-organization-1",
  "essay-positioning-1",
] as const;

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
      kind: "cluster" as GraphNodeKind,
    },
  }));

  const essayNodes: ElementDefinition[] = ESSAYS.map((essay) => ({
    data: {
      id: essay.id,
      parent: essay.parent,
      kind: "essay" as GraphNodeKind,
      slug: essay.slug,
      title: essay.title,
      thesis: essay.thesis,
      label: truncateLabel(essay.title, 58),
    },
  }));

  const clusterLabelNodes: ElementDefinition[] = CLUSTER_LABELS.map((labelNode) => ({
    data: {
      id: labelNode.id,
      clusterId: labelNode.clusterId,
      kind: "cluster-label" as GraphNodeKind,
      label: labelNode.labelDesktop,
    },
  }));

  return [...clusterNodes, ...essayNodes, ...clusterLabelNodes, ...ROUTE_EDGES];
}

function applyDeterministicPositions(cy: Core, mode: FlowMode, width: number, height: number): void {
  const safeWidth = Math.max(width, 380);
  const safeHeight = Math.max(height, mode === "desktop" ? 620 : 1260);

  const leftPad = mode === "desktop" ? clamp(safeWidth * 0.1, 150, 230) : safeWidth * 0.5;
  const rightPad = mode === "desktop" ? clamp(safeWidth * 0.1, 150, 230) : safeWidth * 0.5;

  const desktopColumns = mode === "desktop"
    ? (() => {
        const usableWidth = safeWidth - leftPad - rightPad;
        const centerX = safeWidth * 0.5;
        const innerGap = clamp(usableWidth * 0.175, 210, 280);
        const outerGap = clamp(usableWidth * 0.225, 250, 330);
        const target = [
          centerX - innerGap - outerGap,
          centerX - innerGap,
          centerX,
          centerX + innerGap,
          centerX + innerGap + outerGap,
        ];
        const minTarget = Math.min(...target);
        const maxTarget = Math.max(...target);
        const targetSpan = Math.max(1, maxTarget - minTarget);
        const availableSpan = Math.max(1, safeWidth - leftPad - rightPad);
        const scale = targetSpan > availableSpan ? availableSpan / targetSpan : 1;
        return target.map((value) => leftPad + (value - minTarget) * scale);
      })()
    : [];

  const mobileTop = Math.max(120, safeHeight * 0.11);
  const mobileBottom = Math.max(100, safeHeight * 0.1);
  const mobileStep = (safeHeight - mobileTop - mobileBottom) / 4;
  const mobileRows = [0, 1, 2, 3, 4].map((index) => mobileTop + mobileStep * index);

  const pairOffset = mode === "desktop" ? 88 : 44;
  const labelOffset = mode === "desktop" ? 170 : 104;
  const fitPadding = mode === "desktop" ? 80 : 40;

  const clusterCenter = (index: number) => {
    if (mode === "desktop") {
      return { x: desktopColumns[index] ?? safeWidth - rightPad, y: safeHeight * 0.5 };
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

    for (const clusterLabel of CLUSTER_LABELS) {
      const clusterIndex = CLUSTERS.findIndex((cluster) => cluster.id === clusterLabel.clusterId);
      const center = clusterCenter(Math.max(0, clusterIndex));
      cy.$id(clusterLabel.id).data("label", mode === "desktop" ? clusterLabel.labelDesktop : clusterLabel.labelMobile);
      cy.$id(clusterLabel.id).position({
        x: center.x,
        y: center.y - labelOffset,
      });
    }

    for (const [essayId, placement] of Object.entries(essayPositionMap)) {
      const center = clusterCenter(placement.index);
      const yOffset = placement.variant === "single" ? 0 : placement.variant === "upper" ? -pairOffset : pairOffset;

      cy.$id(essayId).position({ x: center.x, y: center.y + yOffset });
    }

    cy.nodes('[kind = "essay"], [kind = "cluster-label"]').lock();
  });

  cy.resize();
  cy.fit(cy.elements(), fitPadding);
  cy.center();
}

export function GraphEssaysSurface(): React.JSX.Element {
  const router = useRouter();
  const graphBoxRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);
  const didAnimateRef = useRef(false);
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

    const cyStyles = [
      {
        selector: 'node[kind = "cluster"]',
        style: {
          label: "",
          "background-color": "#ffffff",
          "background-opacity": 0,
          "border-width": 0,
          "padding": "10px",
          shape: "roundrectangle",
          "compound-sizing-wrt-labels": "exclude",
          "min-width": "230px",
          "min-height": "212px",
          "z-compound-depth": "bottom",
          events: "no",
        },
      },
      {
        selector: 'node[kind = "cluster-label"]',
        style: {
          label: "data(label)",
          "font-size": 13,
          "font-weight": 700,
          color: "#e7efff",
          "text-outline-width": 2,
          "text-outline-color": "#103568",
          "text-valign": "center",
          "text-halign": "center",
          width: 170,
          height: 24,
          "background-opacity": 0,
          "border-width": 0,
          "overlay-opacity": 0,
          "z-index": 999,
          "z-compound-depth": "top",
          events: "no",
        },
      },
      {
        selector: 'node[kind = "essay"]',
        style: {
          label: "data(label)",
          color: "#0f172a",
          "text-valign": "center",
          "text-halign": "center",
          "font-size": 10.8,
          "font-weight": 600,
          "text-wrap": "wrap",
          "text-max-width": "154px",
          shape: "roundrectangle",
          width: 170,
          height: 74,
          "border-width": 1.08,
          "border-color": "#9aa9be",
          "background-color": "#ffffff",
          "background-fill": "linear-gradient",
          "background-gradient-stop-colors": "#ffffff #f3f6fb",
          "background-gradient-stop-positions": "0% 100%",
          "background-gradient-direction": "to-bottom",
          "underlay-color": "#0f172a",
          "underlay-opacity": 0.2,
          "underlay-padding": 3,
          "overlay-opacity": 0,
          "z-index": 20,
        },
      },
      {
        selector: `node[id = "${PRIMARY_ROUTE_NODE_IDS.join('\"], node[id = \"')}"]`,
        style: {
          width: 184,
          height: 82,
          "font-size": 11.35,
          "font-weight": 680,
          "border-width": 1.22,
          "border-color": "#879ab3",
          "underlay-opacity": 0.24,
          "underlay-padding": 4,
        },
      },
      {
        selector: 'node[id = "essay-positioning-1"]',
        style: {
          width: 196,
          height: 84,
          "font-size": 11.7,
          "font-weight": 700,
          "border-width": 1.35,
          "border-color": "#6f84a0",
          "underlay-opacity": 0.32,
          "underlay-padding": 5,
        },
      },
      {
        selector: 'node[kind = "essay"]:hover',
        style: {
          "border-width": 1.25,
          "background-opacity": 0.98,
          "underlay-opacity": 0.34,
          "underlay-padding": 5,
        },
      },
      {
        selector: "edge",
        style: {
          width: 1,
          "line-color": "#94a3b8",
          "line-opacity": 0.3,
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
          "target-arrow-color": "#94a3b8",
          "arrow-scale": 0.66,
          "source-arrow-shape": "none",
          "overlay-opacity": 0,
          events: "no",
          "z-index": 5,
        },
      },
      {
        selector: 'edge[lane = "main"]',
        style: {
          width: 1.08,
          "line-color": "#cbd5e1",
          "line-opacity": 0.35,
          "target-arrow-color": "#cbd5e1",
        },
      },
      {
        selector: 'edge[lane = "drill"]',
        style: {
          width: 1,
          "line-color": "#94a3b8",
          "line-opacity": 0.3,
        },
      },
      {
        selector: 'edge[lane = "bridge"]',
        style: {
          width: 1,
          "line-color": "#94a3b8",
          "line-opacity": 0.26,
          "line-style": "dashed",
          "line-dash-pattern": [5, 4],
        },
      },
    ] as unknown as StylesheetCSS[];

    const cy = cytoscape({
      container,
      elements,
      layout: { name: "preset" },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: true,
      autolock: false,
      wheelSensitivity: 0.22,
      minZoom: 0.6,
      maxZoom: 1.6,
      style: cyStyles,
    });
    cyRef.current = cy;

    const applyLayout = () => {
      if (!isCyActive(cy) || !container) {
        return;
      }
      const mode: FlowMode = window.innerWidth >= 980 ? "desktop" : "mobile";
      applyDeterministicPositions(cy, mode, container.clientWidth, container.clientHeight);
      setTooltipState((current) => ({ ...current, open: false }));
    };

    const runEntryAnimation = () => {
      if (!isCyActive(cy) || didAnimateRef.current) {
        return;
      }
      didAnimateRef.current = true;
      cy.elements().style("opacity", 0);
      window.setTimeout(() => {
        cy.edges('[lane = "main"]').animate({ style: { opacity: 1 } }, { duration: 220 });
      }, 80);
      window.setTimeout(() => {
        cy.nodes('[kind = "cluster-label"]').animate({ style: { opacity: 1 } }, { duration: 180 });
        cy.nodes('[kind = "essay"]').animate({ style: { opacity: 1 } }, { duration: 260 });
      }, 220);
      window.setTimeout(() => {
        cy.edges('[lane != "main"]').animate({ style: { opacity: 1 } }, { duration: 220 });
        cy.nodes('[kind = "cluster"]').animate({ style: { opacity: 1 } }, { duration: 220 });
      }, 420);
      window.setTimeout(() => {
        if (!isCyActive(cy)) {
          return;
        }
        cy.elements().style("opacity", 1);
      }, 700);
    };

    const rafId = window.requestAnimationFrame(() => {
      applyLayout();
      window.requestAnimationFrame(() => {
        applyLayout();
        runEntryAnimation();
      });
    });

    const handleResize = () => {
      applyLayout();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (!isCyActive(cy)) {
        return;
      }
      if (event.key === "0") {
        event.preventDefault();
        applyLayout();
        return;
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        cy.zoom({
          level: Math.min(cy.maxZoom(), cy.zoom() * 1.12),
          renderedPosition: { x: container.clientWidth / 2, y: container.clientHeight / 2 },
        });
        return;
      }
      if (event.key === "-") {
        event.preventDefault();
        cy.zoom({
          level: Math.max(cy.minZoom(), cy.zoom() / 1.12),
          renderedPosition: { x: container.clientWidth / 2, y: container.clientHeight / 2 },
        });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeydown);
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
      const side: TooltipSide = rendered.y < 120 ? "bottom" : "top";

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
      window.removeEventListener("keydown", handleKeydown);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(rafId);
      cy.off("mouseover", 'node[kind = "essay"]', handleNodeMouseOver);
      cy.off("mouseout", 'node[kind = "essay"]', handleNodeMouseOut);
      cy.off("tap", 'node[kind = "essay"]', handleTapNode);
      if (isCyActive(cy)) {
        cy.destroy();
      }
      cyRef.current = null;
      didAnimateRef.current = false;
    };
  }, [elements, router]);

  return (
    <TooltipProvider delayDuration={70}>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-slate-100 py-6 sm:py-8">

        <div className="relative mx-auto w-full max-w-[1520px] px-4 md:px-16 lg:px-20 xl:px-24">
          <div
            ref={graphBoxRef}
            className="relative h-[1260px] w-full overflow-hidden rounded-2xl border border-slate-200/10 bg-[linear-gradient(180deg,#0b2b57_0%,#0c3a74_100%)] shadow-[0_18px_45px_rgba(2,8,23,0.28)] md:h-[640px]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_70%_at_18%_22%,rgba(147,197,253,0.18),transparent_70%),radial-gradient(90%_60%_at_78%_72%,rgba(96,165,250,0.16),transparent_75%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_35%,rgba(15,23,42,0.24)_100%)]" />
            <div ref={containerRef} className="h-full w-full" aria-label="Graph Essays Cytoscape Surface" />

            <div className="absolute right-3 top-3 z-40 flex items-center gap-1 rounded-md border border-slate-300/35 bg-slate-950/35 p-1 backdrop-blur">
              <button
                type="button"
                className="rounded px-2 py-1 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                onClick={() => {
                  const cy = cyRef.current;
                  const container = containerRef.current;
                  if (!isCyActive(cy) || !container) {
                    return;
                  }
                  const mode: FlowMode = window.innerWidth >= 980 ? "desktop" : "mobile";
                  applyDeterministicPositions(cy, mode, container.clientWidth, container.clientHeight);
                }}
              >
                Fit
              </button>
              <button
                type="button"
                className="rounded px-2 py-1 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                onClick={() => {
                  const cy = cyRef.current;
                  const container = containerRef.current;
                  if (!isCyActive(cy) || !container) {
                    return;
                  }
                  cy.zoom({
                    level: Math.min(cy.maxZoom(), cy.zoom() * 1.12),
                    renderedPosition: { x: container.clientWidth / 2, y: container.clientHeight / 2 },
                  });
                }}
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                className="rounded px-2 py-1 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                onClick={() => {
                  const cy = cyRef.current;
                  const container = containerRef.current;
                  if (!isCyActive(cy) || !container) {
                    return;
                  }
                  cy.zoom({
                    level: Math.max(cy.minZoom(), cy.zoom() / 1.12),
                    renderedPosition: { x: container.clientWidth / 2, y: container.clientHeight / 2 },
                  });
                }}
                aria-label="Zoom out"
              >
                -
              </button>
            </div>
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
      </section>
    </TooltipProvider>
  );
}
