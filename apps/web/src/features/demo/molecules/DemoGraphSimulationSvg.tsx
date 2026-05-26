"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { DemoGraphEdge, DemoGraphNode, DemoGraphTypeId } from "@/features/demo/graph-type-learning-model";

type SimulationRole = "human" | "graph" | "llm";

const ROLE_STYLE: Record<SimulationRole, { label: string; fill: string; stroke: string; text: string }> = {
  human: { label: "Mensch", fill: "#e0f2fe", stroke: "#38bdf8", text: "#0369a1" },
  graph: { label: "Graph", fill: "#dcfce7", stroke: "#22c55e", text: "#15803d" },
  llm: { label: "LLM", fill: "#ede9fe", stroke: "#8b5cf6", text: "#6d28d9" },
};

const PHASES = [
  { actor: "Mensch",  color: "#0ea5e9", bgColor: "#e0f2fe", desc: "Anfrage kommt rein" },
  { actor: "LLM",   color: "#7c3aed", bgColor: "#ede9fe", desc: "Intent und Kontext" },
  { actor: "Graph", color: "#16a34a", bgColor: "#dcfce7", desc: "Begriffspfad geladen" },
  { actor: "→",     color: "#0f172a", bgColor: "#f1f5f9", desc: "Antwort erzeugt" },
] as const;

const PHASE_DURATIONS_MS = [850, 850, 850, 10000] as const;
const NW = 56; // node half-width for edge clipping
const NH = 22; // node half-height
const EDGE_NODE_GAP = 14;
const VIEW_W = 860;
const VIEW_H = 535;
const GRAPH_MIN_X = 70;
const GRAPH_MAX_X = 680;
const GRAPH_CENTER_Y = 235;
const GRAPH_Y_SPREAD = 1.18;
const FLOW_OFFSET_Y = 10;
const LLM_NODE_IDS = new Set(["ai", "intent", "answer", "go", "next", "plan"]);
const NODE_ROLE_OVERRIDES: Partial<Record<DemoGraphTypeId, Record<string, SimulationRole>>> = {
  knowledge: {
    q: "human",
    ai: "llm",
    risk: "graph",
    provider: "graph",
    obligation: "graph",
    evidence: "graph",
  },
  domain: {
    q: "human",
    intent: "llm",
    feature: "graph",
    market: "graph",
    control: "graph",
    go: "llm",
  },
  document: {
    q: "human",
    intent: "llm",
    doc: "graph",
    article: "graph",
    claim: "graph",
    answer: "llm",
  },
  conversation: {
    q: "human",
    intent: "llm",
    goal: "graph",
    assumption: "graph",
    open: "graph",
    next: "llm",
  },
  dynamic: {
    q: "human",
    intent: "llm",
    now: "graph",
    future: "graph",
    state: "graph",
    plan: "llm",
  },
};
const NODE_LAYOUT_OVERRIDES: Partial<Record<DemoGraphTypeId, Record<string, { x: number; y: number }>>> = {
  knowledge: {
    q: { x: 105, y: 250 },
    ai: { x: 285, y: 165 },
    risk: { x: 520, y: 165 },
    provider: { x: 520, y: 285 },
    obligation: { x: 725, y: 285 },
    evidence: { x: 725, y: 380 },
  },
  domain: {
    q: { x: 105, y: 305 },
    intent: { x: 285, y: 220 },
    go: { x: 285, y: 420 },
    feature: { x: 520, y: 220 },
    market: { x: 740, y: 220 },
    control: { x: 740, y: 350 },
  },
  document: {
    q: { x: 105, y: 305 },
    intent: { x: 285, y: 220 },
    answer: { x: 285, y: 420 },
    doc: { x: 520, y: 220 },
    article: { x: 740, y: 290 },
    claim: { x: 520, y: 350 },
  },
  conversation: {
    q: { x: 105, y: 305 },
    intent: { x: 285, y: 220 },
    next: { x: 285, y: 420 },
    goal: { x: 520, y: 220 },
    assumption: { x: 740, y: 220 },
    open: { x: 740, y: 350 },
  },
  dynamic: {
    q: { x: 105, y: 305 },
    intent: { x: 285, y: 220 },
    plan: { x: 285, y: 420 },
    now: { x: 520, y: 220 },
    future: { x: 740, y: 220 },
    state: { x: 740, y: 350 },
  },
};

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

function layoutNode(node: DemoGraphNode, graphTypeId: DemoGraphTypeId): DemoGraphNode {
  const override = NODE_LAYOUT_OVERRIDES[graphTypeId]?.[node.id];
  if (override) {
    return {
      ...node,
      ...override,
    };
  }

  const sourceWidth = GRAPH_MAX_X - GRAPH_MIN_X;
  const normalizedX = (node.x - GRAPH_MIN_X) / sourceWidth;
  const role = getNodeRole(node, graphTypeId);
  const lane = {
    human: { min: 78, max: 150 },
    llm: { min: 250, max: 335 },
    graph: { min: 495, max: 795 },
  }[role];

  return {
    ...node,
    x: lane.min + normalizedX * (lane.max - lane.min),
    y: GRAPH_CENTER_Y + (node.y - GRAPH_CENTER_Y) * GRAPH_Y_SPREAD + FLOW_OFFSET_Y,
  };
}

function getNodeRole(node: DemoGraphNode, graphTypeId?: DemoGraphTypeId): SimulationRole {
  const override = graphTypeId ? NODE_ROLE_OVERRIDES[graphTypeId]?.[node.id] : undefined;
  if (override) {
    return override;
  }

  if (node.kind === "query") {
    return "human";
  }
  if (LLM_NODE_IDS.has(node.id)) {
    return "llm";
  }

  return "graph";
}

function getNodeVisualStyle(node: DemoGraphNode, graphTypeId: DemoGraphTypeId): { fill: string; stroke: string; text: string } {
  const role = getNodeRole(node, graphTypeId);

  if (role === "human") {
    return { fill: "#dbeafe", stroke: "#2563eb", text: "#1e3a8a" };
  }

  if (role === "llm") {
    return { fill: "#ede9fe", stroke: "#7c3aed", text: "#3b0764" };
  }

  return { fill: "#dcfce7", stroke: "#16a34a", text: "#14532d" };
}

function edgeLine(s: DemoGraphNode, t: DemoGraphNode) {
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / len;
  const ny = dy / len;
  const ts = Math.min(NW / (Math.abs(nx) || 1e9), NH / (Math.abs(ny) || 1e9));
  return {
    x1: s.x + nx * (ts + EDGE_NODE_GAP),
    y1: s.y + ny * (ts + EDGE_NODE_GAP),
    x2: t.x - nx * (ts + EDGE_NODE_GAP),
    y2: t.y - ny * (ts + EDGE_NODE_GAP),
  };
}

type EdgeRoute = {
  d: string;
  label: { x: number; y: number };
};

function edgeRoute(s: DemoGraphNode, t: DemoGraphNode, graphTypeId: DemoGraphTypeId): EdgeRoute {
  const straight = edgeLine(s, t);
  if (graphTypeId === "knowledge") {
    const label = edgeLabelPosition(s, t);
    return {
      d: `M ${straight.x1} ${straight.y1} L ${straight.x2} ${straight.y2}`,
      label,
    };
  }

  const dx = t.x - s.x;
  const dy = t.y - s.y;
  const horizontalFirst = Math.abs(dx) >= Math.abs(dy);
  const gap = EDGE_NODE_GAP;
  const start = horizontalFirst
    ? { x: s.x + (dx >= 0 ? NW + gap : -NW - gap), y: s.y }
    : { x: s.x, y: s.y + (dy >= 0 ? NH + gap : -NH - gap) };
  const end = horizontalFirst
    ? { x: t.x - (dx >= 0 ? NW + gap : -NW - gap), y: t.y }
    : { x: t.x, y: t.y - (dy >= 0 ? NH + gap : -NH - gap) };
  const mid = horizontalFirst ? (start.x + end.x) / 2 : (start.y + end.y) / 2;
  const points = horizontalFirst
    ? [start, { x: mid, y: start.y }, { x: mid, y: end.y }, end]
    : [start, { x: start.x, y: mid }, { x: end.x, y: mid }, end];
  const segments = points.slice(1).map((point, index) => {
    const previous = points[index];
    return {
      x1: previous.x,
      y1: previous.y,
      x2: point.x,
      y2: point.y,
      length: Math.abs(point.x - previous.x) + Math.abs(point.y - previous.y),
    };
  });
  const longest = segments.reduce((best, segment) => (segment.length > best.length ? segment : best), segments[0]);
  const label = {
    x: (longest.x1 + longest.x2) / 2 + (longest.x1 === longest.x2 ? (longest.x1 < VIEW_W / 2 ? -52 : 52) : 0),
    y: (longest.y1 + longest.y2) / 2 + (longest.y1 === longest.y2 ? -22 : 0),
  };

  return {
    d: `M ${points.map((point) => `${point.x} ${point.y}`).join(" L ")}`,
    label,
  };
}

function edgeLabelPosition(s: DemoGraphNode, t: DemoGraphNode) {
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const midX = (s.x + t.x) / 2;
  const midY = (s.y + t.y) / 2;

  if (Math.abs(dx) > Math.abs(dy) * 2.4) {
    return {
      x: midX,
      y: midY - 40,
    };
  }

  if (Math.abs(dy) > Math.abs(dx) * 1.45) {
    return {
      x: midX + (midX < VIEW_W / 2 ? -64 : 64),
      y: midY,
    };
  }

  const normalX = -dy / len;
  const normalY = dx / len;
  const direction = midY < GRAPH_CENTER_Y ? -1 : 1;

  return {
    x: midX + normalX * 42 * direction,
    y: midY + normalY * 42 * direction,
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

function RoleZoneLabel({ x, y, role }: { x: number; y: number; role: SimulationRole }): React.JSX.Element {
  const style = ROLE_STYLE[role];

  return (
    <g>
      <rect x={x} y={y - 17} width="88" height="24" rx="12" fill="white" stroke={style.stroke} strokeWidth="1" />
      <circle cx={x + 14} cy={y - 5} r="4" fill={style.stroke} />
      <text
        x={x + 25}
        y={y - 1}
        fontSize="10"
        fontWeight="800"
        fontFamily="system-ui,sans-serif"
        fill={style.text}
        style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
      >
        {style.label}
      </text>
    </g>
  );
}

export function DemoGraphSimulationSvg({ graphType }: DemoGraphSimulationSvgProps): React.JSX.Element {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(
      () => setPhase((p) => (p + 1) % PHASES.length),
      PHASE_DURATIONS_MS[phase],
    );
    return () => window.clearTimeout(id);
  }, [graphType.id, phase]);

  const displayNodes = graphType.nodes.map((node) => layoutNode(node, graphType.id));
  const { nodeIds: activeNodeIds, edgeIds: activeEdgeIds } = getPhaseIds(displayNodes, graphType.edges, phase);
  const nodeById = new Map(displayNodes.map((n) => [n.id, n]));
  const current = PHASES[phase];
  const uid = graphType.id;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={`${graphType.title} Simulation`}
      className="h-auto w-full"
    >
      <defs>
        <marker id={`arrow-${uid}`} markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
        </marker>
        <marker id={`arrow-active-${uid}`} markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
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
      <rect x="1" y="1" width={VIEW_W - 2} height={VIEW_H - 2} rx="24" fill="rgba(248,250,252,0.9)" stroke="rgba(148,163,184,0.2)" />

      {/* Role zones */}
      <g opacity="0.82">
        <rect x="18" y="18" width="160" height="430" rx="18" fill="#e0f2fe" opacity="0.42" />
        <rect x="190" y="18" width="180" height="430" rx="18" fill="#ede9fe" opacity="0.42" />
        <rect x="382" y="18" width="460" height="430" rx="18" fill="#dcfce7" opacity="0.32" />
        <RoleZoneLabel x={38} y={40} role="human" />
        <RoleZoneLabel x={210} y={40} role="llm" />
        <RoleZoneLabel x={402} y={40} role="graph" />
      </g>

      {/* Subtle flow path decoration */}
      <path
        d="M70 470 C205 420 352 482 488 434 S704 408 792 458"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="2"
        strokeDasharray="6 10"
        opacity="0.6"
      />

      {/* Pass 1: edge lines + packets (rendered below nodes) */}
      {graphType.edges.map((edge) => {
        const s = nodeById.get(edge.source);
        const t = nodeById.get(edge.target);
        if (!s || !t) return null;
        const isActive = activeEdgeIds.has(edge.id);
        const route = edgeRoute(s, t, graphType.id);

        return (
          <g key={edge.id}>
            <motion.path
              d={route.d}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={`url(#arrow-${isActive ? "active-" : ""}${uid})`}
              animate={{
                stroke: isActive ? "#0284c7" : "#cbd5e1",
                strokeWidth: isActive ? 2.5 : 1.5,
                opacity: isActive ? 1 : 0.35,
              }}
              transition={{ duration: 0.4 }}
            />
            {isActive && (
              <circle r={4.5} fill="#0284c7" opacity="0.9">
                <animateMotion dur="1.15s" repeatCount="indefinite" path={route.d} />
              </circle>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {displayNodes.map((node) => {
        const style = getNodeVisualStyle(node, graphType.id);
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

      {/* Pass 3: edge labels (rendered above nodes so they're never overlapped) */}
      {graphType.edges.map((edge) => {
        const s = nodeById.get(edge.source);
        const t = nodeById.get(edge.target);
        if (!s || !t) return null;
        const isActive = activeEdgeIds.has(edge.id);
        const route = edgeRoute(s, t, graphType.id);
        const { x: midX, y: midY } = route.label;
        const labelLen = edge.label.length * 6.5 + 14;

        return (
          <motion.g key={`label-${edge.id}`} animate={{ opacity: isActive ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
            <rect x={midX - labelLen / 2} y={midY - 10} width={labelLen} height={15} rx={5} fill="white" stroke="#e2e8f0" strokeWidth="1" />
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
        );
      })}

      {/* Phase indicator bar */}
      <g transform="translate(0, 485)">
        <rect x="16" y="0" width={VIEW_W - 32} height="36" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" />

        {/* Progress dots */}
        {PHASES.map((p, i) => {
          const dotX = 44 + i * 205;
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
                  x1={dotX + 8} y1={18} x2={dotX + 182} y2={18}
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
          width="193" height="32"
          rx="10"
          fill={current.bgColor}
          opacity="0.5"
          style={{ x: 16 }}
          animate={{ x: 16 + phase * 205 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 250, damping: 25 }}
        />
      </g>
    </svg>
  );
}
