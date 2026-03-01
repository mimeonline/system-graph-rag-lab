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

const ROOM_WIDTH = 11.6;
const ROOM_DEPTH = 8.4;
const ROOM_HEIGHT = 3.45;
const FLOOR_Y = -1.25;

const SHOTS: Record<StoryChapterId, ShotConfig> = {
  question: { label: "Top", camera: [0.6, 2.15, 5.8], target: [0, 0.1, 0], orbit: false },
  retrieval: { label: "Side", camera: [5.8, 1.7, 2.0], target: [0, 0.1, 0], orbit: false },
  graph: { label: "Orbit", camera: [0.4, 1.9, 6.0], target: [0, 0, 0], orbit: true },
  synthesis: { label: "Side", camera: [5.2, 1.2, 2.4], target: [0, 0, 0], orbit: false },
  action: { label: "Top", camera: [0.8, 2.0, 5.2], target: [0, 0.1, 0], orbit: false },
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
}: {
  position: [number, number, number];
  color: string;
  label: string;
  emphasis?: boolean;
}): React.JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const isCore = label.toLowerCase() === "kernfrage";

  useFrame((state) => {
    if (!emphasis || !meshRef.current || !materialRef.current) {
      return;
    }
    const t = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 1.8) * 0.04;
    meshRef.current.scale.setScalar(pulse);
    materialRef.current.emissiveIntensity = 0.8 + Math.sin(t * 1.8) * 0.08;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow frustumCulled={false}>
        <sphereGeometry args={[emphasis ? 0.33 : 0.23, 24, 24]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={emphasis ? 0.75 : 0.28}
          roughness={0.3}
          metalness={0.12}
        />
      </mesh>
      <Html center position={[0, 0.74, 0]}>
        <div
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold shadow-sm whitespace-nowrap ${
            isCore
              ? "border border-sky-300 bg-sky-50/92 text-sky-900"
              : "border border-slate-200/90 bg-white/90 text-slate-700"
          }`}
        >
          {label}
        </div>
      </Html>
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

function ChapterScene({ chapterId, reducedMotion }: { chapterId: StoryChapterId; reducedMotion: boolean }): React.JSX.Element {
  const timeRef = useRef(0);

  useFrame((_state, delta) => {
    timeRef.current += delta;
  });

  const activeStep = reducedMotion ? 6 : Math.min(6, Math.floor(timeRef.current / 1.15) + 1);

  return (
    <group>
      <fog attach="fog" args={["#dbeafe", 8, 18]} />

      <ambientLight intensity={0.42} />
      <directionalLight
        castShadow
        position={[3.5, 6, 4]}
        intensity={1.05}
        color="#f8fafc"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 2, -2]} intensity={0.45} color="#38bdf8" />
      <pointLight position={[3, 1.5, -4]} intensity={0.4} color="#22d3ee" />

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
                <RevealGroup step={4} activeStep={activeStep}>
                  <PathEdge points={edgeA} color="#38bdf8" />
                </RevealGroup>
                <RevealGroup step={5} activeStep={activeStep}>
                  <PathEdge points={edgeB} color="#38bdf8" />
                </RevealGroup>
              </>
            );
          })()}
          <RevealGroup step={1} activeStep={activeStep}>
            <Node position={[0, 0.2, 0]} color="#0ea5e9" label="Kernfrage" emphasis />
          </RevealGroup>
          <RevealGroup step={2} activeStep={activeStep}>
            <Node position={[-1.8, 0.5, -0.4]} color="#94a3b8" label="Annahme A" />
          </RevealGroup>
          <RevealGroup step={3} activeStep={activeStep}>
            <Node position={[1.9, 0.62, 0.3]} color="#94a3b8" label="Annahme B" />
          </RevealGroup>
        </>
      ) : null}

      {chapterId === "retrieval" ? (
        <>
          <RevealGroup step={1} activeStep={activeStep}>
            <Node position={[-2.2, 0.6, -0.6]} color="#22d3ee" label="Kontext hoch" />
          </RevealGroup>
          <RevealGroup step={2} activeStep={activeStep}>
            <Node position={[-0.8, 0.2, 0.4]} color="#38bdf8" label="Kontext mittel" />
          </RevealGroup>
          <RevealGroup step={3} activeStep={activeStep}>
            <Node position={[0.8, -0.1, -0.3]} color="#64748b" label="Kontext niedrig" />
          </RevealGroup>
          <RevealGroup step={4} activeStep={activeStep}>
            <Node position={[2.2, 0.5, 0.5]} color="#22d3ee" label="Kontext hoch" emphasis />
          </RevealGroup>
          <RevealGroup step={5} activeStep={activeStep}>
            <PathEdge points={[[-2.2, 0.6, -0.6], [-0.8, 0.2, 0.4], [2.2, 0.5, 0.5]]} color="#0ea5e9" hero />
          </RevealGroup>
        </>
      ) : null}

      {chapterId === "graph" ? (
        <>
          <RevealGroup step={1} activeStep={activeStep}>
            <Node position={[0, 0.45, 0]} color="#0ea5e9" label="Kernbegriff" emphasis />
          </RevealGroup>
          <RevealGroup step={2} activeStep={activeStep}>
            <Node position={[-2.0, 0.2, -0.2]} color="#22c55e" label="Ursache" />
            <Node position={[2.0, 0.2, 0.2]} color="#a78bfa" label="Trade-off" />
          </RevealGroup>
          <RevealGroup step={3} activeStep={activeStep}>
            <Node position={[0.2, -1.0, 0.1]} color="#f59e0b" label="Beleg" />
          </RevealGroup>
          <RevealGroup step={4} activeStep={activeStep}>
            <PathEdge points={[[0, 0.45, 0], [-2.0, 0.2, -0.2]]} color="#22c55e" />
            <PathEdge points={[[0, 0.45, 0], [2.0, 0.2, 0.2]]} color="#a78bfa" />
          </RevealGroup>
          <RevealGroup step={5} activeStep={activeStep}>
            <PathEdge points={[[-2.0, 0.2, -0.2], [0.2, -1.0, 0.1], [2.0, 0.2, 0.2]]} color="#f59e0b" hero />
          </RevealGroup>
        </>
      ) : null}

      {chapterId === "synthesis" ? (
        <>
          <RevealGroup step={1} activeStep={activeStep}>
            <Node position={[-2.8, 0.2, 0]} color="#0ea5e9" label="Frage" />
          </RevealGroup>
          <RevealGroup step={2} activeStep={activeStep}>
            <Node position={[-1.0, 0.65, 0.3]} color="#22d3ee" label="Konzept" />
          </RevealGroup>
          <RevealGroup step={3} activeStep={activeStep}>
            <Node position={[1.0, -0.1, 0.2]} color="#a78bfa" label="Beziehung" />
            <Node position={[2.8, 0.2, 0]} color="#22c55e" label="Schluss" emphasis />
          </RevealGroup>
          <RevealGroup step={4} activeStep={activeStep}>
            <PathEdge points={[[-2.8, 0.2, 0], [-1.0, 0.65, 0.3], [1.0, -0.1, 0.2], [2.8, 0.2, 0]]} color="#06b6d4" hero />
          </RevealGroup>
          <RevealGroup step={5} activeStep={activeStep}>
            <PathEdge points={[[-2.8, -0.5, -0.3], [0.1, -0.8, -0.6], [2.8, -0.4, -0.2]]} color="#64748b" />
          </RevealGroup>
        </>
      ) : null}

      {chapterId === "action" ? (
        <>
          <RevealGroup step={1} activeStep={activeStep}>
            <Node position={[-2.4, 0.2, 0]} color="#0ea5e9" label="Pfad v1" />
          </RevealGroup>
          <RevealGroup step={2} activeStep={activeStep}>
            <Node position={[-0.6, 0.5, 0.1]} color="#22d3ee" label="Pfad v2" />
          </RevealGroup>
          <RevealGroup step={3} activeStep={activeStep}>
            <Node position={[1.1, 0.1, -0.1]} color="#22c55e" label="Pfad v3" />
            <Node position={[2.9, 0.5, 0]} color="#f59e0b" label="Entscheidung" emphasis />
          </RevealGroup>
          <RevealGroup step={4} activeStep={activeStep}>
            <PathEdge points={[[-2.4, 0.2, 0], [-0.6, 0.5, 0.1], [1.1, 0.1, -0.1], [2.9, 0.5, 0]]} color="#0ea5e9" hero />
          </RevealGroup>
          <RevealGroup step={5} activeStep={activeStep}>
            <PathEdge points={[[-2.4, -0.4, -0.2], [0.7, -0.7, -0.4], [2.9, 0.1, -0.2]]} color="#64748b" />
          </RevealGroup>
        </>
      ) : null}
    </group>
  );
}

export function StoryChapterThreeVisual({ chapterId }: StoryChapterThreeVisualProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const shot = SHOTS[chapterId];
  const [isUserControlling, setIsUserControlling] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const controlsRef = useRef<{
    target: THREE.Vector3;
    update: () => void;
    reset: () => void;
    saveState: () => void;
  } | null>(null);

  useEffect(() => {
    setIsUserControlling(false);
    setIntroDone(false);
    const timeout = window.setTimeout(() => setIntroDone(true), 1700);
    return () => window.clearTimeout(timeout);
  }, [chapterId]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }
    controls.target.set(...shot.target);
    controls.update();
    controls.saveState();
  }, [chapterId, shot.target]);

  const handleResetView = () => {
    controlsRef.current?.reset();
    setIsUserControlling(false);
    setIntroDone(true);
  };

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950/10">
      <Canvas key={chapterId} shadows dpr={[1, 1.8]} camera={{ position: [...shot.camera], fov: 46 }}>
        <Suspense fallback={null}>
          <CameraDirector chapterId={chapterId} reducedMotion={reducedMotion} locked={isUserControlling || introDone} />
          <ChapterScene chapterId={chapterId} reducedMotion={reducedMotion} />
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

      <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-slate-200/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 backdrop-blur-sm">
        Shot: {shot.label}
      </div>
      <div className="pointer-events-none absolute right-28 top-4 rounded-md border border-slate-200/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 backdrop-blur-sm">
        Build: Step-by-step
      </div>
      <button
        type="button"
        onClick={handleResetView}
        className="absolute right-4 top-4 rounded-md border border-slate-300/80 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
      >
        Reset View
      </button>
    </div>
  );
}
