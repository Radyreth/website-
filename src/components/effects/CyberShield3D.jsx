import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";

function Shield({ mouse }) {
  const meshRef = useRef();
  const scanRef = useRef(0);
  const reducedMotion = useReducedMotion();

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScanLine: { value: 0 },
        uColor: { value: new THREE.Color("#00ffcc") },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScanLine;
        uniform vec3 uColor;
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          edge = pow(edge, 1.5);

          // Scan line effect
          float scan = 1.0 - smoothstep(0.0, 0.3, abs(vPosition.y - uScanLine));
          scan *= 0.6;

          float alpha = edge * 0.6 + scan;
          vec3 finalColor = uColor + vec3(scan * 0.3);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      wireframe: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    shaderMaterial.uniforms.uTime.value = time;

    // Scan line oscillation
    scanRef.current = Math.sin(time * 0.8) * 1.5;
    shaderMaterial.uniforms.uScanLine.value = scanRef.current;

    if (!reducedMotion) {
      // Slow rotation
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

      // Mouse influence (subtle)
      if (mouse.current) {
        const targetRotX = (mouse.current.y - 0.5) * 0.3;
        const targetRotZ = (mouse.current.x - 0.5) * 0.2;
        meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.02;
        meshRef.current.rotation.z += (targetRotZ - meshRef.current.rotation.z) * 0.02;
      }
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <icosahedronGeometry args={[1.8, 1]} />
    </mesh>
  );
}

function ShieldScene({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 50 }}
      style={{ pointerEvents: "none" }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <Shield mouse={mouse} />
    </Canvas>
  );
}

// SVG fallback
function ShieldFallback() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", opacity: 0.3 }}>
      <polygon
        points="100,10 180,50 180,150 100,190 20,150 20,50"
        fill="none"
        stroke="#00ffcc"
        strokeWidth="0.5"
      />
      <polygon
        points="100,30 160,60 160,140 100,170 40,140 40,60"
        fill="none"
        stroke="#00ffcc"
        strokeWidth="0.3"
        opacity="0.5"
      />
      <polygon
        points="100,50 140,70 140,130 100,150 60,130 60,70"
        fill="none"
        stroke="#00ffcc"
        strokeWidth="0.3"
        opacity="0.3"
      />
    </svg>
  );
}

export default function CyberShield3D() {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouse.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  // Check for WebGL support
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl") || canvas.getContext("webgl2"));
    } catch {
      return false;
    }
  })();

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        width: isMobile ? 200 : 400,
        height: isMobile ? 200 : 400,
        position: "relative",
      }}
    >
      {hasWebGL ? (
        <Suspense fallback={<ShieldFallback />}>
          <ShieldScene mouse={mouse} />
        </Suspense>
      ) : (
        <ShieldFallback />
      )}
    </div>
  );
}
