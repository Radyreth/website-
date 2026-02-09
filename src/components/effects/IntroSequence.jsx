import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function IntroSequence({ onComplete }) {
  const containerRef = useRef(null);
  const scanRef = useRef(null);
  const textRef = useRef(null);
  const termRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [scramble, setScramble] = useState("     ");

  useEffect(() => {
    // Skip if already seen or reduced motion
    if (sessionStorage.getItem("reazy-intro-seen") || reducedMotion) {
      onComplete();
      return;
    }

    const chars = "!@#$%^&*<>{}[]~";
    const target = "REAZY";
    let frame = 0;
    const scrambleInterval = setInterval(() => {
      frame++;
      if (frame <= 20) {
        setScramble(
          target.split("").map((c, i) => {
            if (frame > i * 3 + 6) return c;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );
      } else {
        setScramble(target);
        clearInterval(scrambleInterval);
      }
    }, 50);

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("reazy-intro-seen", "1");
        onComplete();
      },
    });

    // Scan line
    tl.fromTo(scanRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.6, ease: "power2.inOut" }
    );

    // Text appear
    tl.fromTo(textRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );

    // Terminal lines
    tl.fromTo(termRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      "+=0.3"
    );

    // Pause
    tl.to({}, { duration: 0.5 });

    // Split reveal
    tl.to(leftRef.current, {
      xPercent: -100,
      duration: 0.6,
      ease: "power3.inOut",
    });
    tl.to(rightRef.current, {
      xPercent: 100,
      duration: 0.6,
      ease: "power3.inOut",
    }, "<");

    return () => {
      tl.kill();
      clearInterval(scrambleInterval);
    };
  }, [onComplete, reducedMotion]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050508",
      }}
    >
      {/* Left panel */}
      <div
        ref={leftRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "#050508",
          zIndex: 2,
        }}
      />
      {/* Right panel */}
      <div
        ref={rightRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: "#050508",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div style={{ textAlign: "center", zIndex: 3, position: "relative" }}>
        {/* Scan line */}
        <div
          ref={scanRef}
          style={{
            width: 200,
            height: 1,
            background: "linear-gradient(90deg, transparent, #00ffcc, transparent)",
            margin: "0 auto 24px",
            transform: "scaleX(0)",
          }}
        />

        {/* Scramble text */}
        <div
          ref={textRef}
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 12,
            color: "#fff",
            fontFamily: "'Courier New', monospace",
            opacity: 0,
          }}
        >
          {scramble}
        </div>

        {/* Terminal lines */}
        <div
          ref={termRef}
          style={{
            marginTop: 24,
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            color: "rgba(0,255,204,0.6)",
            opacity: 0,
          }}
        >
          <div>&gt; init...</div>
          <div>&gt; ready.</div>
        </div>
      </div>
    </div>
  );
}
