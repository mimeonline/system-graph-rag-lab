import { useEffect, useMemo, useRef, useState } from "react";
import type { HomeGraphModel, HomeGraphNode } from "@/features/home/graph-view-model";

type GraphPreviewProps = {
  model: HomeGraphModel;
};

const NODE_STYLE_BY_KIND: Record<HomeGraphNode["kind"], string> = {
  query: "border-[#174379] bg-[#dbeafe] text-[#102a43]",
  reference: "border-[#225796] bg-white text-slate-800",
  evidence: "border-[#4d6589] bg-slate-100 text-slate-700",
};

const GRAPH_HEIGHT_PX = 340;
const GRAPH_SIDE_PADDING_PX = 60;

/**
 * Lightweight graph preview without external rendering dependencies.
 */
export function GraphPreview({ model }: GraphPreviewProps): React.JSX.Element {
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
        point: getNodeCenter(node, canvasWidth),
      })),
    [model.nodes, canvasWidth],
  );
  const nodesById = new Map(positionedNodes.map(({ node, point }) => [node.id, { node, point }]));

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Graph-Ansicht</h3>
        <span className="text-xs font-semibold text-slate-500">
          {model.isFallback ? "Lernansicht" : "query-basiert"}
        </span>
      </div>

      <p className="text-sm text-slate-600">{model.caption}</p>

      <div className="relative min-h-[340px] overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-sky-50/40 to-indigo-50/40">
        <div ref={canvasRef} className="relative h-[340px] w-full">
          <div className="pointer-events-none absolute -left-10 top-10 h-24 w-24 rounded-full bg-sky-200/30 blur-2xl" />
          <div className="pointer-events-none absolute -right-8 bottom-8 h-20 w-20 rounded-full bg-indigo-200/30 blur-2xl" />

          <svg aria-hidden className="absolute inset-0 h-full w-full">
            {model.edges.map((edge) => {
              const source = nodesById.get(edge.source);
              const target = nodesById.get(edge.target);
              if (!source || !target) {
                return null;
              }

              return (
                <g key={edge.id}>
                  <line
                    x1={source.point.x}
                    y1={source.point.y}
                    x2={target.point.x}
                    y2={target.point.y}
                    className="stroke-slate-300"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </g>
              );
            })}
          </svg>

          <div className="relative h-[340px] w-full">
            {positionedNodes.map(({ node, point }, index) => (
              <div
                key={node.id}
                className={`absolute w-[20%] min-w-[64px] max-w-[112px] rounded-lg border px-2 py-1.5 text-center text-[11px] leading-tight font-medium shadow-sm transition duration-500 ease-out hover:scale-[1.03] sm:max-w-[132px] sm:px-3 sm:text-xs ${NODE_STYLE_BY_KIND[node.kind]} animate-[fade-in-up_420ms_ease-out_forwards] opacity-0`}
                style={{
                  left: `${point.x}px`,
                  top: `${point.y}px`,
                  animationDelay: `${index * 90}ms`,
                }}
                title={node.label}
              >
                {shortLabel(node.compactLabel ?? node.label)}
              </div>
            ))}
          </div>

          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
            {model.edges.map((edge) => {
              const source = nodesById.get(edge.source);
              const target = nodesById.get(edge.target);
              if (!source || !target) {
                return null;
              }

              const placement = getEdgeLabelPlacement(source.point, target.point);

              return (
                <text
                  key={`${edge.id}-label`}
                  x={placement.x}
                  y={placement.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-600 text-[11px]"
                  style={{ paintOrder: "stroke", stroke: "#f8fafc", strokeWidth: 4 }}
                >
                  {edge.label}
                </text>
              );
            })}
          </svg>
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

function getNodeCenter(node: HomeGraphNode, canvasWidth: number): { x: number; y: number } {
  const effectiveWidth = Math.max(canvasWidth, GRAPH_SIDE_PADDING_PX * 2);
  const rawX = (effectiveWidth * node.x) / 100;
  const x = Math.min(
    effectiveWidth - GRAPH_SIDE_PADDING_PX,
    Math.max(GRAPH_SIDE_PADDING_PX, rawX),
  );
  const y = (GRAPH_HEIGHT_PX * node.y) / 100;

  return { x, y };
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
