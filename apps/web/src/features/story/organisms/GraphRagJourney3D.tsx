"use client";

import { useEffect, useRef } from "react";
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
  highlighted?: boolean;
};

type SceneEdge = {
  source: string;
  target: string;
  color?: string;
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
    const height = Math.max(container.clientHeight, 300);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eef5ff");

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.set(step.camera.x, step.camera.y, step.camera.z);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.68);
    const key = new THREE.DirectionalLight(0xdbeafe, 0.9);
    key.position.set(3, 4, 5);
    const fill = new THREE.PointLight(0xa78bfa, 0.6, 24);
    fill.position.set(-4, -2, 5);
    scene.add(ambient, key, fill);

    const root = new THREE.Group();
    scene.add(root);

    const { nodes, edges } = buildScene(step);
    const nodeById = new Map<string, THREE.Mesh>();

    for (const node of nodes) {
      const geometry = new THREE.SphereGeometry(node.size ?? 0.16, 24, 24);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        roughness: 0.35,
        metalness: 0.18,
        emissive: node.highlighted ? new THREE.Color("#bae6fd") : new THREE.Color("#000000"),
        emissiveIntensity: node.highlighted ? 0.25 : 0,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(node.pos[0], node.pos[1], node.pos[2]);
      mesh.userData = { highlighted: node.highlighted === true };
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
        color: new THREE.Color(edge.color ?? "#94a3b8"),
        dashSize: edge.active ? 0.16 : 0.08,
        gapSize: 0.08,
        transparent: true,
        opacity: edge.active ? 0.9 : 0.5,
      });
      const line = new THREE.Line(geometry, material);
      line.computeLineDistances();
      root.add(line);
    }

    if (step.scenePreset === "isolated-problem") {
      const fogSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.4, 32, 32),
        new THREE.MeshBasicMaterial({ color: "#bfdbfe", transparent: true, opacity: 0.12 }),
      );
      fogSphere.position.set(0, 0, -0.5);
      root.add(fogSphere);
    }

    if (step.scenePreset === "decision-subgraph") {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.45, 0.04, 12, 80),
        new THREE.MeshStandardMaterial({ color: "#22c55e", emissive: "#86efac", emissiveIntensity: 0.22 }),
      );
      ring.rotation.x = Math.PI / 2;
      root.add(ring);
    }

    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        if (step.animationMode === "orbit") {
          root.rotation.y += 0.0024;
          root.rotation.x += 0.0008;
        }

        if (step.animationMode === "flow") {
          root.rotation.y = Math.sin(t * 0.5) * 0.18;
        }

        if (step.animationMode === "pulse") {
          nodeById.forEach((mesh) => {
            if (mesh.userData.highlighted) {
              const scale = 1 + Math.sin(t * 2.6) * 0.08;
              mesh.scale.set(scale, scale, scale);
            }
          });
        }

        if (step.animationMode === "focus") {
          camera.position.x = step.camera.x + Math.sin(t * 0.55) * 0.2;
          camera.position.y = step.camera.y + Math.cos(t * 0.5) * 0.1;
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

  return <div ref={containerRef} className="h-[360px] w-full rounded-xl border border-slate-200" />;
}

function buildScene(step: StoryStep): { nodes: SceneNode[]; edges: SceneEdge[] } {
  const isHighlighted = (id: string) => step.highlightNodes.includes(id);

  if (step.scenePreset === "isolated-problem") {
    return {
      nodes: [
        { id: "q", pos: [0, 0, 0], color: "#3b82f6", size: 0.24, highlighted: true },
        { id: "noise1", pos: [-1.6, 0.8, -0.4], color: "#cbd5e1", size: 0.12 },
        { id: "noise2", pos: [1.8, -0.6, -0.5], color: "#cbd5e1", size: 0.12 },
        { id: "noise3", pos: [0.8, 1.3, -0.8], color: "#cbd5e1", size: 0.1 },
      ],
      edges: [
        { source: "q", target: "noise1", color: "#cbd5e1" },
        { source: "q", target: "noise2", color: "#cbd5e1" },
      ],
    };
  }

  if (step.scenePreset === "scored-retrieval") {
    return {
      nodes: [
        { id: "q", pos: [0, 1.25, 0], color: "#3b82f6", size: 0.2, highlighted: true },
        { id: "r1", pos: [-1.6, 0.1, 0], color: "#14b8a6", highlighted: isHighlighted("r1") },
        { id: "r2", pos: [0, -0.1, 0.1], color: "#14b8a6", highlighted: isHighlighted("r2") },
        { id: "r3", pos: [1.55, 0.2, 0], color: "#14b8a6", highlighted: isHighlighted("r3") },
        { id: "other1", pos: [-2.1, -1.1, -0.7], color: "#cbd5e1", size: 0.11 },
        { id: "other2", pos: [2.2, -1.2, -0.7], color: "#cbd5e1", size: 0.11 },
      ],
      edges: [
        { source: "q", target: "r1", active: true, color: "#38bdf8" },
        { source: "q", target: "r2", active: true, color: "#38bdf8" },
        { source: "q", target: "r3", active: true, color: "#38bdf8" },
      ],
    };
  }

  if (step.scenePreset === "relational-graph") {
    return {
      nodes: [
        { id: "q", pos: [0, 1.5, 0], color: "#3b82f6", highlighted: true, size: 0.2 },
        { id: "r1", pos: [-1.7, 0.2, 0], color: "#0ea5e9", highlighted: isHighlighted("r1") },
        { id: "r2", pos: [0, 0.1, 0.1], color: "#0ea5e9", highlighted: isHighlighted("r2") },
        { id: "r3", pos: [1.7, 0.2, 0], color: "#0ea5e9", highlighted: isHighlighted("r3") },
        { id: "e1", pos: [-1.1, -1.2, 0], color: "#22c55e", highlighted: isHighlighted("e1") },
        { id: "e2", pos: [0.5, -1.25, 0], color: "#22c55e", highlighted: isHighlighted("e2") },
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
    };
  }

  if (step.scenePreset === "context-synthesis") {
    return {
      nodes: [
        { id: "ctx1", pos: [-2.1, 0.8, 0], color: "#22d3ee", highlighted: isHighlighted("ctx1") },
        { id: "ctx2", pos: [-2.2, -0.2, 0], color: "#22d3ee", highlighted: isHighlighted("ctx2") },
        { id: "ctx3", pos: [-1.9, -1.2, 0], color: "#22d3ee", highlighted: isHighlighted("ctx3") },
        { id: "llm", pos: [0.2, 0, 0], color: "#8b5cf6", highlighted: true, size: 0.28 },
        { id: "out", pos: [2.1, 0, 0], color: "#22c55e", highlighted: isHighlighted("out") },
      ],
      edges: [
        { source: "ctx1", target: "llm", active: true, color: "#22d3ee" },
        { source: "ctx2", target: "llm", active: true, color: "#22d3ee" },
        { source: "ctx3", target: "llm", active: true, color: "#22d3ee" },
        { source: "llm", target: "out", active: true, color: "#34d399" },
      ],
    };
  }

  return {
    nodes: [
      { id: "a1", pos: [-1.6, 1.0, 0], color: "#0ea5e9", highlighted: isHighlighted("a1") },
      { id: "a2", pos: [-0.2, 0.4, 0], color: "#0ea5e9", highlighted: isHighlighted("a2") },
      { id: "a3", pos: [1.2, -0.2, 0], color: "#22c55e", highlighted: isHighlighted("a3"), size: 0.2 },
      { id: "action", pos: [2.0, 1.0, 0], color: "#f59e0b", highlighted: true, size: 0.24 },
    ],
    edges: [
      { source: "a1", target: "a2", active: true, color: "#60a5fa" },
      { source: "a2", target: "a3", active: true, color: "#60a5fa" },
      { source: "a3", target: "action", active: true, color: "#22c55e" },
    ],
  };
}
