"use client";

import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { StoryChapterId } from "../story-flow-model";

type StoryChapterThreeVisualProps = {
  chapterId: StoryChapterId;
};

type ShotConfig = {
  label: "Top" | "Side" | "Orbit";
  camera: [number, number, number];
  target: [number, number, number];
  orbit: boolean;
};

type NodeStatus = "gesichert" | "offen" | "hypothese";

type LightingConfig = {
  ambient: number;
  key: { intensity: number; color: string; position: [number, number, number] };
  fillA: { intensity: number; color: string; position: [number, number, number] };
  fillB: { intensity: number; color: string; position: [number, number, number] };
};

const ROOM_WIDTH = 11.6;
const ROOM_DEPTH = 8.4;
const ROOM_HEIGHT = 3.45;
const FLOOR_Y = -1.25;
const RETRIEVAL_SAFE_ZONE_X = 3.6;
const RETRIEVAL_SAFE_ZONE_Z = 2.2;

const SHOTS: Record<StoryChapterId, ShotConfig> = {
  question: { label: "Top", camera: [0.6, 2.15, 5.8], target: [0, 0.1, 0], orbit: false },
  retrieval: { label: "Side", camera: [5.8, 1.7, 2.0], target: [0, 0.1, 0], orbit: false },
  graph: { label: "Orbit", camera: [0.4, 1.9, 6.0], target: [0, 0, 0], orbit: true },
  synthesis: { label: "Side", camera: [5.2, 1.2, 2.4], target: [0, 0, 0], orbit: false },
  action: { label: "Top", camera: [0.8, 2.0, 5.2], target: [0, 0.1, 0], orbit: false },
};

const LIGHTING: Record<StoryChapterId, LightingConfig> = {
  question: {
    ambient: 0.44,
    key: { intensity: 1.0, color: "#f8fafc", position: [3.5, 6, 4] },
    fillA: { intensity: 0.42, color: "#38bdf8", position: [-4, 2, -2] },
    fillB: { intensity: 0.32, color: "#cbd5e1", position: [3, 1.5, -4] },
  },
  retrieval: {
    ambient: 0.42,
    key: { intensity: 1.02, color: "#e2e8f0", position: [4.4, 5.4, 3.1] },
    fillA: { intensity: 0.5, color: "#22d3ee", position: [-3, 2.4, -2] },
    fillB: { intensity: 0.34, color: "#94a3b8", position: [4, 1.5, -3] },
  },
  graph: {
    ambient: 0.38,
    key: { intensity: 1.12, color: "#f8fafc", position: [3.2, 6.2, 2.8] },
    fillA: { intensity: 0.58, color: "#60a5fa", position: [-4.5, 2.2, -1.4] },
    fillB: { intensity: 0.48, color: "#a78bfa", position: [4.8, 1.7, -3.8] },
  },
  synthesis: {
    ambient: 0.43,
    key: { intensity: 1.06, color: "#f8fafc", position: [3.8, 6, 3.6] },
    fillA: { intensity: 0.5, color: "#22d3ee", position: [-3.6, 2.4, -1.8] },
    fillB: { intensity: 0.38, color: "#34d399", position: [3.5, 1.6, -3.8] },
  },
  action: {
    ambient: 0.46,
    key: { intensity: 1.02, color: "#fef3c7", position: [3.6, 5.8, 3.4] },
    fillA: { intensity: 0.48, color: "#38bdf8", position: [-4.2, 2.2, -1.6] },
    fillB: { intensity: 0.44, color: "#f59e0b", position: [4, 1.5, -3.8] },
  },
};

function useReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function CameraDirector({
  chapterId,
  reducedMotion,
  locked,
}: {
  chapterId: StoryChapterId;
  reducedMotion: boolean;
  locked: boolean;
}): null {
  const { camera, clock } = useThree();
  const target = useMemo(() => new THREE.Vector3(...SHOTS[chapterId].target), [chapterId]);
  const introStart = useRef<number | null>(null);

  useFrame((_state, delta) => {
    if (locked) {
      return;
    }

    const shot = SHOTS[chapterId];
    const elapsed = clock.getElapsedTime();
    if (introStart.current === null) {
      introStart.current = elapsed;
    }
    const introElapsed = elapsed - introStart.current;
    const inIntro = introElapsed < 1.7;
    const desired = new THREE.Vector3(...shot.camera);

    if (shot.orbit && !reducedMotion && inIntro) {
      const radius = 5.8;
      const angle = elapsed * 0.22;
      desired.set(Math.cos(angle) * radius, 1.9, Math.sin(angle) * radius);
    }

    const alpha = 1 - Math.exp(-delta * 4.2);
    camera.position.lerp(desired, alpha);
    camera.lookAt(target);
  });

  return null;
}

function RevealGroup({
  step,
  activeStep,
  children,
}: {
  step: number;
  activeStep: number;
  children: React.ReactNode;
}): React.JSX.Element {
  const ref = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!ref.current) {
      return;
    }

    const active = activeStep >= step;
    const targetScale = active ? 1 : 0.78;
    const targetY = active ? 0 : 0.22;
    const alpha = 1 - Math.exp(-delta * 6.5);

    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), alpha);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, alpha);
  });

  return <group ref={ref}>{children}</group>;
}

function Node({
  position,
  color,
  label,
  emphasis = false,
  status,
  radius,
  hideLabel = false,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  emphasis?: boolean;
  status?: NodeStatus;
  radius?: number;
  hideLabel?: boolean;
}): React.JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const isCore = label.toLowerCase() === "kernfrage";
  const statusLabel = status ?? (isCore ? "gesichert" : "offen");
  const statusClass =
    statusLabel === "gesichert"
      ? "bg-emerald-500"
      : statusLabel === "hypothese"
        ? "bg-amber-500"
        : "bg-slate-400";

  useFrame((state) => {
    if (!emphasis || !meshRef.current || !materialRef.current) {
      return;
    }
    const t = state.clock.getElapsedTime();
    materialRef.current.emissiveIntensity = 0.8 + Math.sin(t * 1.8) * 0.08;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow frustumCulled={false}>
        <sphereGeometry args={[radius ?? (emphasis ? 0.33 : 0.23), 24, 24]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={emphasis ? 0.75 : 0.28}
          roughness={0.3}
          metalness={0.12}
        />
      </mesh>
      {!hideLabel ? (
        <Html center position={[0, 0.74, 0]}>
          <div
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold shadow-sm whitespace-nowrap ${
              isCore
                ? "border border-sky-300/70 bg-sky-50/56 text-sky-900"
                : "border border-slate-200/70 bg-white/50 text-slate-700"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${statusClass}`} />
              {label}
            </span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function PathEdge({
  points,
  color,
  hero = false,
}: {
  points: Array<[number, number, number]>;
  color: string;
  hero?: boolean;
}): React.JSX.Element {
  return (
    <>
      {hero ? (
        <Line
          points={points}
          color="#0f172a"
          lineWidth={5.6}
          transparent
          opacity={1}
          depthTest={false}
          depthWrite={false}
          renderOrder={12}
          frustumCulled={false}
        />
      ) : null}
      <Line
        points={points}
        color={color}
        lineWidth={hero ? 3.2 : 2}
        transparent
        opacity={1}
        depthTest={false}
        depthWrite={false}
        renderOrder={hero ? 13 : 11}
        frustumCulled={false}
      />
    </>
  );
}

function buildAnchoredEdge(
  source: [number, number, number],
  target: [number, number, number],
  sourceRadius: number,
  targetRadius: number,
): Array<[number, number, number]> {
  const from = new THREE.Vector3(...source);
  const to = new THREE.Vector3(...target);
  const direction = to.clone().sub(from).normalize();

  const start = from.clone().add(direction.clone().multiplyScalar(sourceRadius));
  const end = to.clone().sub(direction.clone().multiplyScalar(targetRadius));

  return [
    [start.x, start.y, start.z],
    [end.x, end.y, end.z],
  ];
}

function clampPositionToZone(
  position: [number, number, number],
  maxX: number,
  maxZ: number,
): [number, number, number] {
  return [
    THREE.MathUtils.clamp(position[0], -maxX, maxX),
    position[1],
    THREE.MathUtils.clamp(position[2], -maxZ, maxZ),
  ];
}

function RoomFrame(): React.JSX.Element {
  const halfW = ROOM_WIDTH / 2;
  const halfD = ROOM_DEPTH / 2;
  const topY = FLOOR_Y + ROOM_HEIGHT;

  const corners: Array<[number, number]> = [
    [-halfW, -halfD],
    [halfW, -halfD],
    [halfW, halfD],
    [-halfW, halfD],
  ];

  return (
    <group>
      {corners.map(([x, z], index) => (
        <Line
          key={`corner-${index}`}
          points={[[x, FLOOR_Y, z], [x, topY, z]]}
          color="#94a3b8"
          lineWidth={1.1}
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      ))}
      <Line
        points={[
          [-halfW, FLOOR_Y, -halfD],
          [halfW, FLOOR_Y, -halfD],
          [halfW, FLOOR_Y, halfD],
          [-halfW, FLOOR_Y, halfD],
          [-halfW, FLOOR_Y, -halfD],
        ]}
        color="#94a3b8"
        lineWidth={1}
        transparent
        opacity={0.2}
        depthWrite={false}
      />
      <Line
        points={[
          [-halfW, topY, -halfD],
          [halfW, topY, -halfD],
          [halfW, topY, halfD],
          [-halfW, topY, halfD],
          [-halfW, topY, -halfD],
        ]}
        color="#94a3b8"
        lineWidth={1}
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </group>
  );
}

function ChapterScene({
  chapterId,
  reducedMotion,
  hideNodeLabels,
}: {
  chapterId: StoryChapterId;
  reducedMotion: boolean;
  hideNodeLabels: boolean;
}): React.JSX.Element {
  const timeRef = useRef(0);
  const [activeStep, setActiveStep] = useState(() => (reducedMotion ? 6 : 1));
  const retrievalSafe = (position: [number, number, number]) =>
    clampPositionToZone(position, RETRIEVAL_SAFE_ZONE_X, RETRIEVAL_SAFE_ZONE_Z);

  useFrame((_state, delta) => {
    if (reducedMotion) {
      return;
    }
    timeRef.current += delta;
    const nextStep = Math.min(6, Math.floor(timeRef.current / 1.15) + 1);
    setActiveStep((previous) => (previous === nextStep ? previous : nextStep));
  });

  const visibleStep = reducedMotion ? 6 : activeStep;
  const lighting = LIGHTING[chapterId];

  return (
    <group>
      <fog attach="fog" args={["#dbeafe", 8, 18]} />

      <ambientLight intensity={lighting.ambient} />
      <directionalLight
        castShadow
        position={lighting.key.position}
        intensity={lighting.key.intensity}
        color={lighting.key.color}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={lighting.fillA.position} intensity={lighting.fillA.intensity} color={lighting.fillA.color} />
      <pointLight position={lighting.fillB.position} intensity={lighting.fillB.intensity} color={lighting.fillB.color} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.14} />
      </mesh>
      <mesh position={[0, 0.48, -ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.07} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-ROOM_WIDTH / 2, 0.48, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.06} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[ROOM_WIDTH / 2, 0.48, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.06} />
      </mesh>
      <RoomFrame />

      {chapterId === "question" ? (
        <>
          {(() => {
            const core: [number, number, number] = [0, 0.2, 0];
            const assumptionA: [number, number, number] = [-1.8, 0.5, -0.4];
            const assumptionB: [number, number, number] = [1.9, 0.62, 0.3];
            const coreRadius = 0.33;
            const assumptionRadius = 0.23;
            const edgeA = buildAnchoredEdge(core, assumptionA, coreRadius, assumptionRadius);
            const edgeB = buildAnchoredEdge(core, assumptionB, coreRadius, assumptionRadius);

            return (
              <>
                <RevealGroup step={4} activeStep={visibleStep}>
                  <PathEdge points={edgeA} color="#38bdf8" />
                </RevealGroup>
                <RevealGroup step={5} activeStep={visibleStep}>
                  <PathEdge points={edgeB} color="#38bdf8" />
                </RevealGroup>
              </>
            );
          })()}
          <RevealGroup step={1} activeStep={visibleStep}>
            <Node position={[0, 0.2, 0]} color="#0ea5e9" label="Kernfrage" emphasis status="gesichert" hideLabel={hideNodeLabels} />
          </RevealGroup>
          <RevealGroup step={2} activeStep={visibleStep}>
            <Node position={[-1.8, 0.5, -0.4]} color="#94a3b8" label="Annahme A" status="hypothese" hideLabel={hideNodeLabels} />
          </RevealGroup>
          <RevealGroup step={3} activeStep={visibleStep}>
            <Node position={[1.9, 0.62, 0.3]} color="#94a3b8" label="Annahme B" status="offen" hideLabel={hideNodeLabels} />
          </RevealGroup>
        </>
      ) : null}

      {chapterId === "retrieval" ? (
        <>
          <RevealGroup step={1} activeStep={visibleStep}>
            <mesh position={[0, 0.45, 0.15]}>
              <boxGeometry args={[1.8, 1.8, 1.8]} />
              <meshStandardMaterial color="#0ea5e9" transparent opacity={0.05} />
            </mesh>
            <lineSegments position={[0, 0.45, 0.15]}>
              <edgesGeometry args={[new THREE.BoxGeometry(1.8, 1.8, 1.8)]} />
              <lineBasicMaterial color="#38bdf8" transparent opacity={0.56} />
            </lineSegments>
            <Line
              points={[
                [-0.9, -0.45, 1.05],
                [0.9, -0.45, 1.05],
                [0.9, 1.35, 1.05],
                [-0.9, 1.35, 1.05],
                [-0.9, -0.45, 1.05],
              ]}
              color="#38bdf8"
              lineWidth={1.2}
              transparent
              opacity={0.38}
              depthWrite={false}
            />
          </RevealGroup>

          <RevealGroup step={1} activeStep={visibleStep}>
            <Node
              position={retrievalSafe([-0.5, 0.62, -0.2])}
              color="#34d399"
              label="Kontext hoch"
              status="gesichert"
              radius={0.31}
              hideLabel={hideNodeLabels}
            />
          </RevealGroup>
          <RevealGroup step={2} activeStep={visibleStep}>
            <Node
              position={retrievalSafe([2.95, 0.3, 1.25])}
              color="#6366f1"
              label="Kontext mittel"
              status="offen"
              radius={0.23}
              hideLabel={hideNodeLabels}
            />
            <Node
              position={retrievalSafe([-3.0, 0.16, 1.2])}
              color="#6366f1"
              label="Kontext mittel"
              status="offen"
              radius={0.23}
              hideLabel={hideNodeLabels}
            />
            <Node
              position={retrievalSafe([2.75, -0.08, -1.4])}
              color="#6366f1"
              label="Kontext mittel"
              status="offen"
              radius={0.23}
              hideLabel={hideNodeLabels}
            />
            <Node
              position={retrievalSafe([-2.85, -0.16, -1.45])}
              color="#6366f1"
              label="Kontext mittel"
              status="offen"
              radius={0.23}
              hideLabel={hideNodeLabels}
            />
          </RevealGroup>
          <RevealGroup step={3} activeStep={visibleStep}>
            <Node
              position={retrievalSafe([0, -0.38, -2.15])}
              color="#64748b"
              label="Kontext niedrig"
              status="hypothese"
              radius={0.16}
              hideLabel={hideNodeLabels}
            />
            <Node
              position={retrievalSafe([3.2, -0.5, -0.45])}
              color="#64748b"
              label="Kontext niedrig"
              status="hypothese"
              radius={0.16}
              hideLabel={hideNodeLabels}
            />
            <Node
              position={retrievalSafe([-3.2, -0.52, -0.35])}
              color="#64748b"
              label="Kontext niedrig"
              status="hypothese"
              radius={0.16}
              hideLabel={hideNodeLabels}
            />
            <Node
              position={retrievalSafe([1.85, -0.56, 1.65])}
              color="#64748b"
              label="Kontext niedrig"
              status="hypothese"
              radius={0.16}
              hideLabel={hideNodeLabels}
            />
            <Node
              position={retrievalSafe([-1.95, -0.54, 1.6])}
              color="#64748b"
              label="Kontext niedrig"
              status="hypothese"
              radius={0.16}
              hideLabel={hideNodeLabels}
            />
          </RevealGroup>
          <RevealGroup step={4} activeStep={visibleStep}>
            <Node
              position={retrievalSafe([0, 0.72, 0.35])}
              color="#34d399"
              label="Kontext hoch"
              status="gesichert"
              radius={0.31}
              hideLabel={hideNodeLabels}
            />
          </RevealGroup>
        </>
      ) : null}

      {chapterId === "graph" ? (
        <>
          {(() => {
            const core: [number, number, number] = [0, 0.45, 0];
            const conceptMatchA: [number, number, number] = [-1.55, 0.24, 0];
            const conceptHopA: [number, number, number] = [-2.35, 0.28, 0.28];
            const conceptMatchB: [number, number, number] = [1.55, 0.24, 0];
            const evidenceA: [number, number, number] = [-2.75, -0.56, -0.48];
            const evidenceB: [number, number, number] = [2.95, -0.68, -0.52];
            const coreRadius = 0.33;
            const nodeRadius = 0.23;
            const edgeCoreToMatchA = buildAnchoredEdge(core, conceptMatchA, coreRadius, nodeRadius);
            const edgeCoreToMatchB = buildAnchoredEdge(core, conceptMatchB, coreRadius, nodeRadius);
            const edgeMatchAToHop = buildAnchoredEdge(conceptMatchA, conceptHopA, nodeRadius, nodeRadius);
            const edgeMatchAToEvidence = buildAnchoredEdge(conceptMatchA, evidenceA, nodeRadius, nodeRadius);
            const edgeMatchBToEvidence = buildAnchoredEdge(conceptMatchB, evidenceB, nodeRadius, nodeRadius);

            return (
              <>
                <RevealGroup step={1} activeStep={visibleStep}>
                  <Node position={core} color="#0ea5e9" label="Kernfrage" emphasis status="gesichert" hideLabel={hideNodeLabels} />
                </RevealGroup>
                <RevealGroup step={2} activeStep={visibleStep}>
                  <Node position={conceptMatchA} color="#22c55e" label="Konzept (Match)" status="gesichert" hideLabel={hideNodeLabels} />
                  <Node position={conceptMatchB} color="#22c55e" label="Konzept (Match)" status="gesichert" hideLabel={hideNodeLabels} />
                </RevealGroup>
                <RevealGroup step={3} activeStep={visibleStep}>
                  <Node position={conceptHopA} color="#a78bfa" label="Konzept (Hop)" status="offen" hideLabel={hideNodeLabels} />
                  <Node position={evidenceA} color="#f59e0b" label="Beleg" status="gesichert" hideLabel={hideNodeLabels} />
                  <Node position={evidenceB} color="#f59e0b" label="Beleg" status="gesichert" hideLabel={hideNodeLabels} />
                </RevealGroup>
                <RevealGroup step={4} activeStep={visibleStep}>
                  <PathEdge points={edgeCoreToMatchA} color="#22c55e" />
                  <PathEdge points={edgeCoreToMatchB} color="#f59e0b" />
                  <PathEdge points={edgeMatchAToHop} color="#a78bfa" />
                  <PathEdge points={edgeMatchAToEvidence} color="#f59e0b" />
                </RevealGroup>
                <RevealGroup step={5} activeStep={visibleStep}>
                  <PathEdge points={edgeMatchBToEvidence} color="#f59e0b" />
                </RevealGroup>
              </>
            );
          })()}
        </>
      ) : null}

      {chapterId === "synthesis" ? (
        <>
          {(() => {
            const question: [number, number, number] = [-2.75, 0.2, 0];
            const contextPackage: [number, number, number] = [-0.95, 0.58, 0.26];
            const evidence: [number, number, number] = [0.85, -0.18, 0.16];
            const answer: [number, number, number] = [2.75, 0.2, 0];

            const questionRadius = 0.23;
            const contextRadius = 0.23;
            const evidenceRadius = 0.23;
            const answerRadius = 0.33;
            const mainA = buildAnchoredEdge(question, contextPackage, questionRadius, contextRadius);
            const mainB = buildAnchoredEdge(contextPackage, evidence, contextRadius, evidenceRadius);
            const mainC = buildAnchoredEdge(evidence, answer, evidenceRadius, answerRadius);

            return (
              <>
                <RevealGroup step={1} activeStep={visibleStep}>
                  <Node position={question} color="#0ea5e9" label="Frage" status="gesichert" hideLabel={hideNodeLabels} />
                </RevealGroup>
                <RevealGroup step={2} activeStep={visibleStep}>
                  <Node position={contextPackage} color="#22c55e" label="Kontextpaket" status="gesichert" hideLabel={hideNodeLabels} />
                </RevealGroup>
                <RevealGroup step={3} activeStep={visibleStep}>
                  <Node position={evidence} color="#f59e0b" label="Beleg" status="gesichert" hideLabel={hideNodeLabels} />
                  <Node position={answer} color="#06b6d4" label="Antwort" emphasis status="gesichert" hideLabel={hideNodeLabels} />
                </RevealGroup>
                <RevealGroup step={4} activeStep={visibleStep}>
                  <PathEdge points={mainA} color="#06b6d4" />
                  <PathEdge points={mainB} color="#06b6d4" />
                  <PathEdge points={mainC} color="#06b6d4" />
                </RevealGroup>
              </>
            );
          })()}
        </>
      ) : null}

      {chapterId === "action" ? (
        <>
          {(() => {
            const answer: [number, number, number] = [-2.6, 0.24, 0.05];
            const decision: [number, number, number] = [-0.8, 0.52, 0.12];
            const measure: [number, number, number] = [1.0, 0.2, -0.05];
            const value: [number, number, number] = [2.8, 0.5, 0];
            const nodeRadius = 0.23;
            const activeRadius = 0.33;
            const mainA: Array<[number, number, number]> = [answer, decision];
            const mainB = buildAnchoredEdge(decision, measure, nodeRadius, nodeRadius);
            const mainC = buildAnchoredEdge(measure, value, nodeRadius, activeRadius);

            return (
              <>
                <RevealGroup step={1} activeStep={visibleStep}>
                  <Node position={answer} color="#06b6d4" label="Antwort" status="gesichert" hideLabel={hideNodeLabels} />
                </RevealGroup>
                <RevealGroup step={2} activeStep={visibleStep}>
                  <Node position={decision} color="#22c55e" label="Entscheidung" status="gesichert" hideLabel={hideNodeLabels} />
                </RevealGroup>
                <RevealGroup step={3} activeStep={visibleStep}>
                  <Node position={measure} color="#f59e0b" label="Maßnahme" status="gesichert" hideLabel={hideNodeLabels} />
                  <Node position={value} color="#0ea5e9" label="Mehrwert" emphasis status="offen" hideLabel={hideNodeLabels} />
                </RevealGroup>
                <RevealGroup step={4} activeStep={visibleStep}>
                  <PathEdge points={mainA} color="#0ea5e9" />
                  <PathEdge points={mainB} color="#0ea5e9" />
                  <PathEdge points={mainC} color="#0ea5e9" />
                </RevealGroup>
              </>
            );
          })()}
        </>
      ) : null}
    </group>
  );
}

export function StoryChapterThreeVisual({ chapterId }: StoryChapterThreeVisualProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const [displayChapter, setDisplayChapter] = useState<StoryChapterId>(chapterId);
  const shot = SHOTS[displayChapter];
  const [isUserControlling, setIsUserControlling] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [isCleanView, setIsCleanView] = useState(false);
  const [isRecomposing, setIsRecomposing] = useState(false);
  const controlsRef = useRef<{
    target: THREE.Vector3;
    update: () => void;
    reset: () => void;
    saveState: () => void;
  } | null>(null);

  useEffect(() => {
    const transitionReset = window.setTimeout(() => {
      setIsRecomposing(true);
      setIsUserControlling(false);
      setIntroDone(false);
    }, 0);
    const chapterSwap = window.setTimeout(() => setDisplayChapter(chapterId), 160);
    const introTimeout = window.setTimeout(() => setIntroDone(true), 1700);
    const recompositionTimeout = window.setTimeout(() => setIsRecomposing(false), 520);
    return () => {
      window.clearTimeout(transitionReset);
      window.clearTimeout(chapterSwap);
      window.clearTimeout(introTimeout);
      window.clearTimeout(recompositionTimeout);
    };
  }, [chapterId]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }
    controls.target.set(...shot.target);
    controls.update();
    controls.saveState();
  }, [displayChapter, shot.target]);

  const handleResetView = () => {
    controlsRef.current?.reset();
    setIsUserControlling(false);
    setIntroDone(true);
  };

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950/10">
      <Canvas
        key={displayChapter}
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [...shot.camera], fov: 46 }}
        style={{ opacity: isRecomposing ? 0.86 : 1, transform: isRecomposing ? "scale(0.995)" : "scale(1)", transition: "opacity 260ms ease, transform 260ms ease" }}
      >
        <Suspense fallback={null}>
          <CameraDirector chapterId={displayChapter} reducedMotion={reducedMotion} locked={isUserControlling || introDone} />
          <ChapterScene chapterId={displayChapter} reducedMotion={reducedMotion} hideNodeLabels={isCleanView} />
        </Suspense>

        <OrbitControls
          ref={(instance) => {
            controlsRef.current = instance
              ? {
                  target: instance.target,
                  update: instance.update.bind(instance),
                  reset: instance.reset.bind(instance),
                  saveState: instance.saveState.bind(instance),
                }
              : null;
          }}
          enableZoom
          enablePan={false}
          enableRotate
          enableDamping
          dampingFactor={0.08}
          minDistance={4.5}
          maxDistance={8.2}
          minPolarAngle={0.35}
          maxPolarAngle={2.35}
          autoRotate={shot.orbit && !reducedMotion && !isUserControlling}
          autoRotateSpeed={0.18}
          onStart={() => setIsUserControlling(true)}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_45%,rgba(2,6,23,0.18)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_30%,transparent_70%,rgba(15,23,42,0.14))]" />

      {!isCleanView ? (
        <>
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-slate-200/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 backdrop-blur-sm">
            Shot: {shot.label}
          </div>
          <div className="pointer-events-none absolute right-48 top-4 rounded-md border border-slate-200/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 backdrop-blur-sm">
            Build: Step-by-step
          </div>
          <button
            type="button"
            onClick={handleResetView}
            className="absolute right-4 top-4 rounded-md border border-slate-300/80 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
          >
            Reset View
          </button>
          <aside className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-slate-200/70 bg-white/85 px-2.5 py-2 text-[10px] text-slate-700 shadow-sm">
            <p className="font-semibold uppercase tracking-[0.08em] text-slate-500">Legende</p>
            <p className="mt-1 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />gesichert</p>
            <p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />offen</p>
            <p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />hypothese</p>
          </aside>
        </>
      ) : null}
      <button
        type="button"
        onClick={() => setIsCleanView((current) => !current)}
        className="absolute bottom-4 right-4 rounded-md border border-slate-300/80 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
      >
        {isCleanView ? "Show UI" : "Clean View"}
      </button>
    </div>
  );
}
