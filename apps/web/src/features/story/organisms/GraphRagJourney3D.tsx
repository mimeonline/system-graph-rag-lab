"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { StoryStep } from "@/features/story/contracts";

type GraphRagJourney3DProps = {
  step: StoryStep;
};

type SceneNode = {
  id: string;
  pos: [number, number, number];
  color: string;
  size?: number;
  dimmed?: boolean;
};

type SceneEdge = {
  source: string;
  target: string;
  color: string;
  active?: boolean;
};

export function GraphRagJourney3D({ step }: GraphRagJourney3DProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = Math.max(container.clientWidth, 360);
    const height = Math.max(container.clientHeight, 280);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eef5ff");

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.set(step.camera.x, step.camera.y, step.camera.z);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.72);
    const key = new THREE.DirectionalLight(0xdbeafe, 0.95);
    key.position.set(2.5, 3.5, 5);
    const fill = new THREE.PointLight(0x8b5cf6, 0.44, 24);
    fill.position.set(-3, -1.5, 4);
    scene.add(ambient, key, fill);

    const root = new THREE.Group();
    scene.add(root);

    const { nodes, edges, tokenPath } = buildScene(step);
    const nodeById = new Map<string, THREE.Mesh>();

    for (const node of nodes) {
      const geometry = new THREE.SphereGeometry(node.size ?? 0.16, 24, 24);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: node.dimmed ? 0.45 : 1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(node.pos[0], node.pos[1], node.pos[2]);
      nodeById.set(node.id, mesh);
      root.add(mesh);
    }

    for (const edge of edges) {
      const source = nodeById.get(edge.source);
      const target = nodeById.get(edge.target);
      if (!source || !target) {
        continue;
      }
      const points = [source.position.clone(), target.position.clone()];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineDashedMaterial({
        color: new THREE.Color(edge.color),
        dashSize: edge.active ? 0.14 : 0.07,
        gapSize: 0.08,
        transparent: true,
        opacity: edge.active ? 0.95 : 0.42,
      });
      const line = new THREE.Line(geometry, material);
      line.computeLineDistances();
      root.add(line);
    }

    const tokenGeometry = new THREE.SphereGeometry(0.13, 26, 26);
    const tokenMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tokenColor(step.tokenState)),
      emissive: new THREE.Color("#bae6fd"),
      emissiveIntensity: 0.34,
      roughness: 0.2,
      metalness: 0.22,
    });
    const token = new THREE.Mesh(tokenGeometry, tokenMaterial);
    root.add(token);

    const pathCurve = new THREE.CatmullRomCurve3(tokenPath.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    const trail = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pathCurve.getPoints(80)),
      new THREE.LineBasicMaterial({ color: new THREE.Color("#0ea5e9"), transparent: true, opacity: 0.22 }),
    );
    root.add(trail);

    if (step.scenePreset === "scored-retrieval") {
      addGate(root, -1.6, 0.1);
      addGate(root, 0, -0.1);
      addGate(root, 1.55, 0.2);
    }

    if (step.scenePreset === "context-synthesis") {
      const llmFrame = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 1.1, 0.06),
        new THREE.MeshStandardMaterial({ color: "#ddd6fe", transparent: true, opacity: 0.45 }),
      );
      llmFrame.position.set(0.2, 0, -0.1);
      root.add(llmFrame);
    }

    if (step.scenePreset === "decision-subgraph") {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.5, 0.04, 12, 80),
        new THREE.MeshStandardMaterial({ color: "#22c55e", emissive: "#86efac", emissiveIntensity: 0.25 }),
      );
      ring.rotation.x = Math.PI / 2;
      root.add(ring);
    }

    let raf = 0;
    const clock = new THREE.Clock();

    const animateTokenJourney = (elapsed: number) => {
      if (prefersReducedMotion) {
        const p = pathCurve.getPointAt(0.84);
        token.position.copy(p);
        return;
      }
      const t = (elapsed * 0.16) % 1;
      const p = pathCurve.getPointAt(t);
      token.position.copy(p);
      const pulse = 1 + Math.sin(elapsed * 4) * 0.09;
      token.scale.set(pulse, pulse, pulse);
    };

    const animate = () => {
      const t = clock.getElapsedTime();
      animateTokenJourney(t);

      if (!prefersReducedMotion) {
        if (step.animationMode === "orbit") {
          root.rotation.y = Math.sin(t * 0.32) * 0.14;
        }
        if (step.animationMode === "focus") {
          camera.position.x = step.camera.x + Math.sin(t * 0.6) * 0.16;
          camera.position.y = step.camera.y + Math.cos(t * 0.45) * 0.08;
          camera.lookAt(0, 0, 0);
        }
      }

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const w = Math.max(container.clientWidth, 280);
      const h = Math.max(container.clientHeight, 220);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object instanceof THREE.Line) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [step]);

  const edgeLegend = useMemo(() => step.edgeLegend, [step.edgeLegend]);

  return (
    <div className="space-y-2">
      <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#eef5ff]">
        <div ref={containerRef} className="h-full w-full" />
        {step.motionClip ? (
          <div className="pointer-events-none absolute bottom-3 right-3 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm">
            <Image src={step.motionClip} alt={`${step.title} motion loop`} width={240} height={160} unoptimized className="h-auto w-full" />
          </div>
        ) : null}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Kanten-Legende</p>
          <ul className="mt-1.5 space-y-1.5">
            {edgeLegend.map((item) => (
              <li key={item.type} className="flex items-start gap-2">
                <span className="mt-[0.35rem] inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs leading-5 text-slate-700">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-slate-500">LLM Input Preview</p>
          <p className="mt-1 text-xs leading-5 text-slate-700">
            <span className="font-semibold">Nodes:</span> {step.llmInputPreview.nodes.join(", ")}
          </p>
          <p className="text-xs leading-5 text-slate-700">
            <span className="font-semibold">Edges:</span> {step.llmInputPreview.edges.join(", ")}
          </p>
          <p className="text-xs leading-5 text-slate-700">
            <span className="font-semibold">Budget:</span> {step.llmInputPreview.budget}
          </p>
        </div>
      </div>
    </div>
  );
}

function tokenColor(state: StoryStep["tokenState"]): string {
  if (state === "raw") return "#3b82f6";
  if (state === "filtered") return "#06b6d4";
  if (state === "linked") return "#6366f1";
  if (state === "synthesized") return "#8b5cf6";
  return "#22c55e";
}

function addGate(root: THREE.Group, x: number, y: number): void {
  const gate = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.03, 12, 42),
    new THREE.MeshStandardMaterial({ color: "#0ea5e9", transparent: true, opacity: 0.62 }),
  );
  gate.position.set(x, y, -0.12);
  root.add(gate);
}

function buildScene(step: StoryStep): { nodes: SceneNode[]; edges: SceneEdge[]; tokenPath: Array<[number, number, number]> } {
  if (step.scenePreset === "isolated-problem") {
    return {
      nodes: [
        { id: "q", pos: [0, 0, 0], color: "#3b82f6", size: 0.23 },
        { id: "noise1", pos: [-1.5, 0.8, -0.4], color: "#cbd5e1", size: 0.11, dimmed: true },
        { id: "noise2", pos: [1.7, -0.65, -0.5], color: "#cbd5e1", size: 0.11, dimmed: true },
        { id: "noise3", pos: [0.8, 1.15, -0.8], color: "#cbd5e1", size: 0.1, dimmed: true },
      ],
      edges: [
        { source: "q", target: "noise1", color: "#cbd5e1" },
        { source: "q", target: "noise2", color: "#cbd5e1" },
      ],
      tokenPath: [
        [-1.8, -0.9, 0],
        [-0.7, -0.2, 0],
        [0.3, 0.25, 0],
        [-0.2, 0.1, 0],
        [0.9, -0.35, 0],
      ],
    };
  }

  if (step.scenePreset === "scored-retrieval") {
    return {
      nodes: [
        { id: "q", pos: [0, 1.25, 0], color: "#3b82f6", size: 0.2 },
        { id: "r1", pos: [-1.6, 0.1, 0], color: "#14b8a6" },
        { id: "r2", pos: [0, -0.1, 0.1], color: "#14b8a6" },
        { id: "r3", pos: [1.55, 0.2, 0], color: "#14b8a6" },
        { id: "other1", pos: [-2.1, -1.1, -0.7], color: "#cbd5e1", size: 0.1, dimmed: true },
        { id: "other2", pos: [2.2, -1.2, -0.7], color: "#cbd5e1", size: 0.1, dimmed: true },
      ],
      edges: [
        { source: "q", target: "r1", active: true, color: "#38bdf8" },
        { source: "q", target: "r2", active: true, color: "#38bdf8" },
        { source: "q", target: "r3", active: true, color: "#38bdf8" },
      ],
      tokenPath: [
        [0, 1.15, 0],
        [-0.7, 0.7, 0],
        [-1.45, 0.2, 0],
        [-0.2, -0.05, 0],
        [0.2, -0.05, 0],
        [1.3, 0.12, 0],
      ],
    };
  }

  if (step.scenePreset === "relational-graph") {
    return {
      nodes: [
        { id: "q", pos: [0, 1.45, 0], color: "#3b82f6", size: 0.2 },
        { id: "r1", pos: [-1.7, 0.2, 0], color: "#0ea5e9" },
        { id: "r2", pos: [0, 0.1, 0.1], color: "#0ea5e9" },
        { id: "r3", pos: [1.7, 0.2, 0], color: "#0ea5e9" },
        { id: "e1", pos: [-1.1, -1.2, 0], color: "#22c55e" },
        { id: "e2", pos: [0.5, -1.25, 0], color: "#22c55e" },
      ],
      edges: [
        { source: "q", target: "r1", active: true, color: "#60a5fa" },
        { source: "q", target: "r2", active: true, color: "#60a5fa" },
        { source: "q", target: "r3", active: true, color: "#60a5fa" },
        { source: "r1", target: "e1", active: true, color: "#22c55e" },
        { source: "r2", target: "e2", active: true, color: "#22c55e" },
        { source: "r1", target: "r2", active: true, color: "#a78bfa" },
        { source: "r2", target: "r3", active: true, color: "#a78bfa" },
      ],
      tokenPath: [
        [0, 1.35, 0],
        [-1.45, 0.3, 0],
        [-1.15, -0.8, 0],
        [-0.1, 0.0, 0],
        [0.6, -1.05, 0],
        [1.45, 0.2, 0],
      ],
    };
  }

  if (step.scenePreset === "context-synthesis") {
    return {
      nodes: [
        { id: "ctx1", pos: [-2.1, 0.8, 0], color: "#22d3ee" },
        { id: "ctx2", pos: [-2.2, -0.2, 0], color: "#22d3ee" },
        { id: "ctx3", pos: [-1.9, -1.2, 0], color: "#22d3ee" },
        { id: "llm", pos: [0.2, 0, 0], color: "#8b5cf6", size: 0.3 },
        { id: "out", pos: [2.1, 0, 0], color: "#22c55e", size: 0.22 },
      ],
      edges: [
        { source: "ctx1", target: "llm", active: true, color: "#22d3ee" },
        { source: "ctx2", target: "llm", active: true, color: "#22d3ee" },
        { source: "ctx3", target: "llm", active: true, color: "#22d3ee" },
        { source: "llm", target: "out", active: true, color: "#34d399" },
      ],
      tokenPath: [
        [-2.05, 0.75, 0],
        [-2.1, -0.18, 0],
        [-1.9, -1.1, 0],
        [-0.8, -0.5, 0],
        [0.2, 0, 0],
        [1.6, 0, 0],
        [2.1, 0, 0],
      ],
    };
  }

  return {
    nodes: [
      { id: "a1", pos: [-1.6, 1.0, 0], color: "#0ea5e9" },
      { id: "a2", pos: [-0.2, 0.4, 0], color: "#0ea5e9" },
      { id: "a3", pos: [1.2, -0.2, 0], color: "#22c55e", size: 0.2 },
      { id: "action", pos: [2.0, 1.0, 0], color: "#f59e0b", size: 0.24 },
    ],
    edges: [
      { source: "a1", target: "a2", active: true, color: "#60a5fa" },
      { source: "a2", target: "a3", active: true, color: "#60a5fa" },
      { source: "a3", target: "action", active: true, color: "#22c55e" },
    ],
    tokenPath: [
      [-1.55, 1.0, 0],
      [-0.25, 0.42, 0],
      [1.15, -0.18, 0],
      [1.8, 0.6, 0],
      [2.0, 1.0, 0],
    ],
  };
}
