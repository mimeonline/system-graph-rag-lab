"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { DemoGraphEdge, DemoGraphNode, DemoGraphNodeKind, DemoGraphTypeId } from "@/features/demo/graph-type-learning-model";

const NODE_STYLE: Record<DemoGraphNodeKind, { fill: string; stroke: string; text: string }> = {
  query:    { fill: "#dbeafe", stroke: "#2563eb", text: "#1e3a8a" },
  source:   { fill: "#f1f5f9", stroke: "#64748b", text: "#334155" },
  concept:  { fill: "#bae6fd", stroke: "#0284c7", text: "#075985" },
  rule:     { fill: "#fde68a", stroke: "#d97706", text: "#78350f" },
  actor:    { fill: "#bbf7d0", stroke: "#16a34a", text: "#14532d" },
  decision: { fill: "#ddd6fe", stroke: "#7c3aed", text: "#3b0764" },
  event:    { fill: "#fecdd3", stroke: "#e11d48", text: "#9f1239" },
};

const PHASES = [
  { actor: "User",  color: "#0ea5e9", bgColor: "#e0f2fe", desc: "Anfrage kommt rein" },
  { actor: "Graph", color: "#16a34a", bgColor: "#dcfce7", desc: "Begriffspfad geladen" },
  { actor: "LLM",   color: "#7c3aed", bgColor: "#ede9fe", desc: "Kontext paketiert" },
  { actor: "→",     color: "#0f172a", bgColor: "#f1f5f9", desc: "Antwort erzeugt" },
] as const;

const PHASE_MS = 2200;
const NW = 56; // node half-width for edge clipping
const NH = 22; // node half-height

type DemoGraphSimulationSvgProps = {
  graphType: {
    id: DemoGraphTypeId;
    title: string;
    nodes: DemoGraphNode[];
    edges: DemoGraphEdge[];
  };
  activeStepIndex?: number;
};

function getPhaseIds(nodes: DemoGraphNode[], edges: DemoGraphEdge[], phase: number) {
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  if (phase >= 0) nodeIds.add(nodes[0]?.id ?? "");
  if (phase >= 1) { nodes.slice(0, 4).forEach((n) => nodeIds.add(n.id)); edges.slice(0, 2).forEach((e) => edgeIds.add(e.id)); }
  if (phase >= 2) { nodes.slice(0, 6).forEach((n) => nodeIds.add(n.id)); edges.slice(0, 4).forEach((e) => edgeIds.add(e.id)); }
  if (phase >= 3) { nodes.forEach((n) => nodeIds.add(n.id)); edges.forEach((e) => edgeIds.add(e.id)); }
  return { nodeIds, edgeIds };
}

function edgeLine(s: DemoGraphNode, t: DemoGraphNode) {
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / len;
  const ny = dy / len;
  const ts = Math.min(NW / (Math.abs(nx) || 1e9), NH / (Math.abs(ny) || 1e9));
  return {
    x1: s.x + nx * ts,
    y1: s.y + ny * ts,
    x2: t.x - nx * ts * 1.5,
    y2: t.y - ny * ts * 1.5,
    midX: (s.x + t.x) / 2,
    midY: (s.y + t.y) / 2 - 10,
  };
}

function splitLabel(label: string): [string, string | null] {
  if (label.length <= 14) return [label, null];
  const spaceIdx = label.indexOf(" ");
  if (spaceIdx > 0 && spaceIdx <= 14) return [label.slice(0, spaceIdx), label.slice(spaceIdx + 1)];
  const hyphenIdx = label.indexOf("-");
  if (hyphenIdx > 0 && hyphenIdx <= 13) return [label.slice(0, hyphenIdx + 1), label.slice(hyphenIdx + 1)];
  return [label.slice(0, 12), label.slice(12)];
}

export function DemoGraphSimulationSvg({ graphType }: DemoGraphSimulationSvgProps): React.JSX.Element {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 4), PHASE_MS);
    return () => clearInterval(id);
  }, [graphType.id]);

  const { nodeIds: activeNodeIds, edgeIds: activeEdgeIds } = getPhaseIds(graphType.nodes, graphType.edges, phase);
  const nodeById = new Map(graphType.nodes.map((n) => [n.id, n]));
  const current = PHASES[phase];
  const uid = graphType.id;

  return (
    <svg
      viewBox="0 0 760 395"
      role="img"
      aria-label={`${graphType.title} Simulation`}
      className="h-auto w-full"
    >
      <defs>
        <marker id={`arrow-${uid}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
        </marker>
        <marker id={`arrow-active-${uid}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L8,3 z" fill="#0284c7" />
        </marker>
        <filter id={`glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="1" y="1" width="758" height="393" rx="24" fill="rgba(248,250,252,0.9)" stroke="rgba(148,163,184,0.2)" />

      {/* Subtle flow path decoration */}
      <path
        d="M60 330 C180 275 310 340 430 290 S620 265 700 310"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="2"
        strokeDasharray="6 10"
        opacity="0.6"
      />

      {/* Edges */}
      {graphType.edges.map((edge) => {
        const s = nodeById.get(edge.source);
        const t = nodeById.get(edge.target);
        if (!s || !t) return null;
        const isActive = activeEdgeIds.has(edge.id);
        const { x1, y1, x2, y2, midX, midY } = edgeLine(s, t);
        const labelLen = edge.label.length * 6.5 + 10;

        return (
          <g key={edge.id}>
            <motion.line
              x1={x1} y1={y1} x2={x2} y2={y2}
              strokeLinecap="round"
              markerEnd={`url(#arrow-${isActive ? "active-" : ""}${uid})`}
              animate={{
                stroke: isActive ? "#0284c7" : "#cbd5e1",
                strokeWidth: isActive ? 2.5 : 1.5,
                opacity: isActive ? 1 : 0.35,
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Edge label with white pill */}
            <motion.g animate={{ opacity: isActive ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <rect
                x={midX - labelLen / 2} y={midY - 10}
                width={labelLen} height={14}
                rx={5}
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={midX} y={midY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8.5"
                fontWeight="700"
                fontFamily="system-ui,sans-serif"
                fill="#64748b"
                style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                {edge.label}
              </text>
            </motion.g>

            {/* Traveling packet dot — uses transform, not cx/cy animation */}
            {isActive && (
              <motion.g
                animate={{ x: [0, x2 - x1], y: [0, y2 - y1], opacity: [0, 1, 1, 0] }}
                style={{ x: 0, y: 0 }}
                transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
              >
                <circle cx={x1} cy={y1} r={4.5} fill="#0284c7" />
              </motion.g>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {graphType.nodes.map((node) => {
        const style = NODE_STYLE[node.kind];
        const isActive = activeNodeIds.has(node.id);
        const [line1, line2] = splitLabel(node.label);

        return (
          <motion.g
            key={node.id}
            filter={isActive ? `url(#shadow-${uid})` : undefined}
            animate={{ scale: isActive ? 1.06 : 1, opacity: isActive ? 1 : 0.45 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 300, damping: 22 }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            {/* Active glow ring */}
            {isActive && (
              <motion.rect
                x={node.x - NW - 5} y={node.y - NH - 5}
                width={(NW + 5) * 2} height={(NH + 5) * 2}
                rx={20}
                fill="none"
                stroke={style.stroke}
                strokeWidth="2"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            <rect
              x={node.x - NW} y={node.y - NH}
              width={NW * 2} height={NH * 2}
              rx={13}
              fill={isActive ? style.fill : "#f8fafc"}
              stroke={isActive ? style.stroke : "#e2e8f0"}
              strokeWidth={isActive ? 2.2 : 1.4}
            />

            {line2 ? (
              <text
                x={node.x}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fontFamily="system-ui,sans-serif"
                fill={isActive ? style.text : "#94a3b8"}
              >
                <tspan x={node.x} dy={node.y - 5}>{line1}</tspan>
                <tspan x={node.x} dy="14">{line2}</tspan>
              </text>
            ) : (
              <text
                x={node.x} y={node.y + 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11.5"
                fontWeight="700"
                fontFamily="system-ui,sans-serif"
                fill={isActive ? style.text : "#94a3b8"}
              >
                {line1}
              </text>
            )}
          </motion.g>
        );
      })}

      {/* Phase indicator bar */}
      <g transform="translate(0, 348)">
        <rect x="16" y="0" width="728" height="36" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" />

        {/* Progress dots */}
        {PHASES.map((p, i) => {
          const dotX = 40 + i * 180;
          const isPast = i <= phase;
          const isCurrent = i === phase;
          return (
            <g key={p.actor}>
              <motion.circle
                cx={dotX} cy={18} r={isCurrent ? 7 : 5}
                animate={{
                  fill: isPast ? p.color : "#e2e8f0",
                  r: isCurrent ? 7 : 5,
                }}
                transition={{ duration: 0.3 }}
              />
              <text
                x={dotX + 12} y={23}
                fontSize="10"
                fontWeight={isCurrent ? "800" : "600"}
                fontFamily="system-ui,sans-serif"
                fill={isCurrent ? p.color : "#94a3b8"}
              >
                {p.actor}
              </text>
              <text
                x={dotX + 12} y={33}
                fontSize="8.5"
                fontFamily="system-ui,sans-serif"
                fill={isCurrent ? "#64748b" : "#cbd5e1"}
                display={isCurrent ? "block" : "none"}
              >
                {p.desc}
              </text>
              {i < PHASES.length - 1 && (
                <motion.line
                  x1={dotX + 8} y1={18} x2={dotX + 158} y2={18}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  animate={{ stroke: i < phase ? PHASES[i].color : "#e2e8f0" }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </g>
          );
        })}

        {/* Current phase highlight — CSS transform only (no SVG x attr) */}
        <motion.rect
          y="2"
          width="170" height="32"
          rx="10"
          fill={current.bgColor}
          opacity="0.5"
          style={{ x: 16 }}
          animate={{ x: 16 + phase * 180 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 250, damping: 25 }}
        />
      </g>
    </svg>
  );
}
