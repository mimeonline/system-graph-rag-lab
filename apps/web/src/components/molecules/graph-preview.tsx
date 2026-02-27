import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { HomeGraphModel, HomeGraphNode } from "@/features/home/graph-view-model";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type GraphPreviewProps = {
  model: HomeGraphModel;
  variant?: "default" | "expanded";
};

const NODE_STYLE_BY_KIND: Record<HomeGraphNode["kind"], string> = {
  query: "border-[#174379] bg-[#dbeafe] text-[#102a43]",
  reference: "border-[#225796] bg-white text-slate-800",
  evidence: "border-[#4d6589] bg-slate-100 text-slate-700",
};

const GRAPH_HEIGHT_PX = 400;
const EXPANDED_GRAPH_HEIGHT_PX = 560;
const MIN_CANVAS_WIDTH_PX = 280;

/**
 * Lightweight graph preview without external rendering dependencies.
 */
export function GraphPreview({ model, variant = "default" }: GraphPreviewProps): React.JSX.Element {
  const graphHeightPx = variant === "expanded" ? EXPANDED_GRAPH_HEIGHT_PX : GRAPH_HEIGHT_PX;
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setCanvasWidth(nextWidth);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const positionedNodes = useMemo(
    () =>
      model.nodes.map((node) => ({
        node,
        point: getNodePoint(node, canvasWidth, graphHeightPx),
        frame: getNodeFrame(node, canvasWidth, graphHeightPx),
      })),
    [model.nodes, canvasWidth, graphHeightPx],
  );
  const nodesById = new Map(positionedNodes.map((item) => [item.node.id, item]));

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
        <div ref={canvasRef} className="relative w-full" style={{ height: `${graphHeightPx}px` }}>
          <div className="pointer-events-none absolute -left-10 top-10 h-24 w-24 rounded-full bg-sky-200/30 blur-2xl" />
          <div className="pointer-events-none absolute -right-8 bottom-8 h-20 w-20 rounded-full bg-indigo-200/30 blur-2xl" />

          <svg aria-hidden className="absolute inset-0 h-full w-full">
            {model.edges.map((edge) => {
              const source = nodesById.get(edge.source);
              const target = nodesById.get(edge.target);
              if (!source || !target) {
                return null;
              }
              const edgePoints = getEdgeEndpoints(source.frame, target.frame);

              return (
                <g key={edge.id}>
                  <line
                    x1={edgePoints.source.x}
                    y1={edgePoints.source.y}
                    x2={edgePoints.target.x}
                    y2={edgePoints.target.y}
                    className="stroke-slate-300"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </g>
              );
            })}
          </svg>

          <TooltipProvider delayDuration={120}>
            <div className="relative w-full" style={{ height: `${graphHeightPx}px` }}>
              {positionedNodes.map(({ node, frame }, index) => (
                <Tooltip key={node.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.06, duration: 0.26 }}
                      whileHover={{ scale: 1.03 }}
                      className={`absolute rounded-lg border px-2 py-1.5 text-center font-medium shadow-sm transition duration-500 ease-out hover:scale-[1.03] sm:px-3 ${NODE_STYLE_BY_KIND[node.kind]} animate-[fade-in-up_420ms_ease-out_forwards] opacity-0`}
                      style={{
                        left: `${frame.left}px`,
                        top: `${frame.top}px`,
                        width: `${frame.width}px`,
                        height: `${frame.height}px`,
                        fontSize: `${getNodeFontSize(node.compactLabel ?? node.label, frame)}px`,
                        lineHeight: 1.2,
                        overflowWrap: "anywhere",
                        animationDelay: `${index * 90}ms`,
                      }}
                    >
                      {fitNodeLabel(node.compactLabel ?? node.label, frame.width)}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>{getNodeTooltipText(node)}</TooltipContent>
                </Tooltip>
              ))}

              {model.edges.map((edge, index) => {
                const source = nodesById.get(edge.source);
                const target = nodesById.get(edge.target);
                if (!source || !target) {
                  return null;
                }
                const edgePoints = getEdgeEndpoints(source.frame, target.frame);
                const placement = getEdgeLabelPlacement(edgePoints.source, edgePoints.target);

                return (
                  <Tooltip key={`${edge.id}-label`}>
                    <TooltipTrigger asChild>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.06 + 0.08, duration: 0.2 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded bg-slate-50/90 px-1.5 py-0.5 text-[11px] font-medium text-slate-600"
                        style={{
                          left: `${placement.x}px`,
                          top: `${placement.y}px`,
                        }}
                      >
                        {edge.label}
                      </motion.span>
                    </TooltipTrigger>
                    <TooltipContent>{getEdgeTooltipText(edge.label)}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
}

function shortLabel(label: string): string {
  const sanitized = label.replace(/\s+/g, " ").trim();
  if (sanitized.length <= 52) {
    return sanitized;
  }

  return `${sanitized.slice(0, 49)}...`;
}

function fitNodeLabel(label: string, width: number): string {
  const base = shortLabel(label);
  const compact = base.replace(/\s+/g, " ").trim();
  const maxChars = width < 100 ? 12 : width < 110 ? 15 : 20;

  if (compact.length <= maxChars) {
    return compact;
  }

  return `${compact.slice(0, Math.max(3, maxChars - 3))}...`;
}

function getNodePoint(
  node: HomeGraphNode,
  canvasWidth: number,
  graphHeightPx: number,
): { x: number; y: number } {
  const effectiveWidth = Math.max(canvasWidth, MIN_CANVAS_WIDTH_PX);
  const sidePaddingPx = getResponsiveSidePadding(effectiveWidth);
  const rawX = (effectiveWidth * node.x) / 100;
  const x = Math.min(
    effectiveWidth - sidePaddingPx,
    Math.max(sidePaddingPx, rawX),
  );
  const y = (graphHeightPx * node.y) / 100;

  return { x, y };
}

function getNodeFrame(
  node: HomeGraphNode,
  canvasWidth: number,
  graphHeightPx: number,
): {
  left: number;
  top: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
} {
  const point = getNodePoint(node, canvasWidth, graphHeightPx);
  const effectiveWidth = Math.max(canvasWidth, MIN_CANVAS_WIDTH_PX);
  const size = getResponsiveNodeSize(node.kind, effectiveWidth);
  const horizontalInset = 6;
  const left = Math.min(
    effectiveWidth - size.width - horizontalInset,
    Math.max(horizontalInset, point.x - size.width / 2),
  );

  return {
    left,
    top: point.y - size.height / 2,
    width: size.width,
    height: size.height,
    centerX: left + size.width / 2,
    centerY: point.y,
  };
}

function getNodeFontSize(
  label: string,
  frame: { width: number; height: number },
): number {
  const text = label.replace(/\s+/g, " ").trim();
  const minPx = 8;
  const maxPx = 12;

  for (let px = maxPx; px >= minPx; px -= 1) {
    const approxCharsPerLine = Math.max(1, Math.floor((frame.width - 12) / (px * 0.56)));
    const approxMaxLines = Math.max(1, Math.floor((frame.height - 10) / (px * 1.2)));
    if (text.length <= approxCharsPerLine * approxMaxLines) {
      return px;
    }
  }

  return minPx;
}

function getResponsiveSidePadding(canvasWidth: number): number {
  return Math.max(24, Math.min(60, Math.round(canvasWidth * 0.1)));
}

function getResponsiveNodeSize(
  kind: HomeGraphNode["kind"],
  canvasWidth: number,
): { width: number; height: number } {
  if (canvasWidth < 360) {
    if (kind === "query") {
      return { width: 96, height: 40 };
    }
    if (kind === "evidence") {
      return { width: 100, height: 52 };
    }
    return { width: 94, height: 44 };
  }

  if (canvasWidth < 420) {
    if (kind === "query") {
      return { width: 106, height: 42 };
    }
    if (kind === "evidence") {
      return { width: 110, height: 54 };
    }
    return { width: 104, height: 46 };
  }

  if (kind === "query") {
    return { width: 120, height: 44 };
  }
  if (kind === "evidence") {
    return { width: 124, height: 56 };
  }
  return { width: 118, height: 48 };
}

function getEdgeEndpoints(
  source: { centerX: number; centerY: number; width: number; height: number },
  target: { centerX: number; centerY: number; width: number; height: number },
): { source: { x: number; y: number }; target: { x: number; y: number } } {
  const sourceAnchor = getBoxEdgeAnchor(source, {
    x: target.centerX,
    y: target.centerY,
  });
  const targetAnchor = getBoxEdgeAnchor(target, {
    x: source.centerX,
    y: source.centerY,
  });

  return {
    source: sourceAnchor,
    target: targetAnchor,
  };
}

function getBoxEdgeAnchor(
  box: { centerX: number; centerY: number; width: number; height: number },
  toward: { x: number; y: number },
): { x: number; y: number } {
  const dx = toward.x - box.centerX;
  const dy = toward.y - box.centerY;

  if (dx === 0 && dy === 0) {
    return { x: box.centerX, y: box.centerY };
  }

  const scale = 1 / Math.max(Math.abs(dx) / (box.width / 2), Math.abs(dy) / (box.height / 2));
  return {
    x: box.centerX + dx * scale,
    y: box.centerY + dy * scale,
  };
}

function getEdgeLabelPlacement(
  source: { x: number; y: number },
  target: { x: number; y: number },
): { x: number; y: number } {
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.max(Math.hypot(dx, dy), 0.0001);
  const normalX = (-dy / distance) * 8;
  const normalY = (dx / distance) * 8;

  return {
    x: midX + normalX,
    y: midY + normalY,
  };
}

function getNodeTooltipText(node: HomeGraphNode): string {
  if (node.kind === "query") {
    return "Frage: Das ist dein Ausgangspunkt.";
  }
  if (node.kind === "evidence") {
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
