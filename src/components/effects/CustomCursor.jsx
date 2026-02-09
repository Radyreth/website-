import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCursor } from "../../context/CursorContext";
import useMediaQuery from "../../hooks/useMediaQuery";

const TRAIL_COUNT = 6;

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const trailRefs = useRef([]);
  const { cursorType } = useCursor();
  const isTouchDevice = useMediaQuery("(hover: none)");

  useEffect(() => {
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power2.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power2.out" });
    const xGlow = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power2.out" });
    const yGlow = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power2.out" });

    // Trail quickTo - increasing delay for comet effect
    const trailQuickTos = trailRefs.current.map((el, i) => ({
      x: gsap.quickTo(el, "x", { duration: 0.15 + i * 0.08, ease: "power2.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.15 + i * 0.08, ease: "power2.out" }),
    }));

    const onMove = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
      xGlow(e.clientX);
      yGlow(e.clientY);

      trailQuickTos.forEach((qt) => {
        qt.x(e.clientX);
        qt.y(e.clientY);
      });
    };

    window.addEventListener("mousemove", onMove);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "";
    };
  }, [isTouchDevice]);

  // Cursor type reactions
  useEffect(() => {
    if (isTouchDevice) return;
    const ring = ringRef.current;
    if (!ring) return;

    const sizes = {
      default: { width: 36, height: 36, borderWidth: 1, opacity: 0.4 },
      link: { width: 50, height: 50, borderWidth: 2, opacity: 0.6 },
      input: { width: 20, height: 20, borderWidth: 1, opacity: 0.3 },
      button: { width: 60, height: 60, borderWidth: 2, opacity: 0.7 },
    };

    const config = sizes[cursorType] || sizes.default;
    gsap.to(ring, { ...config, duration: 0.3, ease: "power2.out" });
  }, [cursorType, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trail particles (comet effect) */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={`trail-${i}`}
          ref={(el) => { trailRefs.current[i] = el; }}
          style={{
            position: "fixed",
            top: -(2 - i * 0.2),
            left: -(2 - i * 0.2),
            width: Math.max(4 - i * 0.5, 1),
            height: Math.max(4 - i * 0.5, 1),
            borderRadius: "50%",
            background: "#00ffcc",
            opacity: 0.3 - i * 0.04,
            pointerEvents: "none",
            zIndex: 9997,
          }}
        />
      ))}

      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: -4,
          left: -4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#00ffcc",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: -18,
          left: -18,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid rgba(0,255,204,0.4)",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
      {/* Glow */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          top: -100,
          left: -100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,255,204,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </>
  );
}
