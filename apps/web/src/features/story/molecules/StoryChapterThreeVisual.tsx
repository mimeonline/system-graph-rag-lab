"use client";

import {
    Box,
    Cylinder,
    Float,
    Html,
    Icosahedron,
    Line,
    OrbitControls,
    PointMaterial,
    Points,
    Sphere
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { StoryChapterId } from "../story-flow-model";

/* ─── Shared Components & Utils ─── */

function BackgroundParticles({ count = 100 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  return (
    <Points positions={points}>
      <PointMaterial
        transparent
        color="#38bdf8"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

/* ─── Scene 1: Frage ─── */
function SceneQuestion() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.05);
      groupRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <Icosahedron args={[1, 2]}>
          <meshStandardMaterial 
            color="#0ea5e9" 
            wireframe 
            emissive="#0ea5e9" 
            emissiveIntensity={1} 
            transparent 
            opacity={0.6} 
          />
        </Icosahedron>
        <Sphere args={[0.6, 16, 16]}>
          <meshStandardMaterial 
            color="#38bdf8" 
            emissive="#38bdf8" 
            emissiveIntensity={2} 
            transparent 
            opacity={0.2} 
          />
        </Sphere>
        <Html position={[0, 0, 0]} center transform distanceFactor={5} sprite>
          <div className="bg-sky-950/80 border border-sky-400 px-4 py-2 rounded-lg backdrop-blur-md shadow-2xl">
            <span className="text-sky-100 font-bold text-lg tracking-tighter uppercase whitespace-nowrap">Problem-Knoten</span>
          </div>
        </Html>
      </group>

      <Html position={[2, 1.5, -1]} center>
        <div className="text-sky-400 font-semibold text-xs uppercase tracking-widest whitespace-nowrap opacity-60">Kontext-Annahme</div>
      </Html>
      <Html position={[-2, -1, 1]} center>
        <div className="text-slate-400 text-xs whitespace-nowrap opacity-40 italic">Lösungshorizont</div>
      </Html>

      <BackgroundParticles count={150} />
    </group>
  );
}

/* ─── Scene 2: Kontextauswahl ─── */
function SceneContext() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.z = ((i * 2 + t * 2) % 10) - 5;
        const opacity = 1 - Math.abs(child.position.z / 5);
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          child.material.opacity = opacity * 0.8;
        }
      });
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        {[...Array(8)].map((_, i) => (
          <Sphere key={i} args={[0.2, 16, 16]} position={[(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, 0]}>
            <meshStandardMaterial color={i % 2 === 0 ? "#22d3ee" : "#475569"} transparent />
          </Sphere>
        ))}
      </group>

      {/* Filter Grid */}
      <Box args={[6, 6, 0.05]} position={[0, 0, -0.5]}>
        <meshStandardMaterial 
          color="#38bdf8" 
          wireframe 
          transparent 
          opacity={0.15} 
          emissive="#38bdf8"
          emissiveIntensity={0.5}
        />
        <Html position={[0, 3.2, 0]} center>
          <div className="bg-sky-400/20 text-sky-400 px-3 py-1 rounded border border-sky-400/30 text-[10px] font-bold uppercase tracking-widest">
            Ranking-Filter
          </div>
        </Html>
      </Box>

      <Html position={[-3, 2, 0]} center>
        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest -rotate-90">Vektor-Suche</div>
      </Html>
    </group>
  );
}

/* ─── Scene 3: Graph ─── */
function SceneGraph() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
  });

  const nodes = [
    { pos: [0, 0, 0], color: "#0ea5e9", label: "KERN" },
    { pos: [1.5, 1, -0.5], color: "#22d3ee", label: "Rel A" },
    { pos: [-1.2, 0.8, 1], color: "#a78bfa", label: "Rel B" },
    { pos: [0.5, -1.5, 0.5], color: "#22c55e", label: "Rel C" },
    { pos: [-1.8, -0.5, -1.2], color: "#f59e0b", label: "Rel D" },
  ];

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <group key={i} position={n.pos as [number, number, number]}>
          <Sphere args={[0.3, 16, 16]}>
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.5} />
          </Sphere>
          <Html distanceFactor={10} position={[0, 0.5, 0]} center>
            <div className="text-[10px] font-bold text-sky-100 bg-sky-950/40 px-1 rounded">{n.label}</div>
          </Html>
        </group>
      ))}
      
      {/* Connections */}
      <Line points={[[0,0,0], [1.5, 1, -0.5]]} color="#0ea5e9" lineWidth={1} />
      <Line points={[[0,0,0], [-1.2, 0.8, 1]]} color="#a78bfa" lineWidth={1} />
      <Line points={[[1.5, 1, -0.5], [0.5, -1.5, 0.5]]} color="#22d3ee" lineWidth={1} />
      <Line points={[[0,0,0], [-1.8, -0.5, -1.2]]} color="#f59e0b" lineWidth={1} />

      <Html position={[0, -2.5, 0]} center>
        <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest border-b border-emerald-400/30 pb-1">Themen-Cluster "Beteiligungsmodell"</div>
      </Html>
    </group>
  );
}

/* ─── Scene 4: Synthese ─── */
function SceneSynthesis() {
  const lineRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lineRef.current) {
      lineRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Background swarm */}
      <BackgroundParticles count={300} />

      {/* Primary Path */}
      <group ref={lineRef}>
        <Line 
          points={[[-3, 0, 0], [-1, 1, 0.5], [1, -0.5, 1], [3, 0, 0]]} 
          color="#06b6d4" 
          lineWidth={4} 
        />
        <Html position={[-3, 0.5, 0]} center>
          <div className="bg-sky-500 text-sky-950 text-[10px] font-bold px-2 py-0.5 rounded">FRAGE</div>
        </Html>
        <Html position={[0, 0.8, 0.8]} center>
          <div className="text-sky-300 text-[9px] font-bold uppercase tracking-tighter bg-sky-950/60 p-1 rounded backdrop-blur-sm italic">Prüfung & Validierung...</div>
        </Html>
        <Html position={[3, 0.5, 0]} center>
          <div className="bg-emerald-500 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded">FAZIT</div>
        </Html>
        <Sphere position={[3,0,0]} args={[0.4, 16, 16]}>
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
        </Sphere>
      </group>

      {/* Alternative Path (Rejected) */}
      <Line 
        points={[[-3, 0, 0], [0, -1.5, -1], [3, -0.5, 0]]} 
        color="#ef4444" 
        lineWidth={1} 
        dashed
        dashSize={0.2}
        gapSize={0.1}
      />
      <Html position={[0, -1.8, -1]} center>
        <div className="text-red-500/60 text-[8px] font-bold">WIDERSPRUCH ERKANNT</div>
      </Html>
    </group>
  );
}

/* ─── Scene 5: Handlung ─── */
function SceneAction() {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Box args={[3.5, 0.05, 2.2]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#0ea5e9" transparent opacity={0.3} metalness={0.8} roughness={0.2} />
          <Html position={[0, 0.1, 0]} center transform rotation={[Math.PI / 2, 0, 0]} distanceFactor={8}>
            <div className="flex flex-col items-center">
              <div className="text-sky-100 font-bold text-2xl tracking-tighter">v1.2 OPERATIV</div>
              <div className="text-sky-400 text-[8px] tracking-[0.3em] font-bold mt-1 uppercase">Entscheidungs-Zustand</div>
            </div>
          </Html>
        </Box>
        <Box args={[3.2, 0.05, 2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#334155" transparent opacity={0.2} />
        </Box>
        <Box args={[3.2, 0.05, 2]} position={[0, -0.8, 0]}>
          <meshStandardMaterial color="#334155" transparent opacity={0.1} />
        </Box>
      </Float>

      {/* Connection from Graph (hint) */}
      <Cylinder args={[0.02, 0.02, 2]} position={[-2.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.2} />
      </Cylinder>
      
      <Html position={[-3, 0, 0]} center>
        <div className="text-sky-500 text-[9px] font-bold uppercase tracking-widest -rotate-90 opacity-40">Transform</div>
      </Html>
    </group>
  );
}

/* ─── Main Component ─── */

interface StoryChapterThreeVisualProps {
  chapterId: StoryChapterId;
}

export const StoryChapterThreeVisual: React.FC<StoryChapterThreeVisualProps> = ({ chapterId }) => {
  return (
    <div className="relative h-[450px] w-full rounded-2xl overflow-hidden bg-slate-950/20 glass-panel">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#38bdf8" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ea5e9" />
        
        <Suspense fallback={null}>
          {chapterId === "question" && <SceneQuestion />}
          {chapterId === "retrieval" && <SceneContext />}
          {chapterId === "graph" && <SceneGraph />}
          {chapterId === "synthesis" && <SceneSynthesis />}
          {chapterId === "action" && <SceneAction />}
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={chapterId === "graph"}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-sky-500/30" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-sky-500/30" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-sky-500/30" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-sky-500/30" />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.4em] text-sky-400/20 font-bold pointer-events-none">
        Architectural Simulation • v1.0
      </div>
    </div>
  );
};
