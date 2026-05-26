"use client";

import { motion } from "framer-motion";

import type { DemoGraphEdge, DemoGraphNode, DemoGraphNodeKind, DemoGraphTypeId } from "@/features/demo/graph-type-learning-model";

const NODE_STYLE_BY_KIND: Record<DemoGraphNodeKind, { fill: string; stroke: string }> = {
  query: { fill: "#dbeafe", stroke: "#2563eb" },
  source: { fill: "#f8fafc", stroke: "#64748b" },
  concept: { fill: "#e0f2fe", stroke: "#0284c7" },
  rule: { fill: "#fef3c7", stroke: "#d97706" },
  actor: { fill: "#dcfce7", stroke: "#16a34a" },
  decision: { fill: "#ede9fe", stroke: "#7c3aed" },
  event: { fill: "#ffe4e6", stroke: "#e11d48" },
};

type DemoGraphSimulationSvgProps = {
  graphType: {
    id: DemoGraphTypeId;
    title: string;
    nodes: DemoGraphNode[];
    edges: DemoGraphEdge[];
  };
  activeStepIndex: number;
};

export function DemoGraphSimulationSvg({
  graphType,
  activeStepIndex,
}: DemoGraphSimulationSvgProps): React.JSX.Element {
  const activeNodeIds = new Set(
    activeStepIndex === 0
      ? graphType.nodes.slice(0, 3).map((node) => node.id)
      : activeStepIndex === 1
        ? graphType.nodes.slice(1, 5).map((node) => node.id)
        : graphType.nodes.slice(-3).map((node) => node.id),
  );
  const activeEdgeIds = new Set(
    activeStepIndex === 0
      ? graphType.edges.slice(0, 2).map((edge) => edge.id)
      : activeStepIndex === 1
        ? graphType.edges.slice(1, 4).map((edge) => edge.id)
        : graphType.edges.slice(-3).map((edge) => edge.id),
  );
  const nodeById = new Map(graphType.nodes.map((node) => [node.id, node]));

  return (
    <svg viewBox="0 0 760 360" role="img" aria-label={`${graphType.title} Simulation`} className="h-auto w-full">
      <defs>
        <marker id={`arrow-${graphType.id}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
        </marker>
        <filter id={`soft-shadow-${graphType.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect x="1" y="1" width="758" height="358" rx="28" fill="rgba(255,255,255,0.62)" stroke="rgba(148,163,184,0.28)" />
      <path d="M70 318 C220 260, 330 335, 470 286 S650 250, 710 302" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="7 9" />

      {graphType.edges.map((edge) => {
        const source = nodeById.get(edge.source);
        const target = nodeById.get(edge.target);
        if (!source || !target) {
          return null;
        }
        const isActive = activeEdgeIds.has(edge.id);
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        return (
          <g key={edge.id}>
            <motion.line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={isActive ? "#0284c7" : "#94a3b8"}
              strokeWidth={isActive ? 3 : 1.6}
              strokeLinecap="round"
              markerEnd={`url(#arrow-${graphType.id})`}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0.42 }}
              transition={{ duration: 0.25 }}
            />
            <motion.text
              x={midX}
              y={midY - 8}
              textAnchor="middle"
              className="fill-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]"
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            >
              {edge.label}
            </motion.text>
          </g>
        );
      })}

      {graphType.nodes.map((node) => {
        const style = NODE_STYLE_BY_KIND[node.kind];
        const isActive = activeNodeIds.has(node.id);

        return (
          <motion.g
            key={node.id}
            filter={isActive ? `url(#soft-shadow-${graphType.id})` : undefined}
            initial={false}
            animate={{ scale: isActive ? 1.04 : 1, opacity: isActive ? 1 : 0.62 }}
            transition={{ duration: 0.25 }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            <rect
              x={node.x - 54}
              y={node.y - 23}
              width="108"
              height="46"
              rx="14"
              fill={style.fill}
              stroke={isActive ? style.stroke : "#cbd5e1"}
              strokeWidth={isActive ? 2.4 : 1.4}
            />
            <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-slate-950 text-[12px] font-bold">
              {node.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
