import type { HomeGraphModel, HomeGraphNode } from "@/features/home/graph-view-model";

type GraphPreviewProps = {
  model: HomeGraphModel;
};

const NODE_STYLE_BY_KIND: Record<HomeGraphNode["kind"], string> = {
  query: "border-[#153a68] bg-[#dbeafe] text-[#102a43]",
  reference: "border-[#1e4f84] bg-white text-slate-800",
  evidence: "border-[#4a5d7a] bg-slate-100 text-slate-700",
};

/**
 * Lightweight graph preview without external rendering dependencies.
 */
export function GraphPreview({ model }: GraphPreviewProps): React.JSX.Element {
  const nodesById = new Map(model.nodes.map((node) => [node.id, node]));

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Graph-Ansicht</h3>
        <span className="text-xs font-semibold text-slate-500">
          {model.isFallback ? "fallback" : "query-basiert"}
        </span>
      </div>

      <p className="text-sm text-slate-600">{model.caption}</p>

      <div className="relative min-h-[320px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
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
                  x1={`${source.x}%`}
                  y1={`${source.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  className="stroke-slate-300"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        <div className="relative h-[320px] w-full">
          {model.nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute w-[128px] -translate-x-1/2 -translate-y-1/2 rounded-lg border px-3 py-2 text-center text-xs font-medium shadow-sm ${NODE_STYLE_BY_KIND[node.kind]}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              title={node.label}
            >
              {shortLabel(node.label)}
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

            const placement = getEdgeLabelPlacement(source, target);

            return (
              <text
                key={`${edge.id}-label`}
                x={`${placement.x}%`}
                y={`${placement.y}%`}
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

function getEdgeLabelPlacement(source: HomeGraphNode, target: HomeGraphNode): { x: number; y: number } {
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.max(Math.hypot(dx, dy), 0.0001);
  const normalX = (-dy / distance) * 3;
  const normalY = (dx / distance) * 3;
  const verticalPush = Math.min(6, Math.max(2, 26 - Math.min(source.y, target.y)));

  return {
    x: midX + normalX,
    y: midY + normalY + verticalPush,
  };
}
