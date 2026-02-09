import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";

// ─── Torus Knot (Services) ───
function TorusKnotMesh({ mouse }) {
  const meshRef = useRef();
  const reducedMotion = useReducedMotion();

  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#00ffcc"),
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  }), []);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.12;
    meshRef.current.rotation.x = Math.sin(t * 0.08) * 0.3;
    meshRef.current.rotation.z = Math.cos(t * 0.06) * 0.1;

    if (mouse?.current) {
      meshRef.current.rotation.y += (mouse.current.x - 0.5) * 0.15;
      meshRef.current.rotation.x += (mouse.current.y - 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <torusKnotGeometry args={[1, 0.35, 80, 12, 2, 3]} />
    </mesh>
  );
}

// ─── Key Shape (FAQ) ───
function KeyMesh({ mouse }) {
  const groupRef = useRef();
  const reducedMotion = useReducedMotion();

  const cyanMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#00ffcc"),
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  }), []);

  const dimMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#00ffcc"),
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  }), []);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.15;
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.15;

    if (mouse?.current) {
      groupRef.current.rotation.x = (mouse.current.y - 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Key head - torus */}
      <mesh position={[0, 0.8, 0]} material={cyanMat}>
        <torusGeometry args={[0.6, 0.12, 8, 16]} />
      </mesh>
      {/* Key shaft */}
      <mesh position={[0, -0.3, 0]} material={cyanMat}>
        <boxGeometry args={[0.12, 1.8, 0.12]} />
      </mesh>
      {/* Key teeth */}
      <mesh position={[0.2, -0.9, 0]} material={cyanMat}>
        <boxGeometry args={[0.3, 0.12, 0.12]} />
      </mesh>
      <mesh position={[0.15, -1.15, 0]} material={cyanMat}>
        <boxGeometry args={[0.2, 0.12, 0.12]} />
      </mesh>
      {/* Orbiting ring */}
      <mesh position={[0, 0.2, 0]} material={dimMat}>
        <torusGeometry args={[1.3, 0.02, 8, 32]} />
      </mesh>
    </group>
  );
}

// ─── Globe Wireframe (Stats) ───
function GlobeMesh({ mouse }) {
  const groupRef = useRef();
  const reducedMotion = useReducedMotion();

  const mainMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#00ffcc"),
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  }), []);

  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#00ffcc"),
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  }), []);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.rotation.x = 0.2 + Math.sin(t * 0.05) * 0.1;

    if (mouse?.current) {
      groupRef.current.rotation.y += (mouse.current.x - 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main sphere */}
      <mesh material={mainMat}>
        <sphereGeometry args={[1.2, 16, 12]} />
      </mesh>
      {/* Equatorial ring */}
      <mesh material={ringMat} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 8, 40]} />
      </mesh>
      {/* Tilted ring */}
      <mesh material={ringMat} rotation={[Math.PI / 2, 0.5, 0.3]}>
        <torusGeometry args={[1.6, 0.015, 8, 40]} />
      </mesh>
      {/* Small orbit dots (satellites) */}
      <mesh position={[1.5, 0.3, 0]} material={mainMat}>
        <sphereGeometry args={[0.06, 6, 6]} />
      </mesh>
      <mesh position={[-0.5, 1.4, 0.5]} material={mainMat}>
        <sphereGeometry args={[0.04, 6, 6]} />
      </mesh>
    </group>
  );
}

// ─── Shared Canvas wrapper ───
function Scene({ children }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{ pointerEvents: "none" }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.5} />
      {children}
    </Canvas>
  );
}

// ─── SVG Fallbacks ───
function TorusFallback() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", opacity: 0.15 }}>
      <ellipse cx="100" cy="100" rx="70" ry="40" fill="none" stroke="#00ffcc" strokeWidth="0.5" />
      <ellipse cx="100" cy="100" rx="40" ry="70" fill="none" stroke="#00ffcc" strokeWidth="0.5" transform="rotate(30 100 100)" />
      <ellipse cx="100" cy="100" rx="50" ry="55" fill="none" stroke="#00ffcc" strokeWidth="0.3" transform="rotate(-20 100 100)" />
    </svg>
  );
}

function KeyFallback() {
  return (
    <svg viewBox="0 0 100 200" style={{ width: "100%", height: "100%", opacity: 0.15 }}>
      <circle cx="50" cy="50" r="25" fill="none" stroke="#00ffcc" strokeWidth="0.5" />
      <line x1="50" y1="75" x2="50" y2="170" stroke="#00ffcc" strokeWidth="0.5" />
      <line x1="50" y1="140" x2="70" y2="140" stroke="#00ffcc" strokeWidth="0.5" />
      <line x1="50" y1="155" x2="65" y2="155" stroke="#00ffcc" strokeWidth="0.5" />
    </svg>
  );
}

function GlobeFallback() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", opacity: 0.12 }}>
      <circle cx="100" cy="100" r="60" fill="none" stroke="#00ffcc" strokeWidth="0.5" />
      <ellipse cx="100" cy="100" rx="60" ry="25" fill="none" stroke="#00ffcc" strokeWidth="0.3" />
      <ellipse cx="100" cy="100" rx="25" ry="60" fill="none" stroke="#00ffcc" strokeWidth="0.3" />
      <circle cx="100" cy="100" r="75" fill="none" stroke="#00ffcc" strokeWidth="0.2" strokeDasharray="3 5" />
    </svg>
  );
}

// ─── Exported Components ───
export function FloatingTorusKnot({ size = 300 }) {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouse.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const hasWebGL = (() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("webgl2"));
    } catch { return false; }
  })();

  const s = isMobile ? size * 0.6 : size;

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ width: s, height: s }}>
      {hasWebGL ? (
        <Suspense fallback={<TorusFallback />}>
          <Scene><TorusKnotMesh mouse={mouse} /></Scene>
        </Suspense>
      ) : <TorusFallback />}
    </div>
  );
}

export function FloatingKey({ size = 280 }) {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouse.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const hasWebGL = (() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("webgl2"));
    } catch { return false; }
  })();

  const s = isMobile ? size * 0.6 : size;

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ width: s, height: s }}>
      {hasWebGL ? (
        <Suspense fallback={<KeyFallback />}>
          <Scene><KeyMesh mouse={mouse} /></Scene>
        </Suspense>
      ) : <KeyFallback />}
    </div>
  );
}

export function FloatingGlobe({ size = 300 }) {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouse.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const hasWebGL = (() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("webgl2"));
    } catch { return false; }
  })();

  const s = isMobile ? size * 0.6 : size;

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ width: s, height: s }}>
      {hasWebGL ? (
        <Suspense fallback={<GlobeFallback />}>
          <Scene><GlobeMesh mouse={mouse} /></Scene>
        </Suspense>
      ) : <GlobeFallback />}
    </div>
  );
}
